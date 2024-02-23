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
type VoteThreadPayload = { threadId: string; type: 'up' | 'neutral' | 'down' };
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
    }),
    voteComment: builder.mutation<VoteCommentResponse, VoteCommentPayload>({
      query: ({ threadId, commentId, type }) => ({
        url: `threads/${threadId}/comments/${commentId}/${type}-vote`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Leaderboard' }],
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
