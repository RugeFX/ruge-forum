import * as Popover from '@radix-ui/react-popover';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { Cross2Icon, EnterIcon } from '@radix-ui/react-icons';
import { useAppSelector } from 'app/hooks';
import { selectToken } from 'features/auth/auth-slice';
import { useFetchUserInfoQuery } from 'features/auth/auth-api';
import Avatar from 'components/avatar';
import UserProfile from './user-profile';

export default function UserSection() {
  const userToken = useAppSelector(selectToken);
  const { data: userInfo } = useFetchUserInfoQuery(undefined, {
    skip: !userToken,
    refetchOnFocus: false,
  });

  const isTablet = useMediaQuery({ query: '(max-width: 767px)' });

  if (isTablet) {
    return (
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="size-10 flex justify-center items-center text-emerald-200 hover:bg-emerald-950 rounded-full hover:brightness-110 transition-all"
          >
            <span className="sr-only">User Info</span>
            {userToken ? <Avatar user={userInfo?.user} /> : <EnterIcon className="size-7" />}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-[101] rounded p-5 w-64 bg-black border border-zinc-700 text-white"
            sideOffset={5}
            side="right"
          >
            {userToken ? (
              <UserProfile user={userInfo?.user} />
            ) : (
              <div className="w-full space-y-2">
                <h2 className="text-base text-center font-semibold">Login or Create an Account</h2>
                <Link
                  to="/login"
                  className="w-full font-semibold flex justify-center items-center gap-4 py-1 sm:px-8 text-black bg-emerald-400 hover:bg-emerald-500 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="w-full font-semibold flex justify-center items-center gap-4 py-1 sm:px-8 text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Popover.Close
              className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-violet7 outline-none cursor-default"
              aria-label="Close"
            >
              <Cross2Icon />
            </Popover.Close>
            <Popover.Arrow className="fill-zinc-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <div className="w-full space-y-2">
      {userToken ? (
        <UserProfile user={userInfo?.user} />
      ) : (
        <>
          <h2 className="text-base text-center font-semibold">Login or Create an Account</h2>
          <Link
            to="/login"
            className="w-full font-semibold flex justify-center items-center gap-4 py-1 sm:px-8 text-black bg-emerald-400 hover:bg-emerald-500 rounded-md transition-colors"
          >
            Login
          </Link>
          <Link
            to="/sign-up"
            className="w-full font-semibold flex justify-center items-center gap-4 py-1 sm:px-8 text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}
