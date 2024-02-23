import { useFetchThreadsQuery } from 'features/thread/thread-api';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import ThreadItem from './thread-item';

export default function ThreadsList() {
  const [searchParams] = useSearchParams();
  const { data, isLoading, isError } = useFetchThreadsQuery();

  const category = searchParams.get('category');
  const threads = useMemo(
    () => (category
      ? (data?.threads ?? []).filter((thread) => thread.category === category)
      : data?.threads ?? []),
    [data, category],
  );

  if (isLoading) {
    return (
      <div className="px-5 w-full grid grid-flow-row gap-2">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`${i}-list-skeleton`} className="bg-zinc-900 w-full h-44 animate-pulse" />
          ))}
      </div>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <div className="px-5 w-full grid grid-flow-row gap-2">
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
    </div>
  );
}
