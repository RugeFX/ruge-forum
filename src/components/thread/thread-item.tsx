import { ChatBubbleIcon, ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import * as Avatar from '@radix-ui/react-avatar';
import parse from 'html-react-parser';
import type { Thread } from 'types/thread';
import { useFetchUsersQuery } from 'features/auth/auth-api';
import { formatDiff } from 'utils';

interface ThreadItemProps {
  thread: Thread;
}

export default function ThreadItem({ thread }: ThreadItemProps) {
  const { data: users } = useFetchUsersQuery();
  const owner = (users?.data.users ?? []).find((user) => user.id === thread.ownerId);

  return (
    <article
      key={thread.id}
      className="bg-zinc-900 border border-zinc-700 divide-y divide-zinc-700 hover:border-emerald-400 transition-colors"
    >
      <div className="flex w-full p-3">
        <div className="flex flex-col items-center">
          <Avatar.Root className="mb-2 bg-white inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <Avatar.Image
              className="h-full w-full rounded-[inherit] object-cover"
              src={owner?.avatar}
              alt={`${owner?.name}'s Profile Picture`}
            />
            <Avatar.Fallback
              className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
              delayMs={600}
            >
              {owner?.name
                .split(' ')
                .map((string) => string[0])
                .join('') || 'UN'}
            </Avatar.Fallback>
          </Avatar.Root>
          <button type="button" className="group p-1 hover:bg-zinc-800 rounded-full">
            <span className="sr-only">Upvote</span>
            <ThickArrowUpIcon className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
          </button>
          <span className="text-center font-semibold">
            {thread.upVotesBy.length - thread.downVotesBy.length}
          </span>
          <button type="button" className="group p-1 hover:bg-zinc-800 rounded-full">
            <span className="sr-only">Downvote</span>
            <ThickArrowDownIcon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
        <div className="ml-5 space-y-2">
          <span className="text-sm text-zinc-300">{owner?.name}</span>
          <Link
            to={`/details/${thread.id}`}
            className="underline-offset-2 hover:underline hover:text-emerald-400 transition-colors"
          >
            <h3 className="text-lg font-bold">{thread.title}</h3>
          </Link>
          <div className="line-clamp-5 leading-snug prose prose-invert">{parse(thread.body)}</div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <p className="pl-5 text-sm text-zinc-300">{formatDiff(thread.createdAt)}</p>
        <button
          type="button"
          className="flex items-center gap-2 p-3 hover:bg-zinc-800 transition-colors"
        >
          <ChatBubbleIcon className="w-5 h-5" />
          {`${thread.totalComments} `}
          <span className="hidden sm:block">Comments</span>
        </button>
      </div>
    </article>
  );
}
