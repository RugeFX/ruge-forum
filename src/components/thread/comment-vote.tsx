import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useFetchUserInfoQuery } from 'features/auth/auth-api';
import { selectToken } from 'features/auth/auth-slice';
import type { Comment } from 'types/thread';
import threadApi, { useVoteCommentMutation } from 'features/thread/thread-api';

interface CommentVoteProps {
  threadId: string;
  comment: Comment;
}

export default function CommentVote({ threadId, comment }: CommentVoteProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(selectToken);
  const { data: userInfo } = useFetchUserInfoQuery(undefined, {
    skip: !userToken,
  });
  const [vote] = useVoteCommentMutation();

  const alreadyUpVoted = useMemo(
    () => comment.upVotesBy.includes(userInfo?.user.id ?? ''),
    [comment, userInfo],
  );
  const alreadyDownVoted = useMemo(
    () => comment.downVotesBy.includes(userInfo?.user.id ?? ''),
    [comment, userInfo],
  );

  const upVoteHandler = async () => {
    if (!userToken) {
      toast.info('You must be logged in to do this action!');
      navigate('/login');
    }
    if (userInfo) {
      const userId = userInfo.user.id;

      const patchCollection = dispatch(
        threadApi.util.updateQueryData('fetchThreadDetails', threadId, (draft) => {
          const findComment = draft.detailThread.comments.find((cmnt) => cmnt.id === comment.id);
          if (findComment) {
            findComment.upVotesBy = alreadyUpVoted
              ? findComment.upVotesBy.filter((usrId) => usrId !== userId)
              : [...findComment.upVotesBy, userId];
            findComment.downVotesBy = findComment.downVotesBy.filter((usrId) => usrId !== userId);
          }
        }),
      );

      try {
        await vote({
          threadId,
          commentId: comment.id,
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
    if (userInfo) {
      const userId = userInfo.user.id;

      const patchCollection = dispatch(
        threadApi.util.updateQueryData('fetchThreadDetails', threadId, (draft) => {
          const findComment = draft.detailThread.comments.find((cmnt) => cmnt.id === comment.id);
          if (findComment) {
            findComment.downVotesBy = alreadyDownVoted
              ? findComment.downVotesBy.filter((usrId) => usrId !== userId)
              : [...findComment.downVotesBy, userId];
            findComment.upVotesBy = findComment.upVotesBy.filter((usrId) => usrId !== userId);
          }
        }),
      );

      try {
        await vote({
          threadId,
          commentId: comment.id,
          type: alreadyDownVoted ? 'neutral' : 'down',
        }).unwrap();
      } catch (err) {
        patchCollection.undo();
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">
      <button
        type="button"
        onClick={upVoteHandler}
        className={`flex gap-1 p-1 hover:bg-emerald-950 ${alreadyUpVoted ? 'text-emerald-400 bg-emerald-950' : 'text-zinc-300'} rounded-md transition-all`}
      >
        <CaretUpIcon className="size-5" />
        <span className="text-sm">{comment.upVotesBy.length}</span>
      </button>
      <button
        type="button"
        onClick={downVoteHandler}
        className={`flex gap-1 p-1 hover:bg-emerald-950 ${alreadyDownVoted ? 'text-emerald-400 bg-emerald-950' : 'text-zinc-300'} rounded-md transition-all`}
      >
        <CaretDownIcon className="size-5" />
        <span className="text-sm">{comment.downVotesBy.length}</span>
      </button>
    </div>
  );
}
