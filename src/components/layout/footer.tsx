import { GitHubLogoIcon } from '@radix-ui/react-icons';

export default function Footer() {
  return (
    <footer className="flex z-10 bg-black justify-between items-center border-t border-t-zinc-700 p-5">
      <p>
        Made with
        {' '}
        <span className="text-pink-500">&#9829;</span>
        {' '}
        , by
        {' '}
        <span className="text-emerald-400 font-semibold">RugeFX</span>
      </p>
      <a
        aria-label="RugeFX's Github"
        href="https://github.com/RugeFX/"
        className="p-2 ring-2 ring-white rounded-full text-white hover:text-black hover:bg-emerald-400 transition-all"
        target="_blank"
        rel="noreferrer"
      >
        <GitHubLogoIcon className="w-7 h-7" />
      </a>
    </footer>
  );
}
