export const useWeeklyMoodData = (journals: Array<any>) => {
  const getWeeklyMoodData = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return weekDays.map((day, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);
      const dateString = currentDate.toISOString().split('T')[0];

      const journalForDay = journals.find(
        (journal) => journal.date.split('T')[0] === dateString,
      );

      return {
        day,
        mood: journalForDay?.dailyMood || 0,
        hasEntry: !!journalForDay,
      };
    });
  };

  return getWeeklyMoodData();
};
