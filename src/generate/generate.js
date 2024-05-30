#!/usr/bin/env node

const moment = require('moment');
const minimist = require('minimist');
const { loadFromList, loadStaffList, loadStaffLeave, writeToFile } = require('./load.js');

function getNextWorkingDate(d) {
  let newDate = moment(d).add(1, 'days');
  while (newDate.day() === 0 || newDate.day() === 6) {
    newDate.add(1, 'days');
  }
  return newDate;
}

function isStaffOnLeave(staffName, currentDate, staffLeave) {
  let leaves = staffLeave.filter(leave => leave.staffName === staffName);
  for (let leave of leaves) {
    if (currentDate.isBetween(leave.startDate, leave.endDate, undefined, '[]')) {
      return true;
    }
  }
  return false;
}

let args = minimist(process.argv.slice(2), {
  string: ['startdate', 'weeks', 'startstaff'],
  default: {
    startdate: moment('2024-03-18').format('YYYY-MM-DD'),
    weeks: 12,
    startstaff: ''
  }
});

let startDate = args.startdate;
let durationWeeks = args.weeks;
let staffName = args.startstaff;
let formats = ['YYYY-MM-DD', 'DD-MM-YYYY', 'DDMMYYYY', 'DD/MM/YYYY'];
if (!moment(startDate, formats, true).isValid()) {
  console.error('Invalid start date. Please enter a valid date in the format YYYY-MM-DD.');
  process.exit(1);
}

// start date has to be Monday
startDate = moment(startDate, formats, true);
if (startDate.day() !== 1) {
  console.error('Start date has to be a Monday.');
  process.exit(1);
}

if (isNaN(durationWeeks) || Number(durationWeeks) <= 0 || Number(durationWeeks) > 52) {
  console.error('Invalid duration. Please enter a number within 1-52.');
  process.exit(1);
}

let amStaffCounter = -1, pmStaffCounter = -1, backupStaffCounter = -1;
let staff = loadStaffList('staff.txt');
let staffIndex = staff.indexOf(staffName);
if (staffIndex === -1) {
  console.error('Invalid staff name. Please enter a valid staff name.');
  process.exit(1);
} else {
  amStaffCounter = staffIndex;
  pmStaffCounter = staffIndex + 4;
  backupStaffCounter = staffIndex + 8;
}

let durationDays = Number(durationWeeks) * 5;
let holidays = [...loadFromList('nswholidays.txt'), ...loadFromList('uniholidays.txt')];
let staffLeave = loadStaffLeave('staffleave.txt', staff);

console.log(startDate, 'for', durationWeeks, 'weeks');
console.log(staffLeave);
console.log(holidays.length, 'days off this year!');
console.log(staff.length, 'staff');

let dayCounter = 0, holidayFlag = false;
let nowDate = startDate;

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
    let amStaff, pmStaff, backupStaff;
    do {
      amStaff = staff[amStaffCounter % staff.length];
      amStaffCounter++;
    } while (isStaffOnLeave(amStaff, nowDate, staffLeave));

    do {
      pmStaff = staff[pmStaffCounter % staff.length];
      pmStaffCounter++;
    } while (isStaffOnLeave(pmStaff, nowDate, staffLeave));

    do {
      backupStaff = staff[backupStaffCounter % staff.length];
      backupStaffCounter++;
    } while (isStaffOnLeave(backupStaff, nowDate, staffLeave));

    roster.push({
      Month: nowDate.format('MMMM'),
      Week: week,
      Date: dmy,
      AM: amStaff,
      PM: pmStaff,
      Backup: backupStaff
    });
  }

  nowDate = getNextWorkingDate(nowDate);
  dayCounter++;
}

writeToFile(roster);


