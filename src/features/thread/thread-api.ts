import { api } from 'app/api';
import type { BaseResponse } from 'types/response';
import type { Comment, Thread, ThreadDetails } from 'types/thread';

type ThreadsResponse = BaseResponse<{ threads: Thread[] }>;
type ThreadDetailResponse = BaseResponse<{ detailThread: ThreadDetails }>;
type CreateThreadResponse = BaseResponse<{ thread: Thread }>;
type CreateCommentResponse = BaseResponse<{ comment: Comment }>;

type CreateThreadPayload = { title: string; body: string; category?: string };
type CreateCommentPayload = { threadId: string; content: string };

const threadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchThreads: builder.query<ThreadsResponse, void>({
      query: () => 'threads',
      providesTags: (result) => [
        ...(result?.data.threads ?? []).map(
          ({ id }) => ({ type: 'Threads', id }) as const,
        ),
        { type: 'Threads', id: 'LIST' },
      ],
    }),
    fetchThreadDetails: builder.query<ThreadDetailResponse, string>({
      query: (id) => `threads/${id}`,
      providesTags: (_response, _error, id) => [{ type: 'Threads', id }],
    }),
    createThread: builder.mutation<CreateThreadResponse, CreateThreadPayload>({
      query: (body) => ({
        url: 'threads',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Threads', id: 'LIST' }],
    }),
    createComment: builder.mutation<
    CreateCommentResponse,
    CreateCommentPayload
    >({
      query: ({ threadId, ...body }) => ({
        url: `threads/${threadId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_response, _error, { threadId }) => [
        { type: 'Threads', id: threadId },
      ],
    }),
  }),
});

export const {
  useFetchThreadsQuery,
  useFetchThreadDetailsQuery,
  useCreateThreadMutation,
  useCreateCommentMutation,
} = threadApi;
export default threadApi;
