import { act, waitFor } from '@testing-library/react';
import {
  useFetchThreadsQuery,
  useFetchThreadDetailsQuery,
  useCreateThreadMutation,
  useCreateCommentMutation,
  useVoteThreadMutation,
  useVoteCommentMutation,
} from 'features/thread/thread-api';
import { renderHookWithProviders } from 'utils/test-utils';
import { describe, expect, it } from 'vitest';

describe('Thread API', () => {
  it('should return a list of threads after fetchThreads query is fulfilled', async () => {
    const { result } = renderHookWithProviders(() => useFetchThreadsQuery());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toMatchObject({
      endpointName: 'fetchThreads',
      status: 'fulfilled',
    });
    expect(result.current.data).toBeDefined();

    const { threads } = result.current.data!;

    expect(threads).toHaveLength(2);
    expect(threads[0].id).toBe('thread-test-one');
  });

  it('should return thread details after fetchThreadDetails query is fulfilled', async () => {
    const threadId = 'thread-test-one';

    const { result } = renderHookWithProviders(() => useFetchThreadDetailsQuery(threadId));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toMatchObject({
      endpointName: 'fetchThreadDetails',
      status: 'fulfilled',
    });
    expect(result.current.data).toBeDefined();

    const { detailThread } = result.current.data!;

    expect(detailThread.id).toBe(threadId);
    expect(detailThread.comments).toHaveLength(1);
  });

  it('should successfully make a new thread and invalidate fetch query after createThread using valid token mutation is fulfilled', async () => {
    const newThread = { title: 'Test thread', body: 'This is a test thread.' };

    const { result: createResult, store } = renderHookWithProviders(
      () => useCreateThreadMutation(),
      {
        preloadedState: { auth: { userToken: 'valid-test-token' } },
      },
    );
    const { result: fetchResult } = renderHookWithProviders(() => useFetchThreadsQuery(), {
      store,
    });
    const [createThread] = createResult.current;

    await waitFor(() => expect(fetchResult.current.isSuccess).toBe(true));
    const initialRequestId = fetchResult.current.requestId;

    act(() => {
      createThread(newThread);
    });

    await waitFor(() => expect(createResult.current[1].isSuccess).toBe(true));
    const response = createResult.current[1];

    expect(response).toMatchObject({
      endpointName: 'createThread',
      status: 'fulfilled',
    });
    expect(response.data).toBeDefined();

    const { thread } = response.data!;

    expect(thread.id).toBe('test-create-thread');
    expect(thread.category).toBe('general');
    expect(thread.totalComments).toBe(0);

    await waitFor(() => expect(fetchResult.current.requestId).not.toBe(initialRequestId));
  });

  it('should successfully make a new comment and invalidate thread after createComment using valid token mutation is fulfilled', async () => {
    const newComment = { threadId: 'thread-test-one', content: 'Test Comment' };

    const { result: commentResult, store } = renderHookWithProviders(
      () => useCreateCommentMutation(),
      {
        preloadedState: { auth: { userToken: 'valid-test-token' } },
      },
    );
    const { result: threadResult } = renderHookWithProviders(
      () => useFetchThreadDetailsQuery(newComment.threadId),
      {
        store,
      },
    );
    const [createComment] = commentResult.current;

    await waitFor(() => expect(threadResult.current.isSuccess).toBe(true));
    const initialRequestId = threadResult.current.requestId;

    act(() => {
      createComment(newComment);
    });

    await waitFor(() => expect(commentResult.current[1].isSuccess).toBe(true));
    const response = commentResult.current[1];

    expect(response).toMatchObject({
      endpointName: 'createComment',
      status: 'fulfilled',
    });
    expect(response.data).toBeDefined();
    expect(response.data!.comment.content).toBe(newComment.content);

    await waitFor(() => expect(threadResult.current.requestId).not.toBe(initialRequestId));
  });

  it('should successfully vote and optimistically update thread after voteThread using valid token mutation is fulfilled', async () => {
    const threadId = 'thread-test-one';
    const userId = 'user-test-one';

    const { result: voteResult, store } = renderHookWithProviders(() => useVoteThreadMutation(), {
      preloadedState: { auth: { userToken: 'valid-test-token' } },
    });
    const { result: threadResult } = renderHookWithProviders(() => useFetchThreadsQuery(), {
      store,
    });
    const [vote] = voteResult.current;

    await waitFor(() => expect(threadResult.current.isSuccess).toBe(true));

    expect(threadResult.current.data).toBeDefined();
    expect(
      threadResult.current.data!.threads.find((thread) => thread.id === threadId)!.upVotesBy,
    ).toHaveLength(0);

    // Upvote
    act(() => {
      vote({ type: 'up', threadId, userId });
    });

    await waitFor(() => expect(voteResult.current[1].isSuccess).toBe(true));
    const upVoteResponse = voteResult.current[1];

    expect(
      threadResult.current.data!.threads.find((thread) => thread.id === threadId)!.upVotesBy,
    ).toHaveLength(1);

    expect(upVoteResponse).toMatchObject({
      endpointName: 'voteThread',
      status: 'fulfilled',
    });
    expect(upVoteResponse.data).toBeDefined();
    expect(upVoteResponse.data!.vote.voteType).toBe(1);
    expect(upVoteResponse.data!.vote.threadId).toBe(threadId);

    // Downvote
    act(() => {
      vote({ type: 'down', threadId, userId });
    });

    await waitFor(() => expect(voteResult.current[1].isSuccess).toBe(true));
    const downVoteResponse = voteResult.current[1];

    expect(
      threadResult.current.data!.threads.find((thread) => thread.id === threadId)!.upVotesBy,
    ).toHaveLength(0);
    expect(
      threadResult.current.data!.threads.find((thread) => thread.id === threadId)!.downVotesBy,
    ).toHaveLength(1);

    expect(downVoteResponse).toMatchObject({
      endpointName: 'voteThread',
      status: 'fulfilled',
    });
    expect(downVoteResponse.data).toBeDefined();
    expect(downVoteResponse.data!.vote.voteType).toBe(-1);
    expect(downVoteResponse.data!.vote.threadId).toBe(threadId);

    // Neutralize
    act(() => {
      vote({ type: 'neutral', threadId, userId });
    });

    await waitFor(() => expect(voteResult.current[1].isSuccess).toBe(true));
    const neutralVoteResponse = voteResult.current[1];

    expect(
      threadResult.current.data!.threads.find((thread) => thread.id === threadId)!.upVotesBy,
    ).toHaveLength(0);
    expect(
      threadResult.current.data!.threads.find((thread) => thread.id === threadId)!.downVotesBy,
    ).toHaveLength(0);

    expect(neutralVoteResponse).toMatchObject({
      endpointName: 'voteThread',
      status: 'fulfilled',
    });
    expect(neutralVoteResponse.data).toBeDefined();
    expect(neutralVoteResponse.data!.vote.voteType).toBe(0);
    expect(neutralVoteResponse.data!.vote.threadId).toBe(threadId);
  });

  it('should successfully vote comment and optimistically update thread after voteComment using valid token mutation is fulfilled', async () => {
    const threadId = 'thread-test-one';
    const commentId = 'comment-test-one';
    const userId = 'user-test-one';

    const { result: voteResult, store } = renderHookWithProviders(() => useVoteCommentMutation(), {
      preloadedState: { auth: { userToken: 'valid-test-token' } },
    });
    const { result: threadResult } = renderHookWithProviders(
      () => useFetchThreadDetailsQuery(threadId),
      {
        store,
      },
    );
    const [vote] = voteResult.current;

    await waitFor(() => expect(threadResult.current.isSuccess).toBe(true));

    expect(threadResult.current.data).toBeDefined();
    expect(
      threadResult.current.data!.detailThread.comments.find((comment) => comment.id === commentId)!
        .upVotesBy,
    ).toHaveLength(0);

    // Upvote
    act(() => {
      vote({
        type: 'up',
        commentId,
        threadId,
        userId,
      });
    });

    await waitFor(() => expect(voteResult.current[1].isLoading).toBe(true));

    await waitFor(() => expect(voteResult.current[1].isSuccess).toBe(true));
    const upVoteResponse = voteResult.current[1];

    expect(
      threadResult.current.data!.detailThread.comments.find((comment) => comment.id === commentId)!
        .upVotesBy,
    ).toHaveLength(1);

    expect(upVoteResponse).toMatchObject({
      endpointName: 'voteComment',
      status: 'fulfilled',
    });
    expect(upVoteResponse.data).toBeDefined();
    expect(upVoteResponse.data!.vote.voteType).toBe(1);
    expect(upVoteResponse.data!.vote.commentId).toBe(commentId);

    // Downvote
    act(() => {
      vote({
        type: 'down',
        commentId,
        threadId,
        userId,
      });
    });

    await waitFor(() => expect(voteResult.current[1].isSuccess).toBe(true));
    const downVoteResponse = voteResult.current[1];

    expect(
      threadResult.current.data!.detailThread.comments.find((comment) => comment.id === commentId)!
        .upVotesBy,
    ).toHaveLength(0);
    expect(
      threadResult.current.data!.detailThread.comments.find((comment) => comment.id === commentId)!
        .downVotesBy,
    ).toHaveLength(1);

    expect(downVoteResponse).toMatchObject({
      endpointName: 'voteComment',
      status: 'fulfilled',
    });
    expect(downVoteResponse.data).toBeDefined();
    expect(downVoteResponse.data!.vote.voteType).toBe(-1);
    expect(upVoteResponse.data!.vote.commentId).toBe(commentId);

    // Neutralize
    act(() => {
      vote({
        type: 'neutral',
        commentId,
        threadId,
        userId,
      });
    });

    await waitFor(() => expect(voteResult.current[1].isSuccess).toBe(true));
    const neutralVoteResponse = voteResult.current[1];

    expect(
      threadResult.current.data!.detailThread.comments.find((comment) => comment.id === commentId)!
        .upVotesBy,
    ).toHaveLength(0);
    expect(
      threadResult.current.data!.detailThread.comments.find((comment) => comment.id === commentId)!
        .downVotesBy,
    ).toHaveLength(0);

    expect(neutralVoteResponse).toMatchObject({
      endpointName: 'voteComment',
      status: 'fulfilled',
    });
    expect(neutralVoteResponse.data).toBeDefined();
    expect(neutralVoteResponse.data!.vote.voteType).toBe(0);
    expect(upVoteResponse.data!.vote.commentId).toBe(commentId);
  });
});
