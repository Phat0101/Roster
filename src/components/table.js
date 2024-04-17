import React, { useState } from 'react';
import roster from '../generate/roster.json';

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
              <td className="p-2 border">{item.AM}</td>
              <td className="p-2 border">{item.PM}</td>
              <td className="p-2 border">{item.Backup}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Roster;