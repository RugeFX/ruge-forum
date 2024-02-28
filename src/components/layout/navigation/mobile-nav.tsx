import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { PlusIcon } from '@radix-ui/react-icons';
import navigationItems from './data';

export default function MobileNav() {
  return (
    <nav className="sticky bottom-0 py-2 px-5 bg-black w-full border-t border-zinc-800">
      <div className="flex h-14 divide-x divide-zinc-700 rounded-md border border-inherit overflow-hidden">
        {navigationItems.map(({ label, to, Icon }, index) => (
          <Fragment key={to}>
            {index === navigationItems.length / 2 && (
              <div className="grow-[3]">
                <NavLink
                  to="/new"
                  className="font-semibold w-full h-full flex shrink-0 justify-center items-center gap-4 py-3 md:px-5 text-black bg-emerald-400 hover:bg-emerald-500 transition-all rounded-md"
                >
                  <PlusIcon className="size-7" />
                  <span className="sr-only">Start a Thread</span>
                </NavLink>
              </div>
            )}
            <NavLink
              to={to}
              className={({ isActive }) => `flex-1 flex shrink-0 gap-4 justify-center items-center text-lg px-5 py-3 ${isActive ? 'text-emerald-200 bg-emerald-950 hover:bg-emerald-900 font-bold' : 'bg-black hover:bg-zinc-900 text-white font-normal'} transition-colors`}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`size-6 ${isActive ? 'text-emerald-200' : 'text-white'} transition-all`}
                  />
                  <span className="sr-only">{label}</span>
                </>
              )}
            </NavLink>
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
