import { Link } from 'react-router-dom';
import * as ScrollArea from '@radix-ui/react-scroll-area';

function CategoryLink({
  label,
  to,
  isSelected,
}: {
  label: string;
  to: string;
  isSelected: boolean;
}) {
  return (
    <Link
      className={`text-sm px-4 py-2 text-nowrap font-semibold rounded-md  ${isSelected ? 'text-emerald-200 bg-emerald-950 hover:bg-emerald-900' : 'bg-zinc-900 hover:bg-zinc-800'} transition-all`}
      to={to}
    >
      {label}
    </Link>
  );
}

interface CategoryListProps {
  categories: string[];
  activeCategory?: string | null;
}

export default function CategoryList({ categories, activeCategory }: CategoryListProps) {
  return (
    <ScrollArea.Root className="w-full h-14 px-5 py-2 overflow-hidden">
      <ScrollArea.Viewport className="w-full">
        <div role="list" className="h-full flex gap-2">
          <CategoryLink to="/" isSelected={!activeCategory} label="All" />
          {categories.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <CategoryLink
                key={category}
                to={`/?category=${category}`}
                isSelected={isSelected}
                label={`#${category}`}
              />
            );
          })}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-black transition-colors ease-out hover:bg-zinc-900 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="flex-1 bg-emerald-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-white" />
    </ScrollArea.Root>
  );
}
