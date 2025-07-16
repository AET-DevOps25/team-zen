import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';
import { Link, useLocation } from '@tanstack/react-router';
import { NotebookPenIcon } from 'lucide-react';
import ApiDemo from './ApiDemo';
import { Button } from './ui/button';

const ZenAIIcon = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
    Z
  </div>
);

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  return (
    <header className="container mx-auto py-4 flex bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="font-bold">
          <Link
            to={isDashboardPage ? '/dashboard' : '/'}
            className="flex gap-x-2 text-2xl items-center hover:text-teal-700 transition-all hover:scale-105"
          >
            <ZenAIIcon />
            ZenAI
          </Link>
        </div>
      </nav>
      <div className="flex items-center gap-4">
        <ApiDemo />
        <SignedOut>
          <Button variant="teal-animated" asChild>
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          {isHomePage && (
            <Button variant="teal-animated" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <NotebookPenIcon className="size-4" />
                My Journal
              </Link>
            </Button>
          )}
          <UserButton userProfileMode="navigation" userProfileUrl="/profile" />
        </SignedIn>
      </div>
    </header>
  );
}
