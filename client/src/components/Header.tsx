import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { Activity, NotebookPenIcon, TreeDeciduousIcon } from 'lucide-react';
import { Button } from './ui/button';
import ApiDemo from './ApiDemo';

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
