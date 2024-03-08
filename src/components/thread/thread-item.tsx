import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { cn, formatDiff } from 'utils';
import Avatar from 'components/ui/avatar';
import { buttonVariants } from 'components/ui/button';
import type { Thread } from 'types/thread';
import type { User } from 'types/user';
import VoteButtons from './vote-buttons';

interface ThreadItemProps {
  thread: Thread;
  owner?: Omit<User, 'email'>;
}

export default function ThreadItem({ thread, owner }: ThreadItemProps) {
  return (
    <article
      key={thread.id}
      className="w-full bg-zinc-900 border border-zinc-700 divide-y divide-zinc-700 hover:border-emerald-400 transition-colors"
    >
      <div className=" w-full flex gap-5 p-3">
        <div className="flex flex-col items-center">
          <Avatar className="mb-2" user={owner} />
          <VoteButtons id={thread.id} />
        </div>
        <div className="w-full space-y-2">
          <div className="flex flex-col sm:flex-row gap-x-2 sm:items-center text-sm">
            <span className="block text-zinc-300">{owner?.name}</span>
            <span
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'w-max py-0 px-2 select-none',
              )}
            >
              #
              {thread.category}
            </span>
          </div>
          <Link
            to={`/details/${thread.id}`}
            className="underline-offset-2 hover:underline hover:text-emerald-400 transition-colors"
          >
            <h3 className="text-lg font-bold">{thread.title}</h3>
          </Link>
          <div className="w-full line-clamp-5 leading-snug break-words prose prose-invert">
            {parse(thread.body)}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <p className="pl-5 text-sm text-zinc-300">{formatDiff(thread.createdAt)}</p>
        <Link
          to={`/details/${thread.id}#comments`}
          className="flex items-center gap-2 p-3 hover:bg-zinc-800 transition-colors"
        >
          <ChatBubbleIcon className="w-5 h-5" />
          {`${thread.totalComments} `}
          <span className="hidden sm:block">Comments</span>
        </Link>
      </div>
    </article>
  );
}
