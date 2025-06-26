import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: '01',
      title: 'Capture Snippets Throughout Your Day',
      description:
        'Quickly jot down thoughts, feelings, or moments as they happen. Each snippet is a mini journal entry, making it easy to reflect in real time.',
      image: '/placeholder.svg?height=300&width=400&text=Capture+Snippets',
    },
    {
      number: '02',
      title: 'Review Your Daily Snippets',
      description:
        'At the end of the day, revisit your snippets to see a timeline of your experiences and emotions.',
      image: '/placeholder.svg?height=300&width=400&text=Review+Snippets',
    },
    {
      number: '03',
      title: 'Analyze with AI Insights',
      description:
        'Request an AI analysis to uncover patterns, emotional trends, and receive personalized feedback based on your daily snippets.',
      image: '/placeholder.svg?height=300&width=400&text=AI+Analysis',
    },
    {
      number: '04',
      title: 'Track Your Growth Over Time',
      description:
        'Monitor your mental wellness journey with visual reports and insights, helping you recognize progress and areas for improvement.',
      image: '/placeholder.svg?height=300&width=400&text=Track+Growth',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 bg-gradient-to-b from-white to-teal-50"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto text-center">
            Our simple four-step process helps you improve your mental wellbeing
            through AI-powered journaling
          </p>
        </motion.div>

        <div className="mt-16 space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
              }
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="md:w-1/2">
                <div className="relative">
                  <motion.span
                    className="absolute -top-17.5 -left-10 text-7xl font-bold text-teal-100"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  >
                    {step.number}
                  </motion.span>
                  <motion.h3
                    className="text-2xl font-bold mb-4 text-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    className="text-lg text-gray-600 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                  >
                    {step.description}
                  </motion.p>
                  {index === steps.length - 1 && (
                    <motion.a
                      href="/dashboard"
                      className="btn-primary inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Your Journal Now
                    </motion.a>
                  )}
                </div>
              </div>
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.8, delay: index * 0.2 + 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={step.image || '/placeholder.svg'}
                    alt={step.title}
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
