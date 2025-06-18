import type { JournalEntry } from '@/components/dashboard/JournalHistory';
import type { Mood } from '@/model/snippet';

// Mock data for previous journals (enhanced with keyStrategies)
const mockJournals: Array<JournalEntry> = [
  {
    id: '1',
    date: '2024-01-10',
    title: 'A Productive Wednesday',
    content:
      "Today was incredibly productive. I managed to complete all my tasks and even had time for a walk in the park. The weather was perfect, and I felt a sense of accomplishment that I haven't felt in a while. I'm grateful for the energy I had today and the positive mindset that carried me through. Work felt manageable and I was able to focus deeply on my projects.",
    mood: 5,
    wordCount: 342,
    tags: ['work', 'gratitude', 'exercise'],
    snippetIds: ['snippet1', 'snippet2', 'snippet3', 'snippet4'],
    snippetCount: 4,
    insights: [
      'High productivity correlation with morning exercise',
      'Positive mood sustained throughout day',
    ],
    keyStrategies: [
      'Morn∏ing walk routine',
      'Task prioritization',
      'Gratitude practice',
    ],
  },
  {
    id: '2',
    date: '2024-01-09',
    title: 'Reflecting on Challenges',
    content:
      "Had a challenging day at work today. The project deadline is approaching and I'm feeling the pressure. However, I managed to break down the tasks into smaller, manageable pieces which helped reduce my anxiety. I'm learning to be more patient with myself and recognize that stress is temporary. My team was supportive and we worked together to find solutions.",
    mood: 3,
    wordCount: 287,
    tags: ['work', 'stress', 'growth'],
    snippetIds: ['snippet5', 'snippet6', 'snippet7'],
    snippetCount: 3,
    insights: [
      'Stress management techniques showing improvement',
      'Breaking tasks helps with anxiety',
    ],
    keyStrategies: [
      'Task breakdown method',
      'Team collaboration',
      'Self-compassion practice',
    ],
  },
  {
    id: '3',
    date: '2024-01-08',
    title: 'Weekend Reflections',
    content:
      "Spent a wonderful weekend with family. We went hiking and had a picnic by the lake. These moments remind me of what's truly important in life. I feel recharged and ready for the week ahead. The connection with nature and loved ones always brings me peace. My children were so happy playing by the water, and seeing their joy filled my heart.",
    mood: 5,
    wordCount: 198,
    tags: ['family', 'nature', 'gratitude'],
    snippetIds: ['snippet8', 'snippet9'],
    snippetCount: 2,
    insights: [
      'Family time significantly boosts mood',
      'Nature activities enhance wellbeing',
    ],
    keyStrategies: [
      'Family bonding activities',
      'Nature immersion',
      'Present moment awareness',
    ],
  },
  {
    id: '4',
    date: '2024-01-07',
    title: 'Learning and Growth',
    content:
      "Started reading a new book about mindfulness today. The concepts are really resonating with me, especially the idea of being present in the moment. I practiced some breathing exercises and felt more centered. I want to make this a daily habit. The author's approach to meditation is practical and accessible, making it easier to incorporate into my busy schedule.",
    mood: 4,
    wordCount: 156,
    tags: ['learning', 'mindfulness', 'habits'],
    snippetIds: ['snippet10', 'snippet11', 'snippet12'],
    snippetCount: 3,
    insights: [
      'Mindfulness practice showing positive effects',
      'Reading contributing to personal growth',
    ],
    keyStrategies: [
      'Daily reading habit',
      'Breathing exercises',
      'Mindfulness meditation',
    ],
  },
  {
    id: '5',
    date: '2024-01-06',
    title: 'Overcoming Setbacks',
    content:
      "Had a setback with my fitness goals today. Missed my workout and ate unhealthy food. Feeling disappointed in myself but trying to remember that progress isn't always linear. Tomorrow is a new day and a new opportunity to get back on track. I need to be more compassionate with myself and focus on the bigger picture of my health journey.",
    mood: 2,
    wordCount: 203,
    tags: ['fitness', 'setback', 'resilience'],
    snippetIds: ['snippet13', 'snippet14'],
    snippetCount: 2,
    insights: [
      'Self-compassion important during setbacks',
      'Resilience mindset developing',
    ],
    keyStrategies: [
      'Self-forgiveness practice',
      'Progress reframing',
      'Fresh start mindset',
    ],
  },
  {
    id: '6',
    date: '2024-01-05',
    title: 'Creative Inspiration',
    content:
      "Felt incredibly creative today. Worked on my art project and made significant progress. There's something magical about being in the flow state where time seems to disappear. I'm grateful for these moments of pure creativity and expression. The painting is coming together beautifully, and I can see my artistic skills improving with each session.",
    mood: 5,
    wordCount: 167,
    tags: ['creativity', 'art', 'flow'],
    snippetIds: ['snippet15', 'snippet16', 'snippet17'],
    snippetCount: 3,
    insights: [
      'Creative activities enhance mood significantly',
      'Flow state achieved through focused work',
    ],
    keyStrategies: [
      'Creative expression',
      'Flow state cultivation',
      'Skill development focus',
    ],
  },
];

const moodEmojis: Record<
  Mood,
  { emoji: string; label: string; color: string }
> = {
  1: { emoji: '😢', label: 'Very Low', color: 'text-red-500' },
  2: { emoji: '😔', label: 'Low', color: 'text-orange-500' },
  3: { emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  4: { emoji: '😊', label: 'Good', color: 'text-green-500' },
  5: { emoji: '😄', label: 'Excellent', color: 'text-teal-500' },
};

const months = [
  { value: 'all', label: 'All Months' },
  { value: '2024-01', label: 'January 2024' },
  { value: '2023-12', label: 'December 2023' },
  { value: '2023-11', label: 'November 2023' },
];

export { mockJournals, moodEmojis, months };
