import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, InfoCircledIcon, ReaderIcon } from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';

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
  {
    label: 'About',
    to: '/about',
    Icon: InfoCircledIcon,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed bg-black w-16 sm:w-64 divide-y divide-zinc-700">
      {sidebarItems.map(({ label, to, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `w-full flex gap-4 items-center text-lg px-5 py-3 hover:bg-zinc-900 ${isActive ? 'font-bold' : 'font-normal'} transition-colors`}
        >
          {({ isActive }) => (
            <>
              <Icon
                className={`w-7 h-7 ${isActive ? 'text-emerald-400' : 'text-white'} transition-all`}
              />
              <span className="hidden sm:block">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </aside>
  );
}
