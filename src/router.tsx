import { type RouteObject, createBrowserRouter } from 'react-router-dom';
import RootLayout from 'layouts/root';
import GlobalNotFound from 'components/global-not-found';
import LoginModal from 'components/modal/login-modal';
import SignUpModal from 'components/modal/sign-up-modal';
import ProtectedRoute from 'components/route/protected-route';
import PublicRoute from 'components/route/public-route';
import CreateThreadPage from 'pages/create-thread-page';
import LeaderboardPage from 'pages/leaderboard-page';
import ThreadDetailsPage from 'pages/thread-details-page';
import ThreadsPage from 'pages/threads-page';

export const routes: RouteObject[] = [
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
];

const router = createBrowserRouter(routes);

export default router;
