import { createEvents } from 'ics';

export function generateICalendarFile(roster, staffFilter) {
  try {
    if (!staffFilter) {
      throw new Error('Please select a staff.');
    }
    const events = roster.map(item => {
      const [day, month, year] = item.Date.split("/").map(Number);
      if (item.AM === staffFilter) {
        return {
          start: [year, month, day, 9, 30],
          duration: { hours: 3 },
          title: `Roster for Morning`,
          description: `Your backup: ${item.Backup}`,
        };
      } else if (item.PM === staffFilter) {
        return {
          start: [year, month, day, 12, 30],
          duration: { hours: 3 },
          title: `Roster for Afternoon`,
          description: `Your backup: ${item.Backup}`,
        };
      } else if (item.Backup === staffFilter) {
        return {
          start: [year, month, day, 9, 30],
          duration: { hours: 6 },
          title: `Roster for Backup`,
          description: `Morning: ${item.AM}\nAfternoon: ${item.PM}`,
        };
      }
    });

    const { error, value } = createEvents(events);
    if (error) {
      console.log(error);
      return;
    }

    const eventFile = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(eventFile);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'roster.ics';
    link.click();
  } catch (error) {
    console.error('An error occurred while generating the iCalendar file:', error);
    throw error;
  }
}