import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  Output, email, minLength, object, string,
} from 'valibot';
import Logo from 'components/logo';
import { useLoginMutation } from 'features/auth/auth-api';
import Input from 'components/ui/input';
import ErrorMessage from 'components/ui/error-message';
import { FetchError } from 'types/error';

const loginSchema = object({
  email: string([email('Please provide a valid email!')]),
  password: string([minLength(6, 'Password must have a minimum of 6 characters!')]),
});

type FormValues = Output<typeof loginSchema>;

export default function LoginModal() {
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const onOpenChange = (open: boolean) => {
    if (!open) navigate('/');
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ resolver: valibotResolver(loginSchema) });

  const onLogin: SubmitHandler<FormValues> = async (data) => {
    try {
      await login(data).unwrap();
      toast.success('Successfully logged in!');

      navigate('/');
    } catch (err) {
      const error = err as FetchError;

      if (error.data?.message.includes('wrong')) {
        setError('root', {
          type: 'invalid',
          message: 'Username or password is incorrect!',
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
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="z-50 data-[state=open]:animate-fade-in text-white fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] bg-zinc-900 p-6 border border-zinc-700 focus:outline-none">
          <Dialog.Title className="text-center m-0 font-bold">
            <Logo />
            <span className="sr-only">Login</span>
          </Dialog.Title>
          <Dialog.Description className="text-white mt-3 mb-5 text-normal text-center leading-normal">
            Please log-in to continue
          </Dialog.Description>
          <form onSubmit={handleSubmit(onLogin)}>
            <fieldset className="mb-4 w-full flex flex-col justify-start">
              <label className="text-xs text-zinc-300 leading-none mb-2.5 block" htmlFor="email">
                Email
              </label>
              <Input {...register('email')} type="email" id="email" />
              <ErrorMessage message={errors.email?.message} />
            </fieldset>
            <fieldset className="mb-4 w-full flex flex-col justify-start">
              <label className="text-xs text-zinc-300 leading-none mb-2.5 block" htmlFor="password">
                Password
              </label>
              <Input {...register('password')} type="password" id="password" />
              <ErrorMessage message={errors.password?.message} />
            </fieldset>
            <ErrorMessage message={errors.root?.message} />
            <div className="mt-4 pt-4 flex flex-col items-center border-t border-zinc-700">
              <button
                disabled={isSubmitting}
                type="submit"
                className="bg-emerald-400 text-zinc-900 hover:bg-emerald-500 disabled:bg-emerald-600 inline-flex h-9 w-full items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:outline-none"
              >
                Login
              </button>
              <span className="mt-2">
                Don&apos;t have an account yet?
                {' '}
                <Link to="/sign-up" className="text-emerald-400 underline">
                  Create one here!
                </Link>
              </span>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-2 right-2 inline-flex h-5 w-5 appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
