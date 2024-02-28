import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Descendant, Node } from 'slate';
import {
  Output, minLength, object, optional, string,
} from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { slateToHtml, slateDemoSlateToHtmlConfig } from '@slate-serializers/html';
import Editor from 'components/thread/editor';
import Input from 'components/ui/input';
import ErrorMessage from 'components/ui/error-message';
import { useCreateThreadMutation } from 'features/thread/thread-api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FetchError } from 'types/error';
import DetailsHeader from 'components/thread/details-header';

const threadSchema = object({
  title: string([minLength(5, 'Title length must have a minimum of 5 characters!')]),
  category: optional(string()),
});

type FormValues = Output<typeof threadSchema>;

const serializeToTrimmedString = (nodes: Descendant[]) => nodes
  .map((n) => Node.string(n))
  .join('\n')
  .trim();

export default function CreateThreadPage() {
  const [editorBody, setEditorBody] = useState<Descendant[]>([
    {
      type: 'heading-two',
      align: 'left',
      children: [{ text: 'Hello World!' }],
    },
  ]);

  const navigate = useNavigate();
  const [create] = useCreateThreadMutation();

  const {
    handleSubmit,
    register,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ resolver: valibotResolver(threadSchema) });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!serializeToTrimmedString(editorBody)) {
      setError('root.body', { message: 'Body input cannot be empty!', type: 'required' });
      return;
    }

    try {
      const body = slateToHtml(editorBody, slateDemoSlateToHtmlConfig);
      const res = await create({ ...data, body }).unwrap();

      toast.success('Successfully created thread!');
      navigate(`/details/${res.thread.id}`);
    } catch (err) {
      const error = err as FetchError;

      if (error.data?.message.includes('body')) {
        setError('root.body', {
          type: 'invalid',
          message: 'Body input is invalid!',
        });
      } else if (error.data?.message.includes('title')) {
        setError('root.body', {
          type: 'invalid',
          message: 'Title input is invalid!',
        });
      } else {
        setError('root', {
          type: 'unexpected',
          message: `An unexpected error has happened, please try again later. (CODE: ${error.status})`,
        });
      }
    }
  };

  return (
    <section className="mb-4 px-5 py-2 w-full overflow-auto">
      <DetailsHeader title="Create a new Thread" />
      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col gap-x-1 gap-y-2 md:flex-row md:items-center">
          <fieldset className="flex-1">
            <label className="text-xs text-zinc-300 leading-none mb-2.5 block" htmlFor="title">
              Title
            </label>
            <Input {...register('title')} className="w-full h-10" placeholder="Title" id="title" />
            <ErrorMessage message={errors.title?.message} />
          </fieldset>
          <fieldset>
            <label className="text-xs text-zinc-300 leading-none mb-2.5 block" htmlFor="category">
              Category
            </label>
            <div className="relative w-full border border-zinc-700">
              <span className="absolute bg-zinc-900 text-zinc-300 px-4 h-full left-0 pt-[0.32rem] text-xl font-semibold align-middle pointer-events-none">
                #
              </span>
              <Input
                {...register('category')}
                className="w-full h-[2.35rem] pl-[3.25rem] border-none"
                placeholder="Category"
                id="category"
              />
            </div>
            <ErrorMessage message={errors.category?.message} />
          </fieldset>
        </div>
        <fieldset>
          <label className="text-xs text-zinc-300 leading-none mb-2.5 block" htmlFor="body">
            Body
          </label>
          <Editor onValueChange={setEditorBody} />
          <ErrorMessage message={errors.root?.body?.message} />
        </fieldset>
        <ErrorMessage message={errors.root?.message} />
        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-emerald-400 text-zinc-900 hover:bg-emerald-500 disabled:bg-emerald-600 inline-flex h-9 w-full items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:outline-none"
        >
          Create Thread
        </button>
      </form>
    </section>
  );
}
