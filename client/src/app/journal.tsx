import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  Calendar,
  Clock,
  Edit3,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useUser } from '@clerk/clerk-react';
import type { Snippet } from '@/model/snippet';
import { Button } from '@/components/ui/button';
import { useGetSnippets } from '@/api/snippet.ts';
// import {useGetJournal} from "@/api/journal.ts";
import { useGetJournal, useUpdateJournal } from '@/api/journal.ts';
// import type { JournalEntry } from '@/model/journal';

const JournalView = () => {
  const [activeTab, setActiveTab] = useState<'edit' | 'insights'>('edit');
  const [journalContent, setJournalContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { snippets } = useGetSnippets();
  const { mutateAsync: fetchJournal } = useGetJournal();
  const { mutateAsync: updateJournal } = useUpdateJournal();

  const { user } = useUser();
  const [journalEntry, setJournalEntry] = useState<JournalEntry>();

  useEffect(() => {
    const loadJournal = async () => {
      try {
        const result = await fetchJournal();
        console.log('Fetched journal:', result[0].summary);
        setJournalEntry(result[0]);
      } catch (e) {
        console.error('Failed to fetch journal:', e);
      }
    };

    if (user) {
      loadJournal();
    }
  }, [user]);

  useEffect(() => {
    if (journalEntry?.summary) {
      setJournalContent(journalEntry.summary);
    }
  }, [journalEntry]);

  useEffect(() => {
    console.log('journalContent updated:', journalContent);
  }, [journalContent]);

  // Mock snippets for demonstration - in a real app this would come from props or state
  // const snippets: Array<Snippet> = [
  //   {
  //     id: 1,
  //     content:
  //       'Had a great morning coffee and felt energized for the day ahead. The weather is perfect!',
  //     mood: 5,
  //     timestamp: new Date().toISOString(),
  //     tags: ['morning', 'energy'],
  //     aiInsight: 'Positive morning routine detected',
  //   },
  //   {
  //     id: 2,
  //     content:
  //       'Meeting went well, but feeling a bit overwhelmed with the workload.',
  //     mood: 3,
  //     timestamp: new Date(Date.now() - 3600000).toISOString(),
  //     tags: ['work', 'stress'],
  //     aiInsight: 'Work stress pattern identified',
  //   },
  //   {
  //     id: 3,
  //     content:
  //       'Took a walk during lunch break. Fresh air really helped clear my mind.',
  //     mood: 4,
  //     timestamp: new Date(Date.now() - 7200000).toISOString(),
  //     tags: ['exercise', 'mindfulness'],
  //     aiInsight: 'Physical activity boosting mood',
  //   },
  // ];

  // Generate initial journal content from snippets
  // useEffect(() => {
  //   if (snippets.length > 0 && !journalContent) {
  //     const generatedContent = generateJournalFromSnippets(snippets);
  //     setJournalContent(generatedContent);
  //   }
  // }, [snippets, journalContent]);

  // useEffect(() => {
  //   if (journalEntry){
  //     setJournalContent(journalEntry.summary)
  //   }
  // }, [journalEntry]);

  // const generateJournalFromSnippets = (snippetList: Array<Snippet>) => {
  //   const sortedSnippets = [...snippetList].sort(
  //     (a, b) =>
  //       new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  //   );
  //
  //   let content = journal?.title ?? `# Today's Journal - ${new Date().toLocaleDateString(
  //     'en-US',
  //     {
  //       weekday: 'long',
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //     },
  //   )}\n\n`;
  //
  //   content += `## Daily Reflection\n\n`;
  //
  //   sortedSnippets.forEach((snippet) => {
  //     const time = new Date(snippet.timestamp).toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     });
  //     content += `**${time}** - ${snippet.content}\n\n`;
  //   });
  //
  //   content += `## Mood Summary\n\n`;
  //   const avgMood = (
  //     snippetList.reduce((sum, s) => sum + s.mood, 0) / snippetList.length
  //   ).toFixed(1);
  //   content += `Average mood today: ${avgMood}/5\n\n`;
  //
  //   content += `## Key Insights\n\n`;
  //   content += `- Captured ${snippetList.length} moments throughout the day\n`;
  //   content += `- Most common themes: ${getMostCommonTags(snippetList).join(', ')}\n\n`;
  //
  //   return content;
  // };

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

  const handleContentChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setJournalContent(e.target.value);
  };

  const handleUpdate = async () => {
    if (journalEntry?.summary !== journalContent && journalEntry?.id) {
      await updateJournal({
        ...journalEntry,
        summary: journalContent,
        id: journalEntry.id,
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  const aiInsights = [
    {
      type: 'pattern',
      icon: TrendingUp,
      title: 'Mood Pattern',
      content:
        'Your mood improved throughout the day, with the highest point after your lunch break walk.',
      color: 'text-green-600 bg-green-50',
    },
    {
      type: 'suggestion',
      icon: Lightbulb,
      title: 'Suggestion',
      content:
        'Consider scheduling more outdoor activities during work breaks to maintain positive momentum.',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      type: 'achievement',
      icon: Target,
      title: 'Achievement',
      content:
        'You successfully identified and addressed work stress through mindful reflection.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      type: 'wellness',
      icon: Heart,
      title: 'Wellness Tip',
      content:
        'Your entries show strong emotional awareness. This is a key indicator of mental wellness growth.',
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const moodEmojis: Record<number, string> = {
    1: '😢',
    2: '😔',
    3: '😐',
    4: '😊',
    5: '😄',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToDashboard}
                variant="ghost-animated"
                size="icon"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Today's Journal
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'edit'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'insights'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Brain className="w-4 h-4 inline mr-2" />
                Insights
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'edit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Journal Entry
                    </h2>
                    <button
                      onClick={() => {
                        if (isEditing) handleUpdate();
                        setIsEditing(!isEditing);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isEditing
                          ? 'bg-teal-500 text-white hover:bg-teal-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isEditing ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  {isEditing ? (
                    <textarea
                      ref={editorRef}
                      value={journalContent}
                      onChange={handleContentChange}
                      className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none font-mono text-sm"
                      placeholder="Start writing your journal entry..."
                    />
                  ) : (
                    <div className="prose prose-lg max-w-none">
                      <div
                        className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                        style={{ minHeight: '400px' }}
                      >
                        {journalContent ||
                          'No content yet. Click Edit to start writing.'}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Snippets Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  Today's Snippets
                </h3>
                <div className="space-y-3">
                  {snippets.length > 0 &&
                    snippets.map((snippet: Snippet) => (
                      <div
                        key={snippet.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg">
                            {moodEmojis[snippet.mood]}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(snippet.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {snippet.content}
                        </p>
                        {snippet.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {snippet.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Snippets</span>
                    <span className="font-semibold">{snippets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Mood</span>
                    <span className="font-semibold">
                      {snippets.length > 0
                        ? (
                            snippets.reduce((sum, s) => sum + s.mood, 0) /
                            snippets.length
                          ).toFixed(1)
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count</span>
                    <span className="font-semibold">
                      {journalContent.split(' ').length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Insights Tab */
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* AI Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-2xl border ${insight.color}`}
                  >
                    <div className="flex items-start space-x-3">
                      <insight.icon className="w-6 h-6 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">{insight.title}</h3>
                        <p className="text-sm opacity-80">{insight.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mood Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  Mood Timeline
                </h3>
                <div className="space-y-4">
                  {snippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="text-2xl">{moodEmojis[snippet.mood]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(snippet.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(snippet.mood / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {snippet.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Themes & Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  Themes & Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getMostCommonTags(snippets).map((tag) => (
                    <span
                      key={tag}
                      className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalView;
