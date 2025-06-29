import { motion } from 'framer-motion';
import type { Snippet } from '@/model/snippet';

interface ThemesAndTagsProps {
  snippets: Array<Snippet>;
}

export const ThemesAndTags = ({ snippets }: ThemesAndTagsProps) => {
  const getMostCommonTags = (snippetList: Array<Snippet>) => {
    const tagCount: Record<string, number> = {};
    snippetList.forEach((snippet) => {
      snippet.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);
  };

  const commonTags = getMostCommonTags(snippets);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Themes & Tags</h3>
      <div className="flex flex-wrap gap-2">
        {commonTags.length > 0 ? (
          commonTags.map((tag) => (
            <span
              key={tag}
              className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-500">No tags available yet.</p>
        )}
      </div>
    </motion.div>
  );
};
