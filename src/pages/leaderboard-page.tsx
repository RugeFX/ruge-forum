import { useAppSelector } from 'app/hooks';
import Avatar from 'components/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { useFetchUserInfoQuery } from 'features/auth/auth-api';
import { selectToken } from 'features/auth/auth-slice';
import { useFetchLeaderboardsQuery } from 'features/leaderboard/leaderboard-api';

export default function LeaderboardPage() {
  const userToken = useAppSelector(selectToken);
  const { data: userInfo } = useFetchUserInfoQuery(undefined, {
    skip: !userToken,
    refetchOnFocus: false,
  });
  const { data: leaderboard } = useFetchLeaderboardsQuery();

  return (
    <section className="mb-4 px-5 py-2 w-full">
      <header className="flex flex-wrap items-center gap-x-4 pt-2 pb-4 mb-4 border-b border-zinc-700">
        <div className="flex flex-wrap gap-2 items-center">
          <h2 className="text-xl font-bold">Leaderboard</h2>
        </div>
      </header>
      <div className="w-full h-full p-3 bg-zinc-900 border border-zinc-700">
        <Table>
          <TableCaption>Score is determined by every users&apos; average interactions</TableCaption>
          <TableHeader>
            <TableRow className="border-emerald-400">
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard?.leaderboards.map((value, i) => (
              <TableRow key={value.user.id}>
                <TableCell className="font-medium text-center">{i + 1}</TableCell>
                <TableCell className="flex gap-4">
                  <Avatar className="shrink-0 size-5" user={value.user} />
                  <span>
                    {value.user.name}
                    <i className="italic pl-2">
                      {userInfo?.user.name === value.user.name && '(You)'}
                    </i>
                  </span>
                </TableCell>
                <TableCell className="text-right">{value.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
