import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  Edit3,
  Heart,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useGetSnippets } from '@/api/snippet.ts';

const TodayJournal = () => {
  const [currentStreak] = useState(7);
  const [todaysMood] = useState(4);
  const { snippets, isLoading } = useGetSnippets({
    date: new Date().toISOString().split('T')[0],
  });

  const navigate = useNavigate();

  const averageMood =
    !isLoading && snippets.length > 0
      ? (
          snippets.reduce((sum, snippet) => sum + snippet.mood, 0) /
          snippets.length
        ).toFixed(1)
      : 0;

  // const mockSnippets: Array<Snippet> = [
  //   {
  //     id: 1,
  //     content:
  //       'Had a great morning coffee and felt energized for the day ahead. The weather is perfect!',
  //     mood: 5,
  //     timestamp: new Date().toISOString(),
  //     tags: ['morning', 'energy'],
  //     insights: 'Positive morning routine detected',
  //     userId: "user-id-placeholder", // Replace with actual user ID
  //   },
  //   {
  //     id: 2,
  //     content:
  //       'Meeting went well, but feeling a bit overwhelmed with the workload.',
  //     mood: 3,
  //     timestamp: new Date(Date.now() - 3600000).toISOString(),
  //     tags: ['work', 'stress'],
  //     insights: 'Work stress pattern identified',
  //     userId: "user-id-placeholder", // Replace with actual user ID
  //   },
  //   {
  //     id: 3,
  //     content:
  //       'Took a walk during lunch break. Fresh air really helped clear my mind.',
  //     mood: 4,
  //     timestamp: new Date(Date.now() - 7200000).toISOString(),
  //     tags: ['exercise', 'mindfulness'],
  //     insights: 'Physical activity boosting mood',
  //     userId: "user-id-placeholder", // Replace with actual user ID
  //   },
  // ];

  const handleCreateSnippet = () => {
    // Navigate to snippet creation page
    navigate({ to: '/snippet' });
  };

  const handleViewJournal = () => {
    // TODO: Navigate to journal view with snippets
    console.log('View journal with snippets:', snippets);
    navigate({
      to: '/journal',
      params: { snippets: JSON.stringify(snippets) },
    });
  };

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Very Low', color: 'text-red-500' },
    { value: 2, emoji: '😔', label: 'Low', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: '😄', label: 'Excellent', color: 'text-teal-500' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Today's Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Today's Journal
              </h1>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex space-x-3">
              {' '}
              <Button onClick={handleCreateSnippet} variant="teal-animated">
                <Plus className="w-4 h-4" />
                <span>Add Snippet</span>
              </Button>
              {snippets.length > 0 && (
                <Button
                  onClick={handleViewJournal}
                  variant="blue-animated"
                  // TODO: Add logic to disable button if no journal
                  disabled={!isLoading && snippets.length === 0}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Journal</span>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-teal-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">
                {snippets.length}
              </div>
              <div className="text-sm text-gray-600">Snippets Today</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {averageMood}
              </div>
              <div className="text-sm text-gray-600">Avg Mood</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentStreak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>

          {/* Action Buttons */}
          {snippets.length > 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Ready to create your journal?
                    </h3>
                    <p className="text-sm text-gray-600">
                      You have {snippets.length} snippets to aggregate
                    </p>
                  </div>
                </div>
                <Button onClick={handleViewJournal} variant="purple-animated">
                  <BookOpen className="w-4 h-4" />
                  <span>Create Journal</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Snippets List */}
          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Edit3 className="w-4 h-4 mr-2" />
              Today's Snippets
            </h3>

            <AnimatePresence>
              {!isLoading &&
                snippets.map((snippet, index) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-400"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {
                            moodEmojis.find((m) => m.value === snippet.mood)
                              ?.emoji
                          }
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(snippet.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{snippet.content}</p>
                    {snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {snippet.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {snippet.insights && (
                      <div className="bg-teal-50 rounded-md p-2 flex items-center">
                        <Brain className="w-4 h-4 text-teal-600 mr-2" />
                        <span className="text-sm text-teal-700">
                          {snippet.insights}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>

            {!isLoading && snippets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Edit3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>
                  No snippets yet today. Start by adding your first thought!
                </p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8 text-gray-500">
                <p>Loading today's snippets...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Mood Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Mood Tracker
          </h3>
          <div className="space-y-3">
            {moodEmojis.map((mood) => (
              <div
                key={mood.value}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="text-sm text-gray-600">{mood.label}</span>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${mood.value <= todaysMood ? 'bg-teal-500' : 'bg-gray-200'}`}
                    style={{
                      width: `${(snippets.filter((s) => s.mood === mood.value).length / Math.max(snippets.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
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

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            This Week
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Entries</span>
              <span className="font-semibold">12/14</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Mood</span>
              <span className="font-semibold">4.2/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Streak</span>
              <span className="font-semibold text-teal-600">
                {currentStreak} days
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TodayJournal;
