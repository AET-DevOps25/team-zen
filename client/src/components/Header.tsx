import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { TreeDeciduousIcon } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="py-4 flex bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="font-bold">
          <Link
            to="/"
            className="flex gap-x-1 text-xl items-center hover:text-teal-700 transition-colors"
          >
            <TreeDeciduousIcon className="size-6" />
            ZenAI
          </Link>
        </div>
      </nav>
      <div className="flex items-center gap-2">
        <SignedOut>
          <Button asChild>
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
