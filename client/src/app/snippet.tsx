import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Mic, Save } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { Snippet } from '@/model/snippet';
import { Button } from '@/components/ui/button';
import { useCreateSnippet } from '@/api/snippet';

const CreateSnippet = () => {
  const { user } = useUser();
  const userId = user?.id || '';
  const [content, setContent] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [tags, setTags] = useState<Array<string>>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const { mutateAsync: createSnippet, error } = useCreateSnippet();
  const navigate = useNavigate();

  const moodEmojis = [
    {
      value: 1,
      emoji: '😢',
      label: 'Very Low',
      color: 'bg-red-100 border-red-300',
    },
    {
      value: 2,
      emoji: '😔',
      label: 'Low',
      color: 'bg-orange-100 border-orange-300',
    },
    {
      value: 3,
      emoji: '😐',
      label: 'Neutral',
      color: 'bg-yellow-100 border-yellow-300',
    },
    {
      value: 4,
      emoji: '😊',
      label: 'Good',
      color: 'bg-green-100 border-green-300',
    },
    {
      value: 5,
      emoji: '😄',
      label: 'Excellent',
      color: 'bg-teal-100 border-teal-300',
    },
  ];

  const suggestedTags = [
    'work',
    'personal',
    'health',
    'relationships',
    'goals',
    'gratitude',
    'stress',
    'achievement',
  ];

  const handleSave = async () => {
    if (content.trim() && selectedMood !== null) {
      const snippet: Snippet = {
        id: Date.now(),
        content,
        mood: selectedMood,
        tags,
        userId: userId,
        timestamp: new Date().toISOString(),
      };

      // TODO: add toast or notification
      await createSnippet(snippet).catch((error) => {
        console.error('Error creating snippet:', error);
      });

      if (!error) {
        navigate({ to: '/dashboard' });
      }
    }
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate({ to: '/dashboard' })}
                variant="ghost-animated"
                size="icon"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">New Snippet</h1>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={!content.trim() || selectedMood === null}
              variant="teal-animated"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save Snippet</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Mood Selection */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              How are you feeling right now?
            </h3>
            <div className="flex flex-wrap gap-3">
              {moodEmojis.map((mood) => (
                <motion.button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-xl border-2 transition-all w-[7rem] lg:w-[9rem] ${
                    selectedMood === mood.value
                      ? `${mood.color} border-current`
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium text-gray-600">
                      {mood.label}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-lg font-semibold text-gray-800">
                  What's on your mind?
                </label>
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic className="w-4 h-4" />
                  </motion.button>
                  {/* <motion.button
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="w-4 h-4" />
                  </motion.button> */}
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, feelings, or what's happening right now..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                rows={8}
                style={{ minHeight: '200px' }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {content.length} characters
                </span>
                {isRecording && (
                  <div className="flex items-center text-red-600 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
                    Recording...
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Tags (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      tags.includes(tag)
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    #{tag}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSnippet;
