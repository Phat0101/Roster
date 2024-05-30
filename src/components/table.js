import React, { useState } from 'react';
import roster from '../generate/roster.json';
import './table.css';
import { generateICalendarFile } from '../utils/ical.js'
import { generatePDF } from '../utils/pdf.js';
import moment from 'moment';

import { IoCalendarSharp } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";


function Table({ darkMode }) {
  const [staffFilter, setStaffFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [icalErrorMessage, setErrorMessage] = useState(null);


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

  function handleICalendarButtonClick() {
    try {
      generateICalendarFile(getFilteredRoster(), staffFilter);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function handleGeneratePDFWithLoading() {
    setIsGeneratingPDF(true);
    generatePDF().finally(() => setIsGeneratingPDF(false));
  }

  // Get unique staff names
  const staffNames = Array.from(new Set(roster.flatMap(item => [item.AM, item.PM, item.Backup])));
  // Get unique months
  const months = Array.from(new Set(roster.map(item => item.Month)));
  const groupedRoster = groupByWeek(getFilteredRoster());
  return (
    <div className={`${darkMode ? 'text-black bg-gray-800' : 'text-black bg-white'} p-1 sm:p-4 md:p-6`}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <select value={staffFilter} onChange={handleStaffFilterChange} className="w-40 p-2 border-2 rounded ml-2 mt-2">
            <option value="">All staff</option>
            {staffNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <select value={monthFilter} onChange={handleMonthFilterChange} className="w-40 p-2 border-2 rounded ml-2 mt-2">
            <option value="">Select a month</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={handleICalendarButtonClick} className={`p-2 rounded mt-2 mr-2 ${darkMode ? 'bg-white text-black' : 'bg-blue-500 text-white'}`} title="Download iCalendar file">
            <IoCalendarSharp className="text-2xl" />
          </button>
          <button onClick={handleGeneratePDFWithLoading} className={`p-2 rounded mt-2 mr-2 ${darkMode ? 'bg-white text-black' : 'bg-blue-500 text-white'}`} title="Download PDF">
            <FaFilePdf className="text-2xl " />
          </button>
        </div>
      </div>
      <div className={`flex justify-end space-x-4 mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
        <div className="flex items-center">
          <div className={`py-2 px-10 shadow-md no-underline rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'am-color'}`}></div>
          <div>9h30-12h30</div>
        </div>
        <div className="flex items-center">
          <div className={`py-2 px-10 shadow-md no-underline rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'pm-color'}`}></div>
          <div>12h30-15h30</div>
        </div>
        <div className="flex items-center">
          <div className={`py-2 px-10 shadow-md no-underline rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'backup-color'}`}></div>
          <div>Backup</div>
        </div>
      </div>
      {icalErrorMessage && <p>{icalErrorMessage}</p>}
      {isGeneratingPDF ? <p>Generating PDF...</p> : null}
      <div id='rosterTable'>
        {groupedRoster.map((week, index) => (
          <table key={index} className={`w-full mt-4 text-left border-collapse shadow-md ${darkMode} ? 'bg-gray-800 text-white' : 'bg-white text-black'`}>
            <thead>
              <tr>
                <th className="p-2 border w-1/6">Week {week.Week}</th>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                  <th key={index} className="p-2 border w-1/6">
                    {day} <br></br>
                    {week.Days[index].Date ? moment(week.Days[index].Date, 'DD/MM/YYYY').format('D MMMM') : '-'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className='am-row'>
                <td className={`p-2 border ${darkMode ? 'bg-gray-700 text-white' : ''}`}>Morning</td>
                {Array(5).fill().map((_, index) => (
                  <td key={index} className={`p-2 border ${week.Days[index]?.AM === staffFilter ? 'highlight' : ''} ${darkMode ? 'bg-gray-700 text-white' : ''}`}>{week.Days[index]?.AM || '-'}</td>
                ))}
              </tr>
              <tr className='pm-row'>
                <td className={`p-2 border ${darkMode ? 'bg-gray-700 text-white' : ''}`}>Afternoon</td>
                {Array(5).fill().map((_, index) => (
                  <td key={index} className={`p-2 border ${week.Days[index]?.PM === staffFilter ? 'highlight' : ''} ${darkMode ? 'bg-gray-700 text-white' : ''}`}>{week.Days[index]?.PM || '-'}</td>
                ))}
              </tr>
              <tr className='backup-row'>
                <td className={`p-2 border ${darkMode ? 'bg-gray-700 text-white' : ''}`}>Backup</td>
                {Array(5).fill().map((_, index) => (
                  <td key={index} className={`p-2 border ${week.Days[index]?.Backup === staffFilter ? 'highlight' : ''} ${darkMode ? 'bg-gray-700 text-white' : ''}`}>{week.Days[index]?.Backup || '-'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}

export default Table;