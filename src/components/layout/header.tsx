import { Cross2Icon, EnterIcon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import LoadingBar from 'react-redux-loading-bar';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import useGetUserTokenAndInfo from 'hooks/use-get-user-token-and-info';
import Avatar from 'components/avatar';
import Logo from 'components/logo';
import UserProfile from './user-profile';

export default function Header() {
  const [userToken, { data: userInfo }] = useGetUserTokenAndInfo();
  const isMobile = useMediaQuery({ query: '(max-width: 639px)' });

  return (
    <>
      <header className="sticky z-10 top-0 h-16 w-full flex justify-center items-center p-3 text-white border-b border-zinc-700 bg-black/65 shadow-md backdrop-filter backdrop-blur-md">
        {isMobile && (
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="absolute left-5 size-10 flex sm:hidden justify-center items-center text-emerald-200 hover:bg-emerald-950 rounded-full hover:brightness-110 transition-all"
              >
                <span className="sr-only">User Info</span>
                {userToken ? <Avatar user={userInfo?.user} /> : <EnterIcon className="size-7" />}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-[101] rounded p-5 w-64 bg-black border border-zinc-700 text-white"
                sideOffset={5}
                side="bottom"
              >
                {userToken ? (
                  <UserProfile user={userInfo?.user} />
                ) : (
                  <div className="w-full space-y-2">
                    <h2 className="text-base text-center font-semibold">
                      Login or Create an Account
                    </h2>
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
        )}
        <Link aria-label="home" to="/">
          <h1>
            <Logo />
          </h1>
        </Link>
      </header>
      <LoadingBar
        showFastActions
        style={{
          position: 'fixed',
          backgroundColor: 'rgb(52 211 153)',
          top: '4rem',
          zIndex: 100,
        }}
      />
    </>
  );
}
