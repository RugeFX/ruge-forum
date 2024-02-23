import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useAppSelector } from 'app/hooks';
import { selectToken } from 'features/auth/auth-slice';

export default function LoginPrompt() {
  const userToken = useAppSelector(selectToken);
  const [promptDismissed, setPromptDismissed] = useState(
    () => userToken !== null || localStorage.getItem('prompt-dismissed') !== null,
  );

  const onDismissPrompt = () => {
    localStorage.setItem('prompt-dismissed', 'true');
    setPromptDismissed(true);
  };

  if (userToken || promptDismissed) return null;

  return (
    <div className="sticky bottom-0 p-3 w-full bg-zinc-900 grid place-items-center gap-4">
      <button
        type="button"
        onClick={onDismissPrompt}
        aria-label="Dismiss Login Popup"
        className="absolute top-2 right-2"
      >
        <Cross1Icon className="w-3 h-3" />
      </button>
      <span className="font-bold text-xl text-center">Start exploring deeper</span>
      <div className="w-full max-w-72 h-full flex flex-col sm:flex-row justify-center items-center gap-2">
        <Link
          to="/login"
          className="w-full font-semibold flex shrink-0 justify-center items-center gap-4 py-2 sm:px-8 text-black bg-emerald-400 hover:bg-emerald-500 rounded-md transition-colors"
        >
          Login
        </Link>
        <span className="font-semibold">or</span>
        <Link
          to="/sign-up"
          className="w-full font-semibold flex shrink-0 justify-center items-center gap-4 py-2 sm:px-8 text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
