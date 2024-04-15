import React, { useState } from 'react';
import roster from '../generate/roster.json';

function Roster() {
  const [filter, setFilter] = useState('');

  function handleFilterChange(event) {
    setFilter(event.target.value);
  }

  function getFilteredRoster() {
    return roster.filter(item => 
      item.AM.includes(filter) || 
      item.PM.includes(filter) || 
      item.Backup.includes(filter)
    );
  }

  const staffNames = Array.from(new Set(roster.flatMap(item => [item.AM, item.PM, item.Backup])));

  return (
    <div className="p-6">
      <select value={filter} onChange={handleFilterChange} className="p-2 border rounded">
        <option value="">Select a staff</option>
        {staffNames.map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>      <table className="w-full mt-4 text-left border-collapse">
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