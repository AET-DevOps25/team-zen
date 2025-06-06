import { motion, useInView } from 'framer-motion';
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
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="flex items-center mb-4">
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
            <div className="flex space-x-4">
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

          {[
            {
              title: 'Product',
              links: [
                'Features',
                'How It Works',
                'Pricing',
                'FAQ',
                'Download App',
              ],
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Blog', 'Press', 'Contact'],
            },
            {
              title: 'Legal',
              links: [
                'Privacy Policy',
                'Terms of Service',
                'Cookie Policy',
                'GDPR',
              ],
            },
          ].map((section, sectionIndex) => (
            <motion.div key={sectionIndex} variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex}>
                    <motion.a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                      whileHover={{ x: 5 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
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
            <div className="flex space-x-4">
              {['Privacy', 'Terms', 'Cookies'].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition"
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
