import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

interface DetailsHeaderProps {
  title: string;
  category?: string;
}

export default function DetailsHeader({ title, category }: DetailsHeaderProps) {
  return (
    <header className="bg-black flex flex-wrap items-center gap-x-4 pt-2 pb-4 mb-4 border-b border-zinc-700">
      <Link
        to=".."
        className="text-white hover:text-emerald-200 hover:bg-emerald-950 rounded-md p-1 transition-colors"
      >
        <span className="sr-only">Back to Home</span>
        <ArrowLeftIcon className="size-7" />
      </Link>
      <div className="flex flex-wrap gap-2 items-center">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        {category !== undefined && (
          <span className="block h-full w-max px-2 text-emerald-200 bg-emerald-950 hover:bg-emerald-900 rounded-md select-none transition-colors">
            #
            {category}
          </span>
        )}
      </div>
    </header>
  );
}
