import type { Snippet } from '@/model/snippet';

interface QuickStatsProps {
  snippets: Array<Snippet>;
  isLoading: boolean;
  averageMood: string | number;
  currentStreak: number;
  statsLoading: boolean;
}

export const QuickStats = ({
  snippets,
  isLoading,
  averageMood,
  currentStreak,
  statsLoading,
}: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-teal-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-teal-600">
          {isLoading ? (
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
          ) : (
            snippets.length
          )}
        </div>
        <div className="text-sm text-gray-600">Snippets Today</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">
          {isLoading ? (
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
          ) : (
            averageMood
          )}
        </div>
        <div className="text-sm text-gray-600">Avg Mood</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-green-600">
          {statsLoading ? (
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
          ) : (
            currentStreak
          )}
        </div>
        <div className="text-sm text-gray-600">Day Streak</div>
      </div>
    </div>
  );
};
