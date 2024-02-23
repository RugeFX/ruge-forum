import { useCreateCommentMutation } from 'features/thread/thread-api';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  type Output, minLength, object, string,
} from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { toast } from 'sonner';
import ErrorMessage from 'components/ui/error-message';
import { cn } from 'utils';

interface CommentInputProps {
  threadId: string;
  className?: string;
}

const commentSchema = object({
  content: string([minLength(3, 'Comment must have a minimum of 3 characters!')]),
});

type FormValues = Output<typeof commentSchema>;

export default function CommentInput({ threadId, className }: CommentInputProps) {
  const [createComment] = useCreateCommentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      isDirty, isSubmitting, isValid, errors,
    },
  } = useForm<FormValues>({
    resolver: valibotResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const onPostComment: SubmitHandler<FormValues> = async ({ content }) => {
    try {
      await createComment({ threadId, content }).unwrap();

      toast.success('Successfully created comment!');
      reset();
    } catch (e) {
      toast.error('Failed to create comment!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onPostComment)}
      className={cn('w-full flex flex-col gap-2', className)}
    >
      <textarea
        {...register('content')}
        placeholder="Write a comment"
        className="w-full h-40 placeholder-shown:h-10 p-2 text-base leading-tight resize-none border border-zinc-700 bg-zinc-800 text-white outline-none focus:ring focus:ring-emerald-400 transition-all"
      />
      <ErrorMessage message={errors.content?.message} />
      <div
        className={`flex flex-wrap justify-end gap-2 overflow-hidden ${isDirty ? 'block' : 'hidden'}`}
      >
        <button
          disabled={isSubmitting || !isDirty}
          type="button"
          onClick={() => reset()}
          className="w-20 text-sm font-semibold flex shrink-0 justify-center items-center gap-4 py-1 sm:px-8 text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-65 disabled:hover:bg-zinc-800 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={isSubmitting || !isDirty || !isValid}
          type="submit"
          className="w-20 text-sm font-semibold flex shrink-0 justify-center items-center gap-4 py-1 sm:px-8 text-black bg-emerald-400 hover:bg-emerald-500 disabled:opacity-65 disabled:hover:bg-emerald-400 rounded-md transition-colors"
        >
          Post
        </button>
      </div>
    </form>
  );
}
