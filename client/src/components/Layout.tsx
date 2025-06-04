import Footer from './Footer';
import Header from './Header';
import type { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <div className="mx-auto block max-w-[calc(80rem_+_2rem)] px-[3rem]">
        <Header />
      </div>
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
