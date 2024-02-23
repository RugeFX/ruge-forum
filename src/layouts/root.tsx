import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { Toaster } from 'sonner';
import { useAppDispatch } from 'app/hooks';
import Header from 'components/layout/header';
import Sidebar from 'components/layout/sidebar/index';
import Footer from 'components/layout/footer';
import LoginPrompt from 'components/login-prompt';

const loadingPromise = new Promise((res) => {
  setTimeout(res, 2000);
});

export default function RootLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fakeFirstLoading() {
      dispatch(showLoading());

      await loadingPromise;

      dispatch(hideLoading());
    }

    fakeFirstLoading();
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="flex flex-col justify-between min-h-screen pt-16 bg-black text-white">
        <main className="w-full inline-flex max-w-screen-lg mx-auto flex-1 border-x border-zinc-700">
          <Sidebar />
          <div className="ml-16 r md:ml-64 flex-1 min-w-0 border-l border-zinc-700">
            <Outlet />
          </div>
        </main>
        <LoginPrompt />
        <Footer />
      </div>
      <Toaster
        theme="dark"
        richColors
        toastOptions={{
          classNames: {
            toast: '!rounded-none !bg-zinc-900 !border-zinc-700',
            success: '!text-emerald-400',
            info: '!text-white',
            description: '!text-zinc-300',
          },
        }}
      />
    </>
  );
}
