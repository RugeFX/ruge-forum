import * as RadixAvatar from '@radix-ui/react-avatar';
import type { User } from 'types/user';
import { cn } from 'utils';

interface AvatarProps {
  user?: User;
  className?: string;
}

export default function Avatar({ user, className }: AvatarProps) {
  if (!user) {
    return <div className={cn('size-10 bg-zinc-700 rounded-full animate-pulse', className)} />;
  }

  return (
    <RadixAvatar.Root
      className={cn(
        'bg-white inline-flex size-10 select-none items-center justify-center overflow-hidden rounded-full align-middle',
        className,
      )}
    >
      <RadixAvatar.Image
        className="h-full w-full rounded-[inherit] object-cover"
        src={user.avatar}
        alt={`${user.name}'s Profile Picture`}
      />
      <RadixAvatar.Fallback
        className="text-black leading-none flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
        delayMs={600}
      >
        {user.name
          .split(' ')
          .map((string) => string[0])
          .join('') || 'UN'}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
