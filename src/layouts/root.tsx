import { Outlet } from 'react-router-dom';
import Header from 'components/layout/header';
import Sidebar from 'components/layout/sidebar';
import Footer from 'components/layout/footer';
import { useEffect } from 'react';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { useAppDispatch } from 'app/hooks';

export default function RootLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fakeFirstLoading() {
      dispatch(showLoading());

      await new Promise((res) => {
        setTimeout(res, 2000);
      });

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
          <div className="ml-16 sm:ml-64 flex-1 min-w-0 border-l border-zinc-700">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
