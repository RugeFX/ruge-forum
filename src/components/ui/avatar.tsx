import * as RadixAvatar from '@radix-ui/react-avatar';
import type { User } from 'types/user';
import { cn } from 'utils';

interface AvatarProps {
  user?: Pick<User, 'avatar' | 'name'>;
  className?: string;
}

export default function Avatar({ user, className }: AvatarProps) {
  return (
    <RadixAvatar.Root
      data-testid="root"
      className={cn(
        'text-white bg-zinc-800 inline-flex size-10 select-none items-center justify-center overflow-hidden rounded-full align-middle',
        className,
      )}
    >
      <RadixAvatar.Image
        className="h-full w-full rounded-[inherit] object-cover"
        src={user?.avatar}
        alt={`${user?.name}'s Profile Picture`}
      />
      <RadixAvatar.Fallback
        data-testid="fallback"
        className="leading-none flex h-full w-full items-center justify-center bg-zinc-800 text-[15px]"
        delayMs={600}
      >
        {user?.name
          .split(' ')
          .map((string) => string[0])
          .join('') || ''}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
