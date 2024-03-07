import * as Popover from '@radix-ui/react-popover';
import { useMediaQuery } from 'react-responsive';
import { Cross2Icon, EnterIcon } from '@radix-ui/react-icons';
import Avatar from 'components/ui/avatar';
import useGetUserTokenAndInfo from 'hooks/use-get-user-token-and-info';
import Button from 'components/ui/button';
import UserProfile from '../user-profile';

function AuthButtons() {
  return (
    <div className="w-full space-y-2">
      <h2 className="text-base text-center font-semibold">Login or Create an Account</h2>
      <Button to="/login" className="w-full py-1 sm:px-8">
        Login
      </Button>
      <Button to="/sign-up" variant="ghost" className="w-full py-1 sm:px-8">
        Sign Up
      </Button>
    </div>
  );
}

export default function UserSection() {
  const [userToken, { data: userInfo }] = useGetUserTokenAndInfo({ refetchOnFocus: false });

  const isTablet = useMediaQuery({ query: '(max-width: 1023px)' });

  if (!isTablet) {
    return (
      <div className="w-full space-y-2">
        {userToken ? <UserProfile user={userInfo?.user} /> : <AuthButtons />}
      </div>
    );
  }

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
          {userToken ? <UserProfile user={userInfo?.user} /> : <AuthButtons />}
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
