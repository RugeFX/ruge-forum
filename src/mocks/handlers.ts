/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type HttpHandler,
  HttpResponse,
  http,
  HttpResponseResolver,
  PathParams,
  DefaultBodyType,
} from 'msw';
import type { BaseResponse } from 'types/response';
import { BASE_URL } from 'app/api';
import { User } from 'types/user';
import { Comment } from 'types/thread';
import threads from './data/threads.json';
import threadDetails from './data/thread-details.json';
import users from './data/users.json';
import leaderboards from './data/leaderboards.json';

function withBaseResponse<TData>(type: 'success' | 'fail', data: TData): BaseResponse<TData> {
  return {
    status: type,
    message: type === 'success' ? 'data retrieved' : 'failed to get data',
    data,
  };
}

function withAuthorization<
  Params extends PathParams,
  RequestBodyType extends DefaultBodyType,
  ResponseBodyType extends DefaultBodyType,
>(
  resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>,
): HttpResponseResolver<Params, RequestBodyType, ResponseBodyType> {
  return (input) => {
    const authHeader = input.request.headers.get('Authorization');

    if (!authHeader || authHeader.includes('invalid-test-token')) {
      return HttpResponse.json(withBaseResponse('fail', {}), { status: 401 }) as any;
    }

    return resolver(input);
  };
}

const handlers: HttpHandler[] = [
  http.get(`${BASE_URL}threads`, () => HttpResponse.json(
    withBaseResponse('success', {
      threads,
    }),
    { status: 200 },
  )),
  http.get<{ id: keyof typeof threadDetails }>(`${BASE_URL}threads/:id`, ({ params }) => {
    const { id } = params;
    const detailThread = threadDetails[id];

    if (!detailThread) {
      return HttpResponse.json(withBaseResponse('fail', {}), { status: 404 });
    }

    return HttpResponse.json(
      withBaseResponse('success', {
        detailThread,
      }),
      { status: 200 },
    );
  }),
  http.post<never, { title: string; body: string; category?: string }, any>(
    `${BASE_URL}threads`,
    withAuthorization(async ({ request }) => {
      const requestBody = await request.json();
      const thread = {
        id: 'test-create-thread',
        ...requestBody,
        category: requestBody.category || 'general',
        createdAt: new Date().toISOString(),
        ownerId: 'user-test-one',
        totalComments: 0,
        upVotesBy: [],
        downVotesBy: [],
      };

      return HttpResponse.json(
        withBaseResponse('success', {
          thread,
        }),
        { status: 201 },
      );
    }),
  ),
  http.post<{ id: keyof typeof threadDetails }, { threadId: string; content: string }, any>(
    `${BASE_URL}threads/:id/comments`,
    withAuthorization(async ({ request }) => {
      const { content } = await request.json();
      const comment: Comment = {
        content,
        id: 'comment-test',
        createdAt: new Date().toISOString(),
        upVotesBy: [],
        downVotesBy: [],
        owner: {
          id: 'user-test-one',
          name: 'John Doe',
          avatar: 'default',
        },
      };

      return HttpResponse.json(
        withBaseResponse('success', {
          comment,
        }),
        { status: 201 },
      );
    }),
  ),
  http.post<never, { email: string; password: string }>(`${BASE_URL}login`, () => {
    const token = 'user-test-token';

    return HttpResponse.json(
      withBaseResponse('success', {
        token,
      }),
      { status: 200 },
    );
  }),
  http.post<object, { name: string; email: string; password: string }>(
    `${BASE_URL}register`,
    async ({ request }) => {
      const { password, ...rest } = await request.json();
      const user: User = {
        id: 'user-test-one',
        avatar: 'default',
        ...rest,
      };

      return HttpResponse.json(
        withBaseResponse('success', {
          user,
        }),
        { status: 200 },
      );
    },
  ),
  http.get(
    `${BASE_URL}users/me`,
    withAuthorization(() => {
      const user: User = {
        id: 'user-test-one',
        email: 'test@email.com',
        avatar: 'default',
        name: 'Test User',
      };

      return HttpResponse.json(
        withBaseResponse('success', {
          user,
        }),
        { status: 200 },
      );
    }),
  ),
  http.get(`${BASE_URL}users`, () => HttpResponse.json(
    withBaseResponse('success', {
      users,
    }),
    { status: 200 },
  )),
  http.post<{ id: string }, never, any>(
    `${BASE_URL}threads/:id/up-vote`,
    withAuthorization(({ params }) => HttpResponse.json(
      withBaseResponse('success', {
        vote: {
          id: 'vote-test',
          userId: 'user-test-one',
          threadId: params.id,
          voteType: 1,
        },
      }),
    )),
  ),
  http.post<{ id: string }, never, any>(
    `${BASE_URL}threads/:id/down-vote`,
    withAuthorization(({ params }) => HttpResponse.json(
      withBaseResponse('success', {
        vote: {
          id: 'vote-test',
          userId: 'user-test-one',
          threadId: params.id,
          voteType: -1,
        },
      }),
    )),
  ),
  http.post<{ id: string }, never, any>(
    `${BASE_URL}threads/:id/neutral-vote`,
    withAuthorization(({ params }) => HttpResponse.json(
      withBaseResponse('success', {
        vote: {
          id: 'vote-test',
          userId: 'user-test-one',
          threadId: params.id,
          voteType: 0,
        },
      }),
    )),
  ),
  http.post<{ threadId: string; commentId: string }, never, any>(
    `${BASE_URL}threads/:threadId/comments/:commentId/up-vote`,
    withAuthorization(({ params }) => HttpResponse.json(
      withBaseResponse('success', {
        vote: {
          id: 'vote-test',
          userId: 'user-test-one',
          commentId: params.commentId,
          voteType: 1,
        },
      }),
    )),
  ),
  http.post<{ threadId: string; commentId: string }, never, any>(
    `${BASE_URL}threads/:threadId/comments/:commentId/down-vote`,
    withAuthorization(({ params }) => HttpResponse.json(
      withBaseResponse('success', {
        vote: {
          id: 'vote-test',
          userId: 'user-test-one',
          commentId: params.commentId,
          voteType: -1,
        },
      }),
    )),
  ),
  http.post<{ threadId: string; commentId: string }, never, any>(
    `${BASE_URL}threads/:threadId/comments/:commentId/neutral-vote`,
    withAuthorization(({ params }) => HttpResponse.json(
      withBaseResponse('success', {
        vote: {
          id: 'vote-test',
          userId: 'user-test-one',
          commentId: params.commentId,
          voteType: 0,
        },
      }),
    )),
  ),
  http.get(`${BASE_URL}leaderboards`, () => HttpResponse.json(
    withBaseResponse('success', {
      leaderboards,
    }),
    { status: 200 },
  )),
];

export default handlers;
