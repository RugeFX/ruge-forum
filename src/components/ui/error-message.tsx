import { cn } from 'utils';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return <span className={cn('text-xs text-red-500', className)}>{message}</span>;
}
