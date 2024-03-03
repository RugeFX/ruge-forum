import { useMemo } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ExitIcon, LightningBoltIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useAppDispatch } from 'app/hooks';
import Avatar from 'components/ui/avatar';
import { logout } from 'features/auth/auth-slice';
import type { User } from 'types/user';
import { useFetchLeaderboardsQuery } from 'features/leaderboard/leaderboard-api';
import Skeleton from 'components/ui/skeleton';

interface UserProfileProps {
  user?: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const dispatch = useAppDispatch();
  const { data: leaderboard } = useFetchLeaderboardsQuery(undefined, { skip: !user });

  const userScore = useMemo(
    () => leaderboard?.leaderboards.find((leader) => leader.user.id === user?.id)?.score,
    [leaderboard, user],
  );

  const onLogout = () => {
    dispatch(logout());
    toast.success('Successfully logged out!');
  };

  return (
    <div className="w-full space-y-2 divide-y divide-zinc-700">
      <div className="flex gap-4 items-center justify-start">
        <Avatar user={user} />
        {user ? (
          <div className="space-y-0 leading-tight">
            <h2 className="text-base leading-tight font-semibold">{user.name}</h2>
            <span className="text-sm leading-tight text-zinc-300">{user.id}</span>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <Skeleton className="w-full h-2" />
            <Skeleton className="w-full h-5" />
          </div>
        )}
      </div>
      <div className="flex justify-end pt-2 gap-2">
        <span className="text-base flex justify-center items-center gap-1 px-2 py-1 text-white bg-black hover:bg-zinc-900 border border-zinc-700 rounded-md transition-colors select-none">
          <LightningBoltIcon className="size-4 text-emerald-400" />
          {userScore ?? 0}
        </span>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button
              type="button"
              className="font-semibold flex justify-center items-center gap-4 p-2 text-red-300 bg-red-950/70 hover:bg-red-950/90 border border-red-900 rounded-md transition-colors"
            >
              <span className="sr-only">Logout</span>
              <ExitIcon className="size-5" />
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
            <AlertDialog.Content className="data-[state=open]:animate-fade-in text-white fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] bg-zinc-900 p-6 border border-zinc-700 focus:outline-none">
              <AlertDialog.Title className="text-white m-0 text-[17px] font-medium">
                Logging you out
              </AlertDialog.Title>
              <AlertDialog.Description className="text-zinc-300 mt-4 mb-5 text-[15px] leading-normal">
                Are you sure you want to log out?
              </AlertDialog.Description>
              <div className="flex justify-center gap-6 pt-4 border-t border-zinc-700">
                <AlertDialog.Cancel asChild>
                  <button
                    type="button"
                    className="text-white bg-zinc-800 hover:bg-zinc-700 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center px-[15px] font-medium leading-none outline-none rounded-md"
                  >
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-red-300 bg-red-950/70 hover:bg-red-950/90 inline-flex h-[35px] items-center justify-center px-[15px] font-medium leading-none outline-none rounded-md"
                  >
                    Yes, log me out
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  );
}
