import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { NotebookPenIcon, TreeDeciduousIcon } from 'lucide-react';
import ApiDemo from './ApiDemo';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="container mx-auto py-4 flex bg-white text-black justify-between">
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
      <div className="flex items-center gap-4">
        <ApiDemo />
        <SignedOut>
          <Button asChild>
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <Button asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <NotebookPenIcon className="size-4" />
              My Journal
            </Link>
          </Button>
          <UserButton userProfileMode="navigation" userProfileUrl="/profile" />
        </SignedIn>
      </div>
    </header>
  );
}
