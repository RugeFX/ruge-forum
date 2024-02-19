import { useFetchThreadsQuery } from 'features/thread/thread-api';

export default function ThreadsList() {
  const { data, isLoading, isError } = useFetchThreadsQuery();

  if (isLoading) {
    return <div>SKELETON LOADING</div>;
  }

  if (isError) {
    return null;
  }

  return (
    <div className="px-5 w-full grid grid-flow-row gap-4">
      {data?.data.threads.map((thread) => (
        <article
          key={thread.id}
          className="bg-zinc-800 border-2 border-white rounded-md"
        >
          <div className="px-5 py-3">
            <h3>{thread.title}</h3>
          </div>
          <div className="w-full flex flex-col sm:flex-row divide-y-2 sm:divide-y-0 sm:divide-x-2">
            <button type="button" className="flex-1 p-3">
              Upvote (
              {thread.upVotesBy.length}
              )
            </button>
            <button type="button" className="flex-1 p-3">
              Downvote (
              {thread.downVotesBy.length}
              )
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
