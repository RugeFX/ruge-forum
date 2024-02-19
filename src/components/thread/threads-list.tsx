import { useFetchThreadsQuery } from 'features/thread/thread-api';
import ThreadItem from './thread-item';

export default function ThreadsList() {
  const { data, isLoading, isError } = useFetchThreadsQuery();
  // TODO: filter based on category

  if (isLoading) {
    // TODO: skeleton loading
    return <div>SKELETON LOADING</div>;
  }

  if (isError) {
    return null;
  }

  return (
    <div className="px-5 w-full grid grid-flow-row gap-4">
      {(data?.data.threads ?? []).map((thread) => (
        <>
          <ThreadItem key={thread.id} thread={thread} />
          <ThreadItem key={thread.id} thread={thread} />
          <ThreadItem key={thread.id} thread={thread} />
          <ThreadItem key={thread.id} thread={thread} />
        </>
      ))}
    </div>
  );
}
