import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, History } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import TodayJournal from '@/components/dashboard/TodayJournal';
import JournalHistory from '@/components/dashboard/JournalHistory';
import Overview from '@/components/dashboard/Overview';

const Dashboard = () => {
  const params = useParams({ strict: false });
  const navigate = useNavigate();

  const activeTab = params.tab
    ? (params.tab as 'today' | 'overview' | 'history')
    : 'today';

  const handleTabChange = (tab: 'today' | 'overview' | 'history') => {
    if (tab === 'today') {
      navigate({ to: '/dashboard' });
    } else {
      navigate({ to: `/dashboard/${tab}` });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="container mx-auto py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 inline-flex space-x-2">
            <motion.button
              onClick={() => handleTabChange('today')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'today'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit3 className="w-4 h-4" />
              <span>Today's Journal</span>
            </motion.button>
            <motion.button
              onClick={() => handleTabChange('history')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'history'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <History className="w-4 h-4" />
              <span>Previous Journals</span>
            </motion.button>
            <motion.button
              onClick={() => handleTabChange('overview')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'overview'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit3 className="w-4 h-4" />
              <span>Overview</span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'today' ? (
            <TodayJournal />
          ) : activeTab === 'history' ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <JournalHistory />
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Overview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
