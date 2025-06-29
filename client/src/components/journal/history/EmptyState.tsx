import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export const EmptyState = ({ hasSearchQuery }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center"
    >
      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {hasSearchQuery ? 'No matching journals found' : 'No journals found'}
      </h3>
      <p className="text-gray-600">
        {hasSearchQuery
          ? 'Try rephrasing your question or using different keywords'
          : 'Try adjusting your search or filter criteria'}
      </p>
    </motion.div>
  );
};
