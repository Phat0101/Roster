import React, { useState } from 'react';
import roster from '../generate/roster.json';
import './table.css';
import { createEvents } from 'ics';

function Roster() {
  const [staffFilter, setStaffFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  function handleStaffFilterChange(event) {
    setStaffFilter(event.target.value);
  }

  function handleMonthFilterChange(event) {
    setMonthFilter(event.target.value);
  }

  function getFilteredRoster() {
    return roster.filter(item =>
      (staffFilter === '' || item.AM === staffFilter || item.PM === staffFilter || item.Backup === staffFilter) &&
      (monthFilter === '' || item.Month === monthFilter)
    );
  }

  function groupByWeek(roster) {
    const weeks = {};
    roster.forEach(item => {
      if (!weeks[item.Week]) {
        weeks[item.Week] = {
          "Week": item.Week,
          "Days": Array(5).fill({ "Date": "", "AM": "", "PM": "", "Backup": "" })
        };
      }
      const dayIndex = new Date(item.Date.split("/").reverse().join("-")).getDay() - 1;
      if (dayIndex >= 0 && dayIndex < 5) { // Ensure the day is a weekday
        weeks[item.Week].Days[dayIndex] = {
          "Date": item.Date,
          "AM": item.AM,
          "PM": item.PM,
          "Backup": item.Backup
        };
      }
    });
    return Object.values(weeks);
  }

  function generateICalendarFile(roster) {
    const events = roster.map(item => {
      const [day, month, year] = item.Date.split("/").map(Number);
      if (item.AM === staffFilter) {
        return {
          start: [year, month, day, 9, 30],
          duration: { hours: 3 },
          title: `Roster for ${item.AM}`,
          description: `AM: ${item.AM}`,
        };
      } else if (item.PM === staffFilter) {
        return {
          start: [year, month, day, 12, 30],
          duration: { hours: 3 },
          title: `Roster for ${item.PM}`,
          description: `PM: ${item.PM}`,
        };
      } else if (item.Backup === staffFilter) {
        return {
          start: [year, month, day, 9, 30],
          duration: { hours: 6 },
          title: `Roster for ${item.Backup}`,
          description: `Backup: ${item.Backup}`,
        };
      }
    });

    const { error, value } = createEvents(events);
    if (error) {
      console.log(error);
      return;
    }

    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'roster.ics';
    link.click();
  }

  // Get unique staff names
  const staffNames = Array.from(new Set(roster.flatMap(item => [item.AM, item.PM, item.Backup])));
  // Get unique months
  const months = Array.from(new Set(roster.map(item => item.Month)));
  const groupedRoster = groupByWeek(getFilteredRoster());
  return (
    <div className="p-6">
      <select value={staffFilter} onChange={handleStaffFilterChange} className="p-2 border rounded">
        <option value="">Select a staff</option>
        {staffNames.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <select value={monthFilter} onChange={handleMonthFilterChange} className="p-2 border rounded ml-4">
        <option value="">Select a month</option>
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <button onClick={() => generateICalendarFile(getFilteredRoster())} className="p-2 mt-4 bg-blue-500 text-white rounded">Download iCalendar File</button>
      {groupedRoster.map((week, index) => (
        <table key={index} className="w-full mt-4 text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border w-1/6">Week {week.Week}</th>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                <th key={index} className="p-2 border w-1/6">{day} <br></br>{week.Days[index]?.Date || ''}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className='am-row'>
              <td className="p-2 border">AM</td>
              {Array(5).fill().map((_, index) => (
                <td key={index} className={`p-2 border ${week.Days[index]?.AM === staffFilter ? 'highlight' : ''}`}>{week.Days[index]?.AM || '-'}</td>
              ))}
            </tr>
            <tr className='pm-row'>
              <td className="p-2 border">PM</td>
              {Array(5).fill().map((_, index) => (
                <td key={index} className={`p-2 border ${week.Days[index]?.PM === staffFilter ? 'highlight' : ''}`}>{week.Days[index]?.PM || '-'}</td>
              ))}
            </tr>
            <tr className='backup-row'>
              <td className="p-2 border">Backup</td>
              {Array(5).fill().map((_, index) => (
                <td key={index} className={`p-2 border ${week.Days[index]?.Backup === staffFilter ? 'highlight' : ''}`}>{week.Days[index]?.Backup || '-'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
}

export default Roster;