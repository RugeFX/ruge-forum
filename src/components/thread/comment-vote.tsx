import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import type { Comment } from 'types/thread';
import { useVoteCommentMutation } from 'features/thread/thread-api';
import useGetUserTokenAndInfo from 'hooks/use-get-user-token-and-info';

interface CommentVoteProps {
  threadId: string;
  comment: Comment;
}

export default function CommentVote({ threadId, comment }: CommentVoteProps) {
  const navigate = useNavigate();
  const [userToken, { data: userInfo }] = useGetUserTokenAndInfo();
  const [vote] = useVoteCommentMutation();

  const alreadyUpVoted = useMemo(
    () => comment.upVotesBy.includes(userInfo?.user.id ?? ''),
    [comment, userInfo],
  );
  const alreadyDownVoted = useMemo(
    () => comment.downVotesBy.includes(userInfo?.user.id ?? ''),
    [comment, userInfo],
  );

  const voteHandler = async (type: 'up' | 'down') => {
    if (!userToken) {
      toast.info('You must be logged in to do this action!');
      navigate('/login');
    }
    if (userInfo) {
      const userId = userInfo.user.id;

      // Moved optimistic updates to the endpoint definition
      await vote({
        threadId,
        userId,
        commentId: comment.id,
        type:
          (type === 'up' && !alreadyUpVoted) || (type === 'down' && !alreadyDownVoted)
            ? type
            : 'neutral',
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">
      <button
        type="button"
        onClick={() => voteHandler('up')}
        className={`flex gap-1 p-1 hover:bg-emerald-950 ${alreadyUpVoted ? 'text-emerald-400 bg-emerald-950' : 'text-zinc-300'} rounded-md transition-all`}
      >
        <CaretUpIcon className="size-5" />
        <span className="text-sm">{comment.upVotesBy.length}</span>
      </button>
      <button
        type="button"
        onClick={() => voteHandler('down')}
        className={`flex gap-1 p-1 hover:bg-red-950 ${alreadyDownVoted ? 'text-red-200 bg-red-950' : 'text-zinc-300'} rounded-md transition-all`}
      >
        <CaretDownIcon className="size-5" />
        <span className="text-sm">{comment.downVotesBy.length}</span>
      </button>
    </div>
  );
}
