import { NavLink } from 'react-router-dom';
import { PlusIcon } from '@radix-ui/react-icons';
import UserSection from './user-section';
import navigationItems from './data';

export default function Sidebar() {
  return (
    <aside className="sticky top-16 bg-black w-16 lg:w-64 h-full divide-y divide-zinc-700 overflow-y-auto">
      <div className="w-full bg-black flex justify-center text-lg lg:px-5 py-3">
        <UserSection />
      </div>
      {navigationItems.map(({ label, to, Icon }) => (
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
              <span className="hidden lg:block">{label}</span>
            </>
          )}
        </NavLink>
      ))}
      <div className="p-2">
        <NavLink
          to="/new"
          className="font-semibold flex shrink-0 justify-center items-center gap-4 py-3 lg:px-5 text-black bg-emerald-400 hover:bg-emerald-500 rounded-md transition-all"
        >
          <span className="hidden lg:block">Start a Thread</span>
          <PlusIcon className="size-5" />
        </NavLink>
      </div>
    </aside>
  );
}
