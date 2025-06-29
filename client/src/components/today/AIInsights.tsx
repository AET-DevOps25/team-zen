import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const AIInsights = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-6 text-white"
    >
      <h3 className="font-semibold mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2" />
        AI Insights
      </h3>
      <div className="space-y-3">
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-sm">
            Your mood tends to improve after physical activities. Consider a
            short walk!
          </p>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-sm">
            Morning entries show 40% higher positivity. Great start to your
            days!
          </p>
        </div>
      </div>
    </motion.div>
  );
};
