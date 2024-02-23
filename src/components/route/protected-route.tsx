import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'app/hooks';
import { selectToken } from 'features/auth/auth-slice';
import { toast } from 'sonner';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const userToken = useAppSelector(selectToken);

  if (!userToken) {
    toast.info('You must be logged in to do this action!');
    return <Navigate to="/login" />;
  }

  return children;
}
