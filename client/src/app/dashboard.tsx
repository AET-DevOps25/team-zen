import { useNavigate, useParams } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Edit3, History } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import Greeting from '@/components/dashboard/Greeting';
import JournalBoard from '@/components/dashboard/JournalBoard';
import JournalHistory from '@/components/dashboard/JournalHistory';
import Overview from '@/components/dashboard/Overview';
import { useAuth } from '@/hooks';

const Dashboard: React.FC = () => {
  const { activeTab, handleTabChange } = useDashboardNavigation();
  const { userName } = useAuth();
  const navigate = useNavigate();

  const activeTabConfig = DASHBOARD_TABS[activeTab];
  const TabComponent = activeTabConfig.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="container mx-auto py-8">
        <Greeting
          userName={userName ?? ''}
          onQuickEntry={() => navigate({ to: '/snippet' })}
        />
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        <AnimatePresence mode="wait">
          <AnimatedTabContent activeTab={activeTab} tabConfig={activeTabConfig}>
            <TabComponent />
          </AnimatedTabContent>
        </AnimatePresence>
      </div>
    </div>
  );
};

export type DashboardTab = 'board' | 'overview' | 'history';

interface TabConfig {
  id: DashboardTab;
  label: string;
  icon: LucideIcon;
  path: string;
  component: React.ComponentType;
}

interface TabButtonProps {
  tab: TabConfig;
  isActive: boolean;
  onClick: (tabId: DashboardTab) => void;
}

interface AnimatedTabContentProps {
  activeTab: DashboardTab;
  tabConfig: TabConfig;
  children: React.ReactNode;
}

const DASHBOARD_TABS: Record<DashboardTab, TabConfig> = {
  board: {
    id: 'board',
    label: 'Journal Board',
    icon: Edit3,
    path: '/dashboard',
    component: JournalBoard,
  },
  history: {
    id: 'history',
    label: 'Previous Journals',
    icon: History,
    path: '/dashboard/history',
    component: JournalHistory,
  },
  overview: {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    path: '/dashboard/overview',
    component: Overview,
  },
} as const;

const ANIMATION_CONFIG = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
} as const;

const useDashboardNavigation = () => {
  const params = useParams({ strict: false });
  const navigate = useNavigate();

  const activeTab: DashboardTab = useMemo(() => {
    const tabFromParams = params.tab as DashboardTab | undefined;
    return tabFromParams && tabFromParams in DASHBOARD_TABS
      ? tabFromParams
      : 'board';
  }, [params.tab]);

  const handleTabChange = useCallback(
    (tab: DashboardTab) => {
      const config = DASHBOARD_TABS[tab];
      navigate({ to: config.path });
    },
    [navigate],
  );

  return { activeTab, handleTabChange };
};

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onClick }) => {
  const Icon = tab.icon;

  return (
    <motion.button
      onClick={() => onClick(tab.id)}
      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
        isActive
          ? 'bg-teal-500 text-white shadow-md'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={isActive}
      aria-label={`Switch to ${tab.label} tab`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      <span>{tab.label}</span>
    </motion.button>
  );
};

const TabNavigation: React.FC<{
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabEntries = Object.values(DASHBOARD_TABS);

  return (
    <nav className="flex justify-center mb-8" role="tablist">
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 inline-flex space-x-2">
        {tabEntries.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={onTabChange}
          />
        ))}
      </div>
    </nav>
  );
};

const AnimatedTabContent: React.FC<AnimatedTabContentProps> = ({
  activeTab,
  tabConfig,
  children,
}) => {
  if (activeTab === 'board') {
    return <>{children}</>;
  }

  return (
    <motion.div key={tabConfig.id} {...ANIMATION_CONFIG}>
      {children}
    </motion.div>
  );
};

export default Dashboard;
