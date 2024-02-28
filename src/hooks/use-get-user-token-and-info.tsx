import { useAppSelector } from 'app/hooks';
import { useFetchUserInfoQuery } from 'features/auth/auth-api';
import { selectToken } from 'features/auth/auth-slice';
import type { SubscriptionOptions } from '@reduxjs/toolkit/query';

type Options = SubscriptionOptions & {
  refetchOnMountOrArgChange?: number | boolean;
};

export default function useGetUserTokenAndInfo(options: Options = {}) {
  const userToken = useAppSelector(selectToken);
  const userInfoQuery = useFetchUserInfoQuery(undefined, { skip: !userToken, ...options });

  return [userToken, userInfoQuery] as const;
}
