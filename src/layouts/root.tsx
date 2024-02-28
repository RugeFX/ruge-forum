import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { Toaster } from 'sonner';
import { useAppDispatch } from 'app/hooks';
import Header from 'components/layout/header';
import Sidebar from 'components/layout/navigation/sidebar';
import Footer from 'components/layout/footer';
import LoginPrompt from 'components/login-prompt';
import MobileNav from 'components/layout/navigation/mobile-nav';

const loadingPromise = new Promise((res) => {
  setTimeout(res, 2000);
});

export default function RootLayout() {
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ query: '(max-width: 639px)' });

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
      <div className="flex flex-col justify-between min-h-screen bg-black text-white">
        <Header />
        <main className="w-full inline-flex max-w-screen-lg mx-auto flex-1 border-x border-zinc-700">
          {!isMobile && <Sidebar />}
          <div className="flex-1 min-w-0 sm:border-l border-zinc-700">
            <Outlet />
          </div>
        </main>
        <LoginPrompt />
        {isMobile && <MobileNav />}
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
