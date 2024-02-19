import { valibotResolver } from '@hookform/resolvers/valibot';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ThreadsList from 'components/thread/threads-list';
import {
  useFetchUserInfoQuery,
  useLoginMutation,
} from 'features/auth/auth-api';
import { logout } from 'features/auth/auth-slice';
import { useCreateThreadMutation } from 'features/thread/thread-api';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Output, object, string } from 'valibot';

const formSchema = object({
  title: string(),
  body: string(),
});

type FormSchema = Output<typeof formSchema>;

function App() {
  const { userInfo, userToken } = useAppSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('rugefx@email.com');
  const [password, setPassword] = useState('ruge123');

  const { refetch } = useFetchUserInfoQuery(undefined, { skip: !userToken });
  const [createThread] = useCreateThreadMutation();

  const onLogin = async () => {
    try {
      await login({ email, password });
      await refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const onLogout = () => dispatch(logout());

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormSchema>({
    resolver: valibotResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    await new Promise((res) => {
      setTimeout(res, 2000);
    });
    console.log(data);

    await createThread(data);

    reset();
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <h1 className="text-3xl text-amber-500 font-bold">
        {userToken !== null ? userInfo?.name : 'Login'}
      </h1>
      {userToken ? (
        <button
          type="button"
          onClick={onLogout}
          className="border p-2"
          disabled={isLoading}
        >
          Logout
        </button>
      ) : (
        <button
          type="button"
          onClick={onLogin}
          className="border p-2"
          disabled={isLoading}
        >
          Login
        </button>
      )}
      <section className="mx-auto max-w-screen-lg">
        <ThreadsList />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <input {...register('title')} className="w-full text-black" />
          <textarea {...register('body')} className="w-full text-black" />
          <button
            type="submit"
            className="bg-white text-black mt-4 w-full p-3 rounded-md disabled:opacity-65"
            disabled={isSubmitting}
          >
            Create Thread
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
