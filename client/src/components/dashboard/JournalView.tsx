import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Heart,
  Lightbulb,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Snippet } from '@/model/snippet';

// Type definitions
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: number;
  snippetIds: Array<string>;
  insights?: Array<string> | Array<AIInsight>;
}

interface AIInsight {
  type: string;
  icon: React.ComponentType<any>;
  title: string;
  content: string;
  color: string;
}

type SaveStatus = 'success' | 'error' | null;

type JournalViewProps = {
  onBack: () => void;
  snippets: Array<Snippet>;
  journal: JournalEntry | null;
};

const JournalView = ({
  onBack,
  snippets = [],
  journal = null,
}: JournalViewProps) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [journalContent, setJournalContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<Array<AIInsight>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [journalTitle, setJournalTitle] = useState('');
  const editorRef = useRef(null);

  // Generate initial journal content from snippets
  useEffect(() => {
    if (snippets.length > 0 && !journalContent && !journal) {
      generateJournalFromSnippets();
    } else if (journal) {
      setJournalContent(journal.content || '');
      setJournalTitle(journal.title || '');
      // Handle insights type safely
      const insights = journal.insights || [];
      if (
        Array.isArray(insights) &&
        insights.length > 0 &&
        typeof insights[0] === 'object'
      ) {
        setAiInsights(insights as Array<AIInsight>);
      } else {
        setAiInsights([]);
      }
    }
  }, [snippets, journalContent, journal]);

  const generateJournalFromSnippets = async () => {
    setIsGenerating(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const sortedSnippets = [...snippets].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    // Generate a cohesive narrative
    let content = '';

    // Auto-generate title based on dominant mood and themes
    const avgMood =
      snippets.reduce((sum, s) => sum + s.mood, 0) / snippets.length;
    const allTags = snippets.flatMap((s) => s.tags);
    const dominantTheme = getMostFrequentTag(allTags);

    const moodDescriptors = {
      1: 'Challenging',
      2: 'Reflective',
      3: 'Balanced',
      4: 'Positive',
      5: 'Inspiring',
    } as const;

    const moodKey = Math.max(
      1,
      Math.min(5, Math.round(avgMood)),
    ) as keyof typeof moodDescriptors;
    const generatedTitle = `${moodDescriptors[moodKey]} ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}${dominantTheme ? ` - ${dominantTheme}` : ''}`;
    setJournalTitle(generatedTitle);

    // Create flowing narrative
    content += `# ${generatedTitle}\n\n`;
    content += `*${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}*\n\n`;

    // Group snippets by themes and time periods
    const morningSnippets = sortedSnippets.filter(
      (s) => new Date(s.timestamp).getHours() < 12,
    );
    const afternoonSnippets = sortedSnippets.filter((s) => {
      const hour = new Date(s.timestamp).getHours();
      return hour >= 12 && hour < 17;
    });
    const eveningSnippets = sortedSnippets.filter(
      (s) => new Date(s.timestamp).getHours() >= 17,
    );

    if (morningSnippets.length > 0) {
      content += `## Morning Reflections\n\n`;
      content += createNarrativeFromSnippets(morningSnippets);
      content += `\n\n`;
    }

    if (afternoonSnippets.length > 0) {
      content += `## Afternoon Thoughts\n\n`;
      content += createNarrativeFromSnippets(afternoonSnippets);
      content += `\n\n`;
    }

    if (eveningSnippets.length > 0) {
      content += `## Evening Reflections\n\n`;
      content += createNarrativeFromSnippets(eveningSnippets);
      content += `\n\n`;
    }

    // Add mood summary
    content += `## Daily Summary\n\n`;
    content += `Today brought a range of experiences and emotions. `;
    content += `My overall mood averaged ${avgMood.toFixed(1)}/5, with ${snippets.length} moments captured throughout the day. `;

    if (dominantTheme) {
      content += `The main theme that emerged was around **${dominantTheme}**, which seemed to influence much of my day. `;
    }

    const moodRange =
      Math.max(...snippets.map((s) => s.mood)) -
      Math.min(...snippets.map((s) => s.mood));
    if (moodRange > 2) {
      content += `There was quite a bit of emotional variation today, which shows the dynamic nature of my experiences. `;
    } else {
      content += `My mood remained relatively stable throughout the day, suggesting a sense of emotional balance. `;
    }

    content += `\n\nLooking back on these moments, I can see patterns in what affects my wellbeing and what brings me joy or challenge.`;

    setJournalContent(content);
    setIsGenerating(false);

    // Auto-generate insights after content is ready
    generateAIInsights(content, snippets);
  };

  const createNarrativeFromSnippets = (snippetGroup: Array<Snippet>) => {
    return (
      snippetGroup
        .map((snippet, index) => {
          const connector =
            index === 0
              ? ''
              : index === snippetGroup.length - 1
                ? 'Later, '
                : 'Then, ';

          const moodContext =
            snippet.mood <= 2
              ? 'I found myself feeling '
              : snippet.mood >= 4
                ? 'I was pleased to notice '
                : 'I observed that ';

          return `${connector}${moodContext.toLowerCase()}${snippet.content.toLowerCase().charAt(0)}${snippet.content.slice(1)}`;
        })
        .join('. ') + '.'
    );
  };

  const getMostFrequentTag = (tags: Array<string>): string | null => {
    if (tags.length === 0) return null;
    const frequency: Record<string, number> = {};
    tags.forEach((tag) => (frequency[tag] = (frequency[tag] || 0) + 1));
    return Object.keys(frequency).reduce((a, b) =>
      frequency[a] > frequency[b] ? a : b,
    );
  };

  const generateAIInsights = async (
    content: string,
    snippetData: Array<Snippet>,
  ): Promise<void> => {
    setIsGeneratingInsights(true);

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const insights: Array<AIInsight> = [];

    // Mood pattern analysis
    const moods = snippetData.map((s) => s.mood);
    const moodTrend = moods.length > 1 ? moods[moods.length - 1] - moods[0] : 0;

    if (moodTrend > 0) {
      insights.push({
        type: 'pattern',
        icon: TrendingUp,
        title: 'Positive Mood Trajectory',
        content: `Your mood improved throughout the day, ending ${moodTrend} point${moodTrend > 1 ? 's' : ''} higher than when you started. This suggests effective emotional regulation.`,
        color: 'text-green-600 bg-green-50 border-green-200',
      });
    } else if (moodTrend < -1) {
      insights.push({
        type: 'pattern',
        icon: TrendingUp,
        title: 'Mood Decline Pattern',
        content: `Your mood decreased during the day. Consider what factors might have contributed and strategies that could help maintain emotional balance.`,
        color: 'text-orange-600 bg-orange-50 border-orange-200',
      });
    }

    // Activity correlation analysis
    snippetData.flatMap((s) => s.tags);
    const tagMoodMap: Record<string, Array<number>> = {};
    snippetData.forEach((snippet) => {
      snippet.tags.forEach((tag) => {
        tagMoodMap[tag] ??= [];
        tagMoodMap[tag].push(snippet.mood);
      });
    });

    const positiveActivities = Object.entries(tagMoodMap)
      .filter(
        ([, tagMoods]) =>
          tagMoods.reduce((a, b) => a + b, 0) / tagMoods.length >= 4,
      )
      .map(([tag]) => tag);

    if (positiveActivities.length > 0) {
      insights.push({
        type: 'correlation',
        icon: Lightbulb,
        title: 'Mood Boosters Identified',
        content: `Activities related to ${positiveActivities.join(', ')} consistently correlate with higher mood scores. Consider incorporating more of these into your routine.`,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
      });
    }

    // Emotional vocabulary analysis
    const emotionalWords =
      content
        .toLowerCase()
        .match(
          /\b(grateful|happy|stressed|anxious|excited|calm|frustrated|accomplished|peaceful|overwhelmed|energized|tired)\b/g,
        ) || [];
    const dominantEmotion = getMostFrequentTag(emotionalWords);

    if (dominantEmotion) {
      insights.push({
        type: 'vocabulary',
        icon: Brain,
        title: 'Emotional Awareness',
        content: `The word "${dominantEmotion}" appeared frequently in your entries, suggesting this was a significant emotional theme today. Recognizing these patterns builds emotional intelligence.`,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
      });
    }

    // Resilience indicators
    const challengeWords =
      content
        .toLowerCase()
        .match(
          /\b(difficult|challenge|stress|problem|struggle|overcome|manage|cope)\b/g,
        ) || [];
    const solutionWords =
      content
        .toLowerCase()
        .match(
          /\b(solved|better|improved|helped|worked|successful|accomplished|learned)\b/g,
        ) || [];

    if (challengeWords.length > 0 && solutionWords.length > 0) {
      insights.push({
        type: 'resilience',
        icon: Target,
        title: 'Resilience in Action',
        content: `You demonstrated resilience today by acknowledging challenges while also noting solutions and improvements. This balanced perspective supports mental wellbeing.`,
        color: 'text-teal-600 bg-teal-50 border-teal-200',
      });
    }

    // Gratitude detection
    const gratitudeWords =
      content
        .toLowerCase()
        .match(/\b(grateful|thankful|appreciate|blessed|fortunate|glad)\b/g) ||
      [];
    if (gratitudeWords.length > 0) {
      insights.push({
        type: 'gratitude',
        icon: Heart,
        title: 'Gratitude Practice',
        content: `Your entries show expressions of gratitude, which research links to improved mental health and life satisfaction. This positive focus is beneficial for wellbeing.`,
        color: 'text-pink-600 bg-pink-50 border-pink-200',
      });
    }

    setAiInsights(insights);
    setIsGeneratingInsights(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const journalEntry = {
        id: journal?.id || Date.now(),
        title: journalTitle,
        content: journalContent,
        snippets: snippets,
        insights: aiInsights,
        updatedAt: new Date().toISOString(),
        wordCount: journalContent.split(' ').length,
        mood:
          snippets.length > 0
            ? snippets.reduce((sum, s) => sum + s.mood, 0) / snippets.length
            : 0,
      };

      // Here you would save to your backend/storage
      console.log('Saving journal:', journalEntry);

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving journal:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Here you would delete from your backend/storage
      console.log('Deleting journal:', journal?.id);

      setShowDeleteConfirm(false);
      onBack(); // Navigate back after deletion
    } catch (error) {
      console.error('Error deleting journal:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalContent(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJournalTitle(e.target.value);
  };

  const moodEmojis = {
    1: '😢',
    2: '😔',
    3: '😐',
    4: '😊',
    5: '😄',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Journal Entry
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

            {/* Enhanced Tab Navigation */}
            <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
              <motion.button
                onClick={() => setActiveTab('edit')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'edit'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('insights')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  activeTab === 'insights'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Brain className="w-4 h-4" />
                <span>Insights</span>
                {aiInsights.length > 0 && (
                  <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {aiInsights.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'edit' ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              {/* Main Editor */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Enhanced Header with Actions */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 mr-4">
                        <input
                          type="text"
                          value={journalTitle}
                          onChange={handleTitleChange}
                          placeholder="Enter journal title..."
                          className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full placeholder-gray-400 focus:placeholder-gray-300"
                        />
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {
                              journalContent
                                .split(' ')
                                .filter((word) => word.length > 0).length
                            }{' '}
                            words
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {snippets.length} snippets
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Save Status Indicator */}
                        <AnimatePresence>
                          {saveStatus === 'success' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center text-green-600 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Saved
                            </motion.div>
                          )}
                          {saveStatus === 'error' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center text-red-600 text-sm"
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Error
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <motion.button
                          onClick={() => setIsEditing(!isEditing)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                            isEditing
                              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>{isEditing ? 'Preview' : 'Edit'}</span>
                        </motion.button>

                        <motion.button
                          onClick={handleSave}
                          disabled={isSaving || !journalContent.trim()}
                          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-md hover:shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isSaving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          <span>{isSaving ? 'Saving...' : 'Save'}</span>
                        </motion.button>

                        {journal && (
                          <motion.button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Generation Status */}
                    <AnimatePresence>
                      {isGenerating && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center"
                        >
                          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                          <div>
                            <p className="text-blue-800 font-medium">
                              Generating your journal...
                            </p>
                            <p className="text-blue-600 text-sm">
                              AI is compiling your snippets into a cohesive
                              narrative
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content Area */}
                  <div className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <textarea
                          ref={editorRef}
                          value={journalContent}
                          onChange={handleContentChange}
                          className="w-full h-96 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                          placeholder="Start writing your journal entry..."
                        />
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Use Markdown for formatting</span>
                          <span>{journalContent.length} characters</span>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-lg max-w-none">
                        <div
                          className="whitespace-pre-wrap text-gray-800 leading-relaxed"
                          style={{ minHeight: '400px' }}
                        >
                          {journalContent || (
                            <div className="text-center py-16 text-gray-500">
                              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg">No content yet.</p>
                              <p>
                                Click Edit to start writing or generate from
                                snippets.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="space-y-6">
                {/* Snippets Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Source Snippets
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {snippets.length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {snippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-100"
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
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
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

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <motion.button
                      onClick={generateJournalFromSnippets}
                      disabled={isGenerating || snippets.length === 0}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>
                        {isGenerating ? 'Generating...' : 'Regenerate Journal'}
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() =>
                        generateAIInsights(journalContent, snippets)
                      }
                      disabled={isGeneratingInsights || !journalContent.trim()}
                      className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isGeneratingInsights ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      <span>
                        {isGeneratingInsights
                          ? 'Analyzing...'
                          : 'Generate Insights'}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Entry Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Word Count</span>
                      <span className="font-semibold text-gray-900">
                        {
                          journalContent
                            .split(' ')
                            .filter((word) => word.length > 0).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg Mood</span>
                      <span className="font-semibold text-gray-900">
                        {snippets.length > 0
                          ? (
                              snippets.reduce((sum, s) => sum + s.mood, 0) /
                              snippets.length
                            ).toFixed(1)
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time Span</span>
                      <span className="font-semibold text-gray-900">
                        {snippets.length > 1 ? 'Full Day' : 'Single Moment'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* Enhanced Insights Tab */
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Insights Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Brain className="w-6 h-6 mr-2 text-purple-600" />
                        AI Insights
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Personalized analysis of your journal entry and
                        emotional patterns
                      </p>
                    </div>
                    {aiInsights.length > 0 && (
                      <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                        {aiInsights.length} insights
                      </span>
                    )}
                  </div>

                  {isGeneratingInsights && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center">
                      <RefreshCw className="w-5 h-5 text-purple-600 animate-spin mr-3" />
                      <div>
                        <p className="text-purple-800 font-medium">
                          Analyzing your journal...
                        </p>
                        <p className="text-purple-600 text-sm">
                          Generating personalized insights and patterns
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Insights Grid */}
                {aiInsights.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-2xl border-2 ${insight.color} shadow-sm hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start space-x-3">
                          <insight.icon className="w-6 h-6 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2 text-lg">
                              {insight.title}
                            </h3>
                            <p className="text-sm opacity-90 leading-relaxed">
                              {insight.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  !isGeneratingInsights && (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
                      <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No insights yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Generate AI insights to discover patterns and gain
                        deeper understanding of your journal entry.
                      </p>
                      <motion.button
                        onClick={() =>
                          generateAIInsights(journalContent, snippets)
                        }
                        disabled={!journalContent.trim()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all shadow-md hover:shadow-lg mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Insights</span>
                      </motion.button>
                    </div>
                  )
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Journal Entry
                  </h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{journalTitle}"? This will
                permanently remove the journal entry and all associated data.
              </p>

              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Deleting...' : 'Delete'}</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalView;
