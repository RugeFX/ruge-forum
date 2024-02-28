import parse from 'html-react-parser';
import Avatar from 'components/avatar';
import { useFetchThreadDetailsQuery } from 'features/thread/thread-api';
import { formatDiff } from 'utils';
import { Link } from 'react-router-dom';
import useGetUserTokenAndInfo from 'hooks/use-get-user-token-and-info';
import CommentInput from './comment-input';
import CommentVote from './comment-vote';

interface CommentSectionProps {
  threadId: string;
}

export default function CommentSection({ threadId }: CommentSectionProps) {
  const [, { data: userInfo, isLoading }] = useGetUserTokenAndInfo();
  const { data } = useFetchThreadDetailsQuery(threadId);

  if (!data) return null;

  const { comments } = data.detailThread;

  return (
    <section
      id="comments"
      className="w-full bg-zinc-900 border border-zinc-700 divide-y divide-zinc-700"
    >
      {!isLoading && !userInfo ? (
        <div className="w-full space-y-2 p-3">
          <h2 className="text-base text-center font-semibold">Login to post a comment!</h2>
          <Link
            to="/login"
            className="w-full font-semibold flex justify-center items-center gap-4 py-1 sm:px-8 text-black bg-emerald-400 hover:bg-emerald-500 rounded-md transition-colors"
          >
            Login
          </Link>
        </div>
      ) : (
        <div className="w-full p-3 flex gap-4 items-start">
          <Avatar user={userInfo?.user} />
          <CommentInput threadId={threadId!} />
        </div>
      )}
      <div className="divide-y px-3 divide-zinc-700">
        {comments.length === 0 && (
          <p className="py-3 text-sm text-center text-zinc-300">
            There are no comments in this thread
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="w-full py-3 flex gap-4 items-start">
            <Avatar user={comment.owner} />
            <div className="space-y-0 leading-none">
              <p className="text-sm font-bold text-zinc-300">{comment.owner.name}</p>
              <span className="text-sm text-zinc-400">{formatDiff(comment.createdAt)}</span>
              <div className="prose prose-invert">{parse(comment.content)}</div>
              <CommentVote comment={comment} threadId={threadId} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
