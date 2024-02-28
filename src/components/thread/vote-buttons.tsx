import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';
import { useAppDispatch } from 'app/hooks';
import threadApi, { useFetchThreadsQuery, useVoteThreadMutation } from 'features/thread/thread-api';
import type { Thread } from 'types/thread';
import useGetUserTokenAndInfo from 'hooks/use-get-user-token-and-info';

interface VoteButtonProps extends Pick<Thread, 'id'> {}

export default function VoteButtons({ id }: VoteButtonProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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

  const upVoteHandler = async () => {
    if (!userToken) {
      toast.info('You must be logged in to do this action!');
      navigate('/login');
    }
    if (userInfo && thread) {
      const userId = userInfo.user.id;

      const patchCollection = dispatch(
        threadApi.util.updateQueryData('fetchThreads', undefined, (draft) => {
          const draftThread = draft.threads.find((trd) => trd.id === id);
          if (draftThread) {
            draftThread.upVotesBy = alreadyUpVoted
              ? draftThread.upVotesBy.filter((usrId) => usrId !== userId)
              : [...draftThread.upVotesBy, userId];
            draftThread.downVotesBy = draftThread.downVotesBy.filter((usrId) => usrId !== userId);
          }
        }),
      );

      try {
        await vote({
          threadId: id,
          type: alreadyUpVoted ? 'neutral' : 'up',
        }).unwrap();
      } catch (err) {
        patchCollection.undo();
      }
    }
  };

  const downVoteHandler = async () => {
    if (!userToken) {
      toast.info('You must be logged in to do this action!');
      navigate('/login');
    }
    if (userInfo && thread) {
      const userId = userInfo.user.id;

      const patchCollection = dispatch(
        threadApi.util.updateQueryData('fetchThreads', undefined, (draft) => {
          const draftThread = draft.threads.find((trd) => trd.id === id);
          if (draftThread) {
            draftThread.downVotesBy = alreadyDownVoted
              ? draftThread.downVotesBy.filter((usrId) => usrId !== userId)
              : [...draftThread.downVotesBy, userId];
            draftThread.upVotesBy = draftThread.upVotesBy.filter((usrId) => usrId !== userId);
          }
        }),
      );

      try {
        await vote({
          threadId: id,
          type: alreadyDownVoted ? 'neutral' : 'down',
        }).unwrap();
      } catch (err) {
        patchCollection.undo();
      }
    }
  };

  return (
    <div className="w-max flex flex-col items-center">
      <button
        type="button"
        onClick={upVoteHandler}
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
        onClick={downVoteHandler}
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
