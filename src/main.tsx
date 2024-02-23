import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'app/store';
import RootLayout from 'layouts/root';
import ThreadsPage from 'pages/threads-page';
import ProtectedRoute from 'components/route/protected-route';
import PublicRoute from 'components/route/public-route';
import LoginModal from 'components/modal/login-modal';
import SignUpModal from 'components/modal/sign-up-modal';
import GlobalNotFound from 'components/global-not-found';
import CreateThreadPage from 'pages/create-thread-page';
import ThreadDetailsPage from 'pages/thread-details-page';
import LeaderboardPage from 'pages/leaderboard-page';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <ThreadsPage />,
        children: [
          {
            path: 'login',
            element: (
              <PublicRoute>
                <LoginModal />
              </PublicRoute>
            ),
          },
          {
            path: 'sign-up',
            element: (
              <PublicRoute>
                <SignUpModal />
              </PublicRoute>
            ),
          },
        ],
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'details/:threadId',
        element: <ThreadDetailsPage />,
      },
      {
        path: 'new',
        element: (
          <ProtectedRoute>
            <CreateThreadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <GlobalNotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>,
);
