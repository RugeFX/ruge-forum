import { HomeIcon, ReaderIcon } from '@radix-ui/react-icons';
import type { IconProps } from '@radix-ui/react-icons/dist/types';

type RadixIcon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;

const navigationItems: { label: string; to: string; Icon: RadixIcon }[] = [
  {
    label: 'Home',
    to: '/',
    Icon: HomeIcon,
  },
  {
    label: 'Leaderboard',
    to: '/leaderboard',
    Icon: ReaderIcon,
  },
];

export default navigationItems;
