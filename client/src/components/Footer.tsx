import { motion, useInView, easeOut } from 'framer-motion';
import { GithubIcon, TreeDeciduousIcon } from 'lucide-react';
import { useRef } from 'react';

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  return (
    <footer className="bg-gray-900 text-white pt-8 pb-8" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col items-center text-center max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="flex items-center justify-center mb-4">
              <motion.svg
                className="w-8 h-8 text-teal-500"
                fill="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <TreeDeciduousIcon className="size-6" />
              </motion.svg>
              <span className="ml-2 text-xl font-bold text-white">ZenAI</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Transform your mental wellness with our AI-powered journaling app.
              Track your mood, gain insights, and improve your wellbeing.
            </p>
            <div className="flex justify-center space-x-6">
              {[
                {
                  logo: <GithubIcon />,
                  href: 'https://example.com',
                },
              ].map((icon, index) => (
                <motion.a
                  key={index}
                  href={icon.href}
                  className="text-gray-400 hover:text-white transition size-6"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {icon.logo}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-gray-800 pt-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ZenAI. All rights reserved.
            </p>
            <motion.div
              className="flex items-center text-gray-400 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Made with{' '}
              <span className="mx-1" role="img" aria-label="love">
                ❤️
              </span>{' '}
              by Team Zen
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
