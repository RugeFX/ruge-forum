import { cn } from 'utils';

export default function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-zinc-900', className)} {...props} />;
}
