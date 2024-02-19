import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'app/store';
import RootLayout from 'layouts/root';
import ThreadsPage from 'pages/threads-page';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ThreadsPage />,
      },
      {
        path: 'about',
        element: <div>About</div>,
      },
      {
        path: '*',
        element: (
          <div className="w-full min-h-72 grid place-items-center">
            <h1 className="text-2xl">
              Sorry, we couldn&apos;t find the page you&apos;re looking for!
            </h1>
          </div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
