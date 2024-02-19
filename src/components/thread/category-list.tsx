import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useFetchThreadsQuery } from 'features/thread/thread-api';

export default function CategoryList() {
  const [searchParams] = useSearchParams();
  const { data: threads, isLoading } = useFetchThreadsQuery();
  const categories = useMemo(
    () => (threads?.data.threads ?? []).map((thread) => thread.category),
    [threads],
  );

  if (isLoading) {
    // TODO: loading skeleton
    return <span>loading</span>;
  }

  return (
    <ScrollArea.Root className="w-full h-14 px-5 py-2 overflow-hidden">
      <ScrollArea.Viewport className="w-full">
        <div className="h-full flex gap-2">
          <Link
            className={`text-sm px-4 py-2 font-semibold rounded-md  ${!searchParams.get('category') ? 'bg-emerald-400 hover:bg-emerald-500 text-zinc-700' : 'bg-zinc-900 hover:bg-zinc-800'} transition-all`}
            to="/"
          >
            All
          </Link>
          {categories.map((category) => {
            const isSelected = searchParams.get('category') === category;
            return (
              <Link
                key={category}
                className={`text-sm px-4 py-2 font-semibold rounded-md ${isSelected ? 'bg-emerald-400 hover:bg-emerald-500 text-zinc-700' : 'bg-zinc-900 hover:bg-zinc-800'} transition-all`}
                to={`/?category=${category}`}
              >
                #
                {category}
              </Link>
            );
          })}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-black transition-colors duration-[160ms] ease-out hover:bg-zinc-900 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="flex-1 bg-emerald-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-white" />
    </ScrollArea.Root>
  );
}
