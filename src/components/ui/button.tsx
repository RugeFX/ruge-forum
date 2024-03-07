/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'utils';
import { Link, LinkProps, To } from 'react-router-dom';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-400 text-zinc-900 hover:bg-emerald-500',
        secondary: 'bg-emerald-950 text-emerald-200 hover:bg-emerald-900 ',
        ghost: 'bg-zinc-900 text-white hover:bg-zinc-800',
        destructive: 'bg-red-950/70 text-red-300 hover:bg-red-950/90',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
  to?: To;
} & (
  | ({ to: To } & LinkProps)
  | ({
    to?: undefined;
  } & React.ComponentProps<'button'>)
);

export default function Button(props: ButtonProps) {
  const { variant, className } = props;

  if (props.to !== undefined) {
    return <Link {...props} className={cn(buttonVariants({ variant, className }))} />;
  }
  return (
    <button
      {...props}
      // eslint-disable-next-line react/button-has-type
      type={props.type || 'button'}
      className={cn(buttonVariants({ variant, className }))}
    />
  );
}
