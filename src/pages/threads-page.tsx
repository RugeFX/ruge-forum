import CategoryList from 'components/thread/category-list';
import ThreadsList from 'components/thread/threads-list';
import Skeleton from 'components/ui/skeleton';
import { useFetchThreadsQuery } from 'features/thread/thread-api';
import { useMemo } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

export default function ThreadsPage() {
  const [searchParams] = useSearchParams();
  const { data, isLoading, isError } = useFetchThreadsQuery();

  const activeCategory = searchParams.get('category');
  const categories = useMemo(
    () => [...new Set(data?.threads.map((thread) => thread.category))],
    [data],
  );
  const threads = useMemo(
    () => (activeCategory
      ? data?.threads.filter((thread) => thread.category === activeCategory)
      : data?.threads) ?? [],
    [data, activeCategory],
  );

  if (isLoading) {
    return (
      <section className="mb-4">
        <div className="w-full h-14 px-5 py-2 flex gap-2">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Skeleton
                // eslint-disable-next-line react/no-array-index-key
                key={`${i}-categories-skeleton`}
                className="h-8 w-28"
              />
            ))}
        </div>
        <div className="px-5 w-full grid grid-flow-row gap-2">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={`${i}-threads-skeleton`} className="w-full h-44" />
            ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mb-4 min-h-28 grid place-items-center">
        <h2 className="text-red-500 font-semibold text-xl">
          An error has occured while fetching threads!
        </h2>
      </section>
    );
  }

  return (
    <>
      <CategoryList categories={categories} activeCategory={activeCategory} />
      <section className="mb-4">
        <ThreadsList threads={threads} />
      </section>
      <Outlet />
    </>
  );
}
