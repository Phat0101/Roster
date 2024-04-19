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

  function generateICalendarFile(roster) {
    const events = roster.map(item => {
      const [day, month, year] = item.Date.split("/").map(Number);
      if (item.AM === staffFilter){
        return {
          start: [year, month, day, 9, 30],
          duration: { hours: 3 },
          title: `Roster for ${item.AM}`,
          description: `AM: ${item.AM}`,
        };
      } else if (item.PM === staffFilter){
        return {
          start: [year, month, day, 12, 30],
          duration: { hours: 3 },
          title: `Roster for ${item.PM}`,
          description: `PM: ${item.PM}`,
        };
      } else if (item.Backup === staffFilter){
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


  // generateICalendarFile(getFilteredRoster());

  // Get unique staff names
  const staffNames = Array.from(new Set(roster.flatMap(item => [item.AM, item.PM, item.Backup])));
  // Get unique months
  const months = Array.from(new Set(roster.map(item => item.Month)));

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
      <table className="w-full mt-4 text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Week</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">AM</th>
            <th className="p-2 border">PM</th>
            <th className="p-2 border">Backup</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredRoster().map((item, index) => (
            <tr key={index} className="border">
              <td className="p-2 border">{item.Month}</td>
              <td className="p-2 border">{item.Week}</td>
              <td className="p-2 border">{item.Date}</td>
              <td className={`p-2 border ${item.AM === staffFilter ? 'highlight' : ''}`}>{item.AM}</td>
              <td className={`p-2 border ${item.PM === staffFilter ? 'highlight' : ''}`}>{item.PM}</td>
              <td className={`p-2 border ${item.Backup === staffFilter ? 'highlight' : ''}`}>{item.Backup}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => generateICalendarFile(getFilteredRoster())} className="p-2 mt-4 bg-blue-500 text-white rounded">Download iCalendar File</button>    </div>
  );
}


export default Roster;