import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  type: string;
  icon: LucideIcon;
  title: string;
  content: string;
  color: string;
  index: number;
}

export const InsightCard = ({
  type,
  icon: Icon,
  title,
  content,
  color,
  index,
}: InsightCardProps) => {
  return (
    <motion.div
      key={type}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-2xl border ${color}`}
    >
      <div className="flex items-start space-x-3">
        <Icon className="w-6 h-6 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm opacity-80 max-w-xl">{content}</p>
        </div>
      </div>
    </motion.div>
  );
};
