import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { useFetchThreadDetailsQuery } from 'features/thread/thread-api';
import type { FetchError } from 'types/error';
import VoteButtons from 'components/thread/vote-buttons';
import Avatar from 'components/ui/avatar';
import DetailsHeader from 'components/thread/details-header';
import CommentSection from 'components/thread/comment-section';
import { formatDiff } from 'utils';
import Skeleton from 'components/ui/skeleton';

export default function ThreadDetailsPage() {
  const { threadId } = useParams();
  const {
    data, isLoading, isError, error,
  } = useFetchThreadDetailsQuery(threadId, {
    skip: !threadId,
  });

  if (isLoading) {
    return (
      <div className="w-full px-5 py-2 space-y-4 animate-pulse">
        <div className="w-full py-4 border-b border-zinc-700">
          <Skeleton className="w-52 h-10" />
        </div>
        <Skeleton className="w-full h-96" />
        <Skeleton className="w-full h-40" />
      </div>
    );
  }

  if (isError) {
    const err = error as FetchError;

    if (err.status === 404) {
      return (
        <section className="w-full px-5 py-2 space-y-4">
          <DetailsHeader title="Not Found" />
          <div>
            <h2 className="text-xl font-bold text-center">
              Sorry, we couldn&apos;t find the thread you&apos;re looking for!
            </h2>
          </div>
        </section>
      );
    }
    return null;
  }

  const {
    title, body, category, createdAt, owner,
  } = data!.detailThread;

  return (
    <div className="mb-4 px-5 py-2 space-y-4">
      <section id="content" className="w-full overflow-auto">
        <DetailsHeader title={title} category={category} />
        <article className="w-full bg-zinc-900 border border-zinc-700 divide-y divide-zinc-700">
          <div className="flex gap-4 p-3">
            <VoteButtons id={threadId!} />
            <div className="flex-1 prose prose-invert max-w-none my-auto">{parse(body)}</div>
          </div>
          <footer className="w-full flex gap-4 items-center p-3">
            <div className="flex gap-2">
              <Avatar user={owner} />
              <div className="flex flex-col">
                <h4 className="text-sm text-zinc-300">
                  {'Posted by '}
                  <span className="font-bold">{owner.name}</span>
                </h4>
                <span className="text-sm text-zinc-300">{formatDiff(createdAt)}</span>
              </div>
            </div>
          </footer>
        </article>
      </section>
      <CommentSection threadId={threadId!} />
    </div>
  );
}
