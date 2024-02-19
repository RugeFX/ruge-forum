import LoadingBar from 'react-redux-loading-bar';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <header className="fixed z-10 top-0 h-16 w-full flex justify-center items-center p-3 text-white border-b border-zinc-700 bg-black/65 shadow-md backdrop-filter backdrop-blur-md">
        <Link aria-label="home" className="text-xl sm:text-3xl font-bold tracking-tighter" to="/">
          <span>RUGE</span>
          {' '}
          <span className="text-emerald-400 font-semibold font-cursive tracking-wide">Forum</span>
        </Link>
      </header>
      <LoadingBar
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
