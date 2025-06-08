import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { TreeDeciduousIcon } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const {getToken} = useAuth();

  const getUsers = async () => {
    try {
        const token = await getToken();
        console.log('Token:', token);
        const response = await fetch('http://localhost:8085/api/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
        );

        if (response.status == 401) {
          alert('Authentication failed. Please sign in.');
          return;
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Users:', data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
        <Button onClick={getUsers}>Test API</Button>
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
