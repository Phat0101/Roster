import React, { useState } from 'react';
import roster from '../generate/roster.json';
import './table.css';
import { generateICalendarFile } from '../utils/ical.js'
import { generatePDF } from '../utils/pdf.js';
import moment from 'moment';
import { CalendarIcon } from 'lucide-react';
import { FaRegFilePdf } from "react-icons/fa6";


function Table({ darkMode }) {
  const [staffFilter, setStaffFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [icalErrorMessage, setErrorMessage] = useState(null);

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

  // Get current day
  const currentDay = new Intl.DateTimeFormat('au-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
  console.log(currentDay);
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-2 py-4">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className={`p-2 rounded-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            >
              <option value="">All staff</option>
              {staffNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className={`p-2 rounded-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            >
              <option value="">All months</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleICalendarButtonClick}
              className={`p-2 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition duration-150 ease-in-out`}
              title="Download iCalendar file"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleGeneratePDFWithLoading}
              className={`p-2 rounded-md ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition duration-150 ease-in-out`}
              title="Download PDF"
            >
              <FaRegFilePdf className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mb-4">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
            <span className="text-sm">9h30-12h30</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${darkMode ? 'bg-green-500' : 'bg-green-400'}`}></div>
            <span className="text-sm">12h30-15h30</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${darkMode ? 'bg-yellow-500' : 'bg-yellow-400'}`}></div>
            <span className="text-sm">Backup</span>
          </div>
        </div>
        {icalErrorMessage && <p className="text-red-500 mb-4">{icalErrorMessage}</p>}
        {isGeneratingPDF && <p className="text-green-500 mb-4">Generating PDF...</p>}
        <div id="rosterTable" className="space-y-8">
          {groupedRoster.map((week, weekIndex) => (
            <div key={weekIndex} className={`overflow-hidden rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`px-4 py-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sm:px-6`}>
                <h3 className="text-lg leading-6 font-medium">Week {week.Week}</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                      <tr>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                          <th key={index} className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                            {day}<br />
                            {week.Days[index].Date ? moment(week.Days[index].Date, 'DD/MM/YYYY').format('D MMM') : '-'}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      <tr className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                        {week.Days.map((day, dayIndex) => (
                          <td key={dayIndex} className={`px-6 py-4 ${day.Date === currentDay ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                            <div className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} ${day.AM === staffFilter ? 'font-extrabold' : ''}`}>{day.AM || '-'}</div>
                          </td>
                        ))}
                      </tr>
                      <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-white'}>
                        {week.Days.map((day, dayIndex) => (
                          <td key={dayIndex} className={`px-6 py-4 ${day.Date === currentDay ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                            <div className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'} ${day.PM === staffFilter ? 'font-extrabold' : ''}`}>{day.PM || '-'}</div>
                          </td>
                        ))}
                      </tr>
                      <tr className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                        {week.Days.map((day, dayIndex) => (
                          <td key={dayIndex} className={`px-6 py-4 ${day.Date === currentDay ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                            <div className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} ${day.Backup === staffFilter ? 'font-extrabold' : ''}`}>{day.Backup || '-'}</div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Table;