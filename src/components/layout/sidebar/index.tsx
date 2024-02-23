import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PlusIcon, ReaderIcon } from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import UserSection from './user-section';

type RadixIcon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;

const sidebarItems: { label: string; to: string; Icon: RadixIcon }[] = [
  {
    label: 'Home',
    to: '/',
    Icon: HomeIcon,
  },
  {
    label: 'Leaderboard',
    to: '/leaderboard',
    Icon: ReaderIcon,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed pb-36 bg-black w-16 md:w-64 h-full divide-y divide-zinc-700 overflow-y-auto">
      <div className="w-full bg-black flex justify-center text-lg md:px-5 py-3">
        <UserSection />
      </div>
      {sidebarItems.map(({ label, to, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `w-full flex shrink-0 gap-4 items-center text-lg px-5 py-3 ${isActive ? 'text-emerald-200 bg-emerald-950 hover:bg-emerald-900 font-bold' : 'bg-black hover:bg-zinc-900 text-white font-normal'} transition-colors`}
        >
          {({ isActive }) => (
            <>
              <Icon
                className={`size-7 ${isActive ? 'text-emerald-200' : 'text-white'} transition-all`}
              />
              <span className="hidden md:block">{label}</span>
            </>
          )}
        </NavLink>
      ))}
      <div className="p-2">
        <NavLink
          to="/new"
          className="font-semibold flex shrink-0 justify-center items-center gap-4 py-3 md:px-5 text-black bg-emerald-400 hover:bg-emerald-500 rounded-md transition-all"
        >
          <span className="hidden md:block">Start a Thread</span>
          <PlusIcon className="size-5" />
        </NavLink>
      </div>
    </aside>
  );
}
