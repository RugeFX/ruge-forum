import { api } from 'app/api';
import type {
  Comment, Thread, ThreadDetails, Vote, VoteComment,
} from 'types/thread';

type ThreadsResponse = { threads: Thread[] };
type ThreadDetailResponse = { detailThread: ThreadDetails };
type CreateThreadResponse = { thread: Thread };
type CreateCommentResponse = { comment: Comment };
type VoteThreadResponse = { vote: Vote };
type VoteCommentResponse = { vote: VoteComment };

type CreateThreadPayload = { title: string; body: string; category?: string };
type CreateCommentPayload = { threadId: string; content: string };
type VoteThreadPayload = { threadId: string; userId: string; type: 'up' | 'neutral' | 'down' };
type VoteCommentPayload = VoteThreadPayload & { commentId: string };

const threadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchThreads: builder.query<ThreadsResponse, void>({
      query: () => 'threads',
      providesTags: (result) => [
        ...(result?.threads ?? []).map(({ id }) => ({ type: 'Threads', id }) as const),
        { type: 'Threads' },
      ],
    }),
    fetchThreadDetails: builder.query<ThreadDetailResponse, string | undefined>({
      query: (id) => `threads/${id}`,
      providesTags: (_response, _error, id) => [{ type: 'Threads', id }],
    }),
    createThread: builder.mutation<CreateThreadResponse, CreateThreadPayload>({
      query: (body) => ({
        url: 'threads',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Threads' }],
    }),
    createComment: builder.mutation<CreateCommentResponse, CreateCommentPayload>({
      query: ({ threadId, ...body }) => ({
        url: `threads/${threadId}/comments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_response, _error, { threadId }) => [
        { type: 'Threads', id: threadId },
        { type: 'Leaderboard' },
      ],
    }),
    voteThread: builder.mutation<VoteThreadResponse, VoteThreadPayload>({
      query: ({ threadId, type }) => ({
        url: `threads/${threadId}/${type}-vote`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Leaderboard' }],
      onQueryStarted: ({ type, threadId, userId }, { queryFulfilled, dispatch }) => {
        const userFilterFn = (usrId: string) => usrId !== userId;

        const patchCollection = dispatch(
          threadApi.util.updateQueryData('fetchThreads', undefined, (draft) => {
            const draftThread = draft.threads.find((trd) => trd.id === threadId);
            if (draftThread) {
              const alreadyUpVoted = draftThread.upVotesBy.includes(userId);
              const alreadyDownVoted = draftThread.downVotesBy.includes(userId);

              if (type === 'up') {
                draftThread.upVotesBy = alreadyUpVoted
                  ? draftThread.upVotesBy.filter(userFilterFn)
                  : [...draftThread.upVotesBy, userId];
                draftThread.downVotesBy = draftThread.downVotesBy.filter(userFilterFn);
              } else if (type === 'down') {
                draftThread.downVotesBy = alreadyDownVoted
                  ? draftThread.downVotesBy.filter(userFilterFn)
                  : [...draftThread.downVotesBy, userId];
                draftThread.upVotesBy = draftThread.upVotesBy.filter(userFilterFn);
              } else {
                draftThread.downVotesBy = draftThread.downVotesBy.filter(userFilterFn);
                draftThread.upVotesBy = draftThread.upVotesBy.filter(userFilterFn);
              }
            }
          }),
        );

        queryFulfilled.catch(() => patchCollection.undo());
      },
    }),
    voteComment: builder.mutation<VoteCommentResponse, VoteCommentPayload>({
      query: ({ threadId, commentId, type }) => ({
        url: `threads/${threadId}/comments/${commentId}/${type}-vote`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Leaderboard' }],
      onQueryStarted: ({
        commentId, userId, threadId, type,
      }, { queryFulfilled, dispatch }) => {
        const userFilterFn = (usrId: string) => usrId !== userId;

        const patchCollection = dispatch(
          threadApi.util.updateQueryData('fetchThreadDetails', threadId, (draft) => {
            const findComment = draft.detailThread.comments.find((cmnt) => cmnt.id === commentId);
            if (findComment) {
              const alreadyUpVoted = findComment.upVotesBy.includes(userId);
              const alreadyDownVoted = findComment.downVotesBy.includes(userId);

              if (type === 'up') {
                findComment.upVotesBy = alreadyUpVoted
                  ? findComment.upVotesBy.filter(userFilterFn)
                  : [...findComment.upVotesBy, userId];
                findComment.downVotesBy = findComment.downVotesBy.filter(userFilterFn);
              } else if (type === 'down') {
                findComment.downVotesBy = alreadyDownVoted
                  ? findComment.downVotesBy.filter(userFilterFn)
                  : [...findComment.downVotesBy, userId];
                findComment.upVotesBy = findComment.upVotesBy.filter(userFilterFn);
              } else {
                findComment.downVotesBy = findComment.downVotesBy.filter(userFilterFn);
                findComment.upVotesBy = findComment.upVotesBy.filter(userFilterFn);
              }
            }
          }),
        );

        queryFulfilled.catch(() => patchCollection.undo());
      },
    }),
  }),
});

export const {
  useFetchThreadsQuery,
  useFetchThreadDetailsQuery,
  useCreateThreadMutation,
  useCreateCommentMutation,
  useVoteThreadMutation,
  useVoteCommentMutation,
} = threadApi;
export default threadApi;
