import { waitFor } from '@testing-library/react';
import { useFetchLeaderboardsQuery } from 'features/leaderboard/leaderboard-api';
import { renderHookWithProviders } from 'utils/test-utils';
import { describe, expect, it } from 'vitest';

describe('Leaderboard API', () => {
  it('should return leaderboard ranking after fetchLeaderboards query is fulfilled', async () => {
    const { result } = renderHookWithProviders(() => useFetchLeaderboardsQuery());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toMatchObject({
      endpointName: 'fetchLeaderboards',
      status: 'fulfilled',
    });
    expect(result.current.data).toBeDefined();

    const { leaderboards } = result.current.data!;

    expect(leaderboards).toHaveLength(2);
    expect(leaderboards[0].user.id).toBe('user-test-one');
    expect(leaderboards[0].score).toBe(25);
  });
});
