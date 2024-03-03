import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';
import { useFetchThreadsQuery, useVoteThreadMutation } from 'features/thread/thread-api';
import type { Thread } from 'types/thread';
import useGetUserTokenAndInfo from 'hooks/use-get-user-token-and-info';

interface VoteButtonProps extends Pick<Thread, 'id'> {}

export default function VoteButtons({ id }: VoteButtonProps) {
  const navigate = useNavigate();
  const [userToken, { data: userInfo }] = useGetUserTokenAndInfo({
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });
  const { data: threads } = useFetchThreadsQuery();
  const [vote] = useVoteThreadMutation();

  const thread = useMemo(() => threads?.threads.find((trd) => trd.id === id), [threads, id]);

  const alreadyUpVoted = useMemo(
    () => (thread?.upVotesBy ?? []).includes(userInfo?.user.id ?? ''),
    [thread, userInfo],
  );
  const alreadyDownVoted = useMemo(
    () => (thread?.downVotesBy ?? []).includes(userInfo?.user.id ?? ''),
    [thread, userInfo],
  );

  const voteHandler = async (type: 'up' | 'down') => {
    if (!userToken) {
      toast.info('You must be logged in to do this action!');
      navigate('/login');
    }
    if (userInfo && thread) {
      const userId = userInfo.user.id;

      // Moved optimistic updates to the endpoint definition
      await vote({
        threadId: id,
        userId,
        type:
          (type === 'up' && !alreadyUpVoted) || (type === 'down' && !alreadyDownVoted)
            ? type
            : 'neutral',
      });
    }
  };

  return (
    <div className="w-max flex flex-col items-center">
      <button
        type="button"
        onClick={() => voteHandler('up')}
        className={`group p-1 ${alreadyUpVoted ? 'bg-emerald-400 text-zinc-900' : 'bg-transparent hover:bg-zinc-800'} rounded-full`}
      >
        <span className="sr-only">Upvote</span>
        <ThickArrowUpIcon
          className={`size-5 ${alreadyUpVoted ? 'group-hover:text-white' : 'group-hover:text-emerald-400'}  transition-colors`}
        />
      </button>
      {thread !== undefined && (
        <span className="text-center font-semibold">
          {thread.upVotesBy.length - thread.downVotesBy.length}
        </span>
      )}

      <button
        type="button"
        onClick={() => voteHandler('down')}
        className={`group p-1 ${alreadyDownVoted ? 'bg-red-400 text-zinc-900' : 'bg-transparent hover:bg-zinc-800'} rounded-full`}
      >
        <span className="sr-only">Downvote</span>
        <ThickArrowDownIcon
          className={`size-5 ${alreadyDownVoted ? 'group-hover:text-white' : 'group-hover:text-red-400'} group-hover:text-red-400 transition-colors`}
        />
      </button>
    </div>
  );
}
