import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'app/hooks';
import { selectToken } from 'features/auth/auth-slice';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const userToken = useAppSelector(selectToken);

  if (userToken) {
    return <Navigate to="/" />;
  }

  return children;
}
