import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { QuickStats } from '../journal/QuickStats';
import { JournalActions } from '../today/JournalActions';
import { MoodTracker } from '../today/MoodTracker';
import { SnippetsList } from '../today/SnippetsList';
import { WeeklyProgress } from '../today/WeeklyProgress';
import { useJournalState } from '@/hooks';
import { useGetUserStatistics } from '@/api/journal';
import { useGetSnippets } from '@/api/snippet.ts';

const TodayJournal = () => {
  const { snippets, isLoading } = useGetSnippets({
    date: new Date().toISOString().split('T')[0],
  });
  const { data: userStats, isLoading: statsLoading } = useGetUserStatistics();

  const navigate = useNavigate();
  const { journalContent } = useJournalState();

  const averageMood =
    !isLoading && snippets.length > 0
      ? (
          snippets.reduce((sum, snippet) => sum + snippet.mood, 0) /
          snippets.length
        ).toFixed(1)
      : 0;

  const todaysMood = snippets.length > 0 ? Math.round(Number(averageMood)) : 0;

  const handleCreateSnippet = () => {
    navigate({ to: '/snippet' });
  };

  const handleViewJournal = () => {
    navigate({
      to: '/journal',
      params: { snippets: JSON.stringify(snippets) },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <JournalActions
            onCreateSnippet={handleCreateSnippet}
            onViewJournal={handleViewJournal}
            journalContent={journalContent}
            isLoading={isLoading}
            snippets={snippets}
          />

          <QuickStats
            snippets={snippets}
            isLoading={isLoading}
            averageMood={averageMood as string}
            currentStreak={userStats?.currentStreak ?? 0}
            statsLoading={statsLoading}
            journalContent={journalContent}
          />

          <SnippetsList
            snippets={snippets}
            isLoading={isLoading}
            journalContent={journalContent}
            onViewJournal={handleViewJournal}
          />
        </motion.div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <MoodTracker snippets={snippets} todaysMood={todaysMood} />
        <WeeklyProgress userStats={userStats} statsLoading={statsLoading} />
      </div>
    </div>
  );
};

export default TodayJournal;
