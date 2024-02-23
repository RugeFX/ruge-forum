import { ComponentProps, ComponentRef, forwardRef } from 'react';
import { cn } from 'utils';

const Input = forwardRef<ComponentRef<'input'>, ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      className={cn(
        'px-2.5 text-base leading-none border border-zinc-700 bg-zinc-800 text-white h-[35px] outline-none focus:ring focus:ring-emerald-400 transition-all',
        className,
      )}
    />
  ),
);

export default Input;
