#!/usr/bin/env node

const moment = require('moment');
const readlineSync = require('readline-sync');
const { loadFromList, loadStaffList, loadStaffLeave, writeToFile } = require('./load.js');

function getNextWorkingDate(d) {
  let newDate = moment(d).add(1, 'days');
  while (newDate.day() === 0 || newDate.day() === 6) {
    newDate.add(1, 'days');
  }
  return newDate;
}

// let startDate = '2024-03-18'; // start date has to be Monday
let startDate;
let durationWeeks;

while (true) {
  startDate = readlineSync.question('Enter the start date (YYYY-MM-DD): ');
  if (moment(startDate, 'YYYY-MM-DD', true).isValid()) {
    let date = moment(startDate);
    if (date.day() === 1) { break; }
    else { console.log('Start date has to be a Monday.') };
  } else {
    console.log('Invalid date. Please enter a valid date in the format YYYY-MM-DD.');
  };
}

while (true) {
  durationWeeks = readlineSync.question('Enter the duration in weeks: ');
  if (!isNaN(durationWeeks) && Number(durationWeeks) > 0) break;
  console.log('Invalid duration. Please enter a positive number.');
}

let durationDays = Number(durationWeeks) * 5;
let holidays = [...loadFromList('nswholidays.txt'), ...loadFromList('uniholidays.txt')];
let staff = loadStaffList('staff.txt');
let staffLeave = loadStaffLeave('staffleave.txt', staff);

console.log(staffLeave);
console.log(holidays.length, 'days off this year!');
console.log(staff.length, 'staff');

let dayCounter = 0, staffCounter = 10, holidayFlag = false;
let nowDate = moment(startDate);

let roster = [];

while (dayCounter < durationDays) {
  let week = nowDate.week();
  let dmy = nowDate.format('DD/MM/YYYY');
  holidayFlag = holidays.includes(dmy);

  if (holidayFlag) {
    roster.push({
      Month: nowDate.format('MMMM'),
      Week: week,
      Date: dmy,
      AM: '-',
      PM: '-',
      Backup: '-'
    });
  } else {
    roster.push({
      Month: nowDate.format('MMMM'),
      Week: week,
      Date: dmy,
      AM: staff[staffCounter % staff.length],
      PM: staff[(staffCounter + 4) % staff.length],
      Backup: staff[(staffCounter + 8) % staff.length]
    });
  }

  nowDate = getNextWorkingDate(nowDate);
  dayCounter++;

  if (!holidayFlag) { staffCounter++; }
}

writeToFile(roster);


