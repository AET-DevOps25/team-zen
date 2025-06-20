import Footer from './Footer';
import Header from './Header';
import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <div className="mx-auto block max-w-[calc(80rem_+_2rem)] px-[1rem]">
        <Header />
      </div>
      {children}
      <Footer />
    </main>
  );
};

const ContentLayout = ({
  children,
  className = '',
}: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={cn(
        'mx-auto block max-w-[calc(80rem_+_2rem)] px-[1rem]',
        className,
      )}
    >
      {children}
    </div>
  );
};
export { ContentLayout };

export default Layout;
