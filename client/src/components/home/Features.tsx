import { easeOut, motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: (
        <svg
          className="w-10 h-10 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      title: 'AI-Powered Journaling',
      description:
        'Our AI analyzes your entries to provide personalized insights and patterns about your mental wellbeing over time.',
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: 'Mood Tracking',
      description:
        'Track your mood patterns and receive visualizations that help you understand your emotional trends.',
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Personalized Recommendations',
      description:
        'Get tailored wellness activities and exercises based on your journal entries and current mental state.',
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: 'Private & Secure',
      description:
        'Your journal entries are encrypted and completely private. We prioritize your data security and privacy.',
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),
      title: 'Guided Prompts',
      description:
        "Never face writer's block with our AI-generated journaling prompts tailored to your current needs.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Habit Building',
      description:
        'Develop a consistent journaling habit with gentle reminders and streak tracking to maintain your wellness routine.',
    },
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  return (
    <section id="features" className="py-16" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto text-center">
            Our AI-powered journal helps you understand yourself better and
            improve your mental wellbeing
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card group"
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
            >
              <motion.div
                className="bg-teal-100 rounded-lg p-3 inline-block mb-4 group-hover:bg-teal-200 transition duration-300"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
