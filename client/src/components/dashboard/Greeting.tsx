import { motion } from 'framer-motion';
import { Coffee, Moon, Plus, Sparkles, Sun, Sunset } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GreetingProps {
  userName?: string;
  onQuickEntry: () => void;
}

const Greeting: React.FC<GreetingProps> = ({
  userName = 'Sarah',
  onQuickEntry,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
      return {
        greeting: 'Good morning',
        icon: hour < 8 ? Coffee : Sun,
        gradient: 'from-amber-400 via-orange-400 to-yellow-500',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: 'Good afternoon',
        icon: Sun,
        gradient: 'from-blue-400 via-teal-400 to-cyan-500',
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        greeting: 'Good evening',
        icon: Sunset,
        gradient: 'from-purple-400 via-pink-400 to-rose-500',
      };
    } else {
      return {
        greeting: 'Good night',
        icon: Moon,
        gradient: 'from-indigo-500 via-purple-500 to-violet-600',
      };
    }
  };

  const timeGreeting = getTimeBasedGreeting();
  const TimeIcon = timeGreeting.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-6"
    >
      <div
        className={`bg-gradient-to-r ${timeGreeting.gradient} rounded-2xl p-4 md:p-6 text-white shadow-lg relative overflow-hidden`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/15 translate-y-12 -translate-x-12"></div>
        </div>

        {/* Sparkling effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -15, 0],
                x: [0, Math.random() * 10 - 5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.6,
                ease: 'easeInOut',
              }}
              style={{
                left: `${25 + i * 15}%`,
                top: `${20 + (i % 2) * 60}%`,
              }}
            >
              <Sparkles className="w-2 h-2 text-white/60" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5"
              >
                <TimeIcon className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg md:text-xl font-semibold">
                  {timeGreeting.greeting}, {userName}! 👋
                </h2>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              onClick={onQuickEntry}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 font-medium shadow-md hover:shadow-lg group text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Quick Entry</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Greeting;
