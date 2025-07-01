import Features from '@/components/home/Features';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;
