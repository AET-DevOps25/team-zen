/**
 * Centralized mood/emoji constants for the journaling application
 * Contains all mood-related mappings used across components
 */

export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface MoodConfig {
  value: MoodValue;
  emoji: string;
  label: string;
  shortLabel: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Complete mood configuration with all styling variants
 */
export const MOOD_CONFIG: Record<MoodValue, MoodConfig> = {
  1: {
    value: 1,
    emoji: '😢',
    label: 'Very Low',
    shortLabel: 'Terrible',
    textColor: 'text-red-500',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
  },
  2: {
    value: 2,
    emoji: '😔',
    label: 'Low',
    shortLabel: 'Poor',
    textColor: 'text-orange-500',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
  },
  3: {
    value: 3,
    emoji: '😐',
    label: 'Neutral',
    shortLabel: 'Okay',
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
  },
  4: {
    value: 4,
    emoji: '😊',
    label: 'Good',
    shortLabel: 'Good',
    textColor: 'text-green-500',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  5: {
    value: 5,
    emoji: '😄',
    label: 'Excellent',
    shortLabel: 'Excellent',
    textColor: 'text-teal-500',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-300',
  },
};

/**
 * Simple emoji mapping for basic mood display
 */
export const MOOD_EMOJIS: Record<MoodValue, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '😊',
  5: '😄',
};

/**
 * Array format for components that need to iterate over moods
 */
export const MOOD_OPTIONS: Array<MoodConfig> = Object.values(MOOD_CONFIG);

/**
 * Mood labels for dropdown/select components
 */
export const MOOD_LABELS: Record<MoodValue, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent',
};

/**
 * Text color classes for mood display
 */
export const MOOD_TEXT_COLORS: Record<MoodValue, string> = {
  1: 'text-red-500',
  2: 'text-orange-500',
  3: 'text-yellow-500',
  4: 'text-green-500',
  5: 'text-teal-500',
};

/**
 * Background color classes for mood indicators
 */
export const MOOD_BG_COLORS: Record<MoodValue, string> = {
  1: 'bg-red-100',
  2: 'bg-orange-100',
  3: 'bg-yellow-100',
  4: 'bg-green-100',
  5: 'bg-teal-100',
};

/**
 * Border color classes for mood components
 */
export const MOOD_BORDER_COLORS: Record<MoodValue, string> = {
  1: 'border-red-300',
  2: 'border-orange-300',
  3: 'border-yellow-300',
  4: 'border-green-300',
  5: 'border-teal-300',
};

/**
 * Helper function to get mood emoji by value
 */
export const getMoodEmoji = (mood: MoodValue | number): string => {
  if (isNaN(mood) || mood < 1 || mood > 5) {
    return '😐'; // Default to neutral emoji for invalid mood values
  }
  const moodValue = Math.round(Math.max(1, Math.min(5, mood))) as MoodValue;
  return MOOD_EMOJIS[moodValue];
};

/**
 * Helper function to get complete mood configuration
 */
export const getMoodConfig = (mood: MoodValue): MoodConfig => MOOD_CONFIG[mood];

/**
 * Helper function to get mood label
 */
export const getMoodLabel = (mood: MoodValue): string => MOOD_LABELS[mood];

/**
 * Helper function to get text color class
 */
export const getMoodTextColor = (mood: MoodValue): string =>
  MOOD_TEXT_COLORS[mood];

/**
 * Helper function to get background color class
 */
export const getMoodBgColor = (mood: MoodValue): string => MOOD_BG_COLORS[mood];

/**
 * Helper function to get border color class
 */
export const getMoodBorderColor = (mood: MoodValue): string =>
  MOOD_BORDER_COLORS[mood];
