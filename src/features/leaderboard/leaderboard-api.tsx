import { api } from 'app/api';
import type { Leaderboard } from 'types/leaderboard';

type LeaderboardsResponse = { leaderboards: Leaderboard[] };

const leaderboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchLeaderboards: builder.query<LeaderboardsResponse, void>({
      query: () => 'leaderboards',
      providesTags: (result) => [
        ...(result?.leaderboards ?? []).map(
          ({ user }) => ({ type: 'Leaderboard', id: user.id }) as const,
        ),
        { type: 'Leaderboard' },
      ],
    }),
  }),
});

export const { useFetchLeaderboardsQuery } = leaderboardApi;
export default leaderboardApi;
