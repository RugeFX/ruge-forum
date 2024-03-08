import type { Thread } from 'types/thread';
import { useFetchUsersQuery } from 'features/auth/auth-api';
import ThreadItem from './thread-item';

interface ThreadsListProps {
  threads: Thread[];
}

export default function ThreadsList({ threads }: ThreadsListProps) {
  const { data: users } = useFetchUsersQuery();

  if (threads.length === 0) {
    return (
      <div className="grid min-h-24 place-items-center">
        <h2 className="text-white text-xl font-semibold">
          There are no threads available at this moment.
        </h2>
      </div>
    );
  }

  return (
    <div role="list" className="px-5 w-full grid grid-flow-row gap-2">
      {threads.map((thread) => {
        const owner = users?.users.find((user) => user.id === thread.ownerId);

        return <ThreadItem key={thread.id} thread={thread} owner={owner} />;
      })}
    </div>
  );
}
