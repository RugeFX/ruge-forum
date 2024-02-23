import Logo from 'components/logo';
import LoadingBar from 'react-redux-loading-bar';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <header className="fixed z-10 top-0 h-16 w-full flex justify-center items-center p-3 text-white border-b border-zinc-700 bg-black/65 shadow-md backdrop-filter backdrop-blur-md">
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
