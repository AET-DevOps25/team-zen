import { OverallStats, WeeklyStats } from '@/components/overview';
import { useGetAllJournals, useGetUserStatistics } from '@/api/journal';
import { useWeeklyMoodData } from '@/hooks';

const Overview = () => {
  const { data: userStatistics, isLoading, error } = useGetUserStatistics();
  const { journals } = useGetAllJournals();
  const weeklyMoodData = useWeeklyMoodData(journals);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !userStatistics) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">
            Failed to load statistics. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OverallStats userStatistics={userStatistics} />

      <WeeklyStats
        userStatistics={userStatistics}
        weeklyMoodData={weeklyMoodData}
      />
    </div>
  );
};

export default Overview;
