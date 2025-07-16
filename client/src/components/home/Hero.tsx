import { easeOut, motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6"
            >
              Transform Your{' '}
              <span className="text-teal-600">Mental Wellness</span> with AI
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 mb-8 max-w-lg"
            >
              Your personal AI-powered journal that helps you track, understand,
              and improve your mental wellbeing through personalized insights
              and guidance.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <a href="/dashboard">
                  <Button className="w-full sm:w-auto" variant="teal-animated">
                    Start Your Journalling Now
                  </Button>
                </a>
              </motion.div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center"
            >
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                {['🦉', '🤓', '📚', '☕️'].map((emoji, i) => (
                  <Avatar
                    key={i}
                    className="w-10 h-10 -ml-2 border-2 border-white flex items-center justify-center bg-gray-100"
                  >
                    <span className="text-xl">{emoji}</span>
                    <AvatarFallback>{i + 1}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-600">
                <span className="font-semibold">Countless</span> TUM students
                now smiling—one journal snippet at a time
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            className="md:w-1/2 md:pl-10"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <motion.div
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                whileHover={{ y: -10, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Card className="py-0">
                  <CardContent className="p-0">
                    <img
                      src="pictures/smile-phone.jpg"
                      alt="ZenAI Journal Dashboard"
                      className="w-full h-auto"
                    />
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 bg-teal-100 rounded-lg p-4 shadow-md"
                initial={{ opacity: 0, x: -50, y: 50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center">
                  <motion.div
                    className="bg-green-500 h-3 w-3 rounded-full mr-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                    }}
                  ></motion.div>
                  <p className="text-sm font-medium">AI-powered journalling</p>
                </div>
              </motion.div>
              <motion.div
                className="absolute -top-6 -right-6 bg-teal-100 rounded-lg p-4 shadow-md"
                initial={{ opacity: 0, x: 50, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center">
                  <motion.div
                    className="bg-teal-500 h-3 w-3 rounded-full mr-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      delay: 1,
                    }}
                  ></motion.div>
                  <p className="text-sm font-medium">Personalized insights</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
