const fs = require('fs');
const moment = require('moment');
const { Parser } = require('json2csv');

function loadFromList(file) {
  let elements = fs.readFileSync(file).toString().split('\n');
  elements = elements.filter(s => s.charAt(0) !== '#');
  elements = elements.filter(String);

  let dates = [];
  for (let element of elements) {
    if (element.includes('-')) {
      let [start, end] = element.split(' - ');
      let currentDate = moment(start, 'DD/MM/YYYY');
      let endDate = moment(end, 'DD/MM/YYYY');
      while (currentDate.isSameOrBefore(endDate)) {
        dates.push(currentDate.format('DD/MM/YYYY'));
        currentDate.add(1, 'days');
      }
    } else {
      dates.push(element);
    }
  }

  return dates;
}

function getNextWorkingDate(d) {
  let newDate = moment(d).add(1, 'days');
  while (newDate.day() === 0 || newDate.day() === 6) {
    newDate.add(1, 'days');
  }
  return newDate;
}

let startDate = '2024-03-18'; // start date has to be Monday
let durationDays = 16 * 5; // test 16 weeks

let holidays = [...loadFromList('nswholidays.txt'), ...loadFromList('uniholidays.txt')];
console.log(holidays.length, 'days off this year!');

let staff = loadFromList('staff.txt');
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

fs.writeFileSync('roster.json', JSON.stringify(roster, null, 2));
const csvParser = new Parser();
const csvData = csvParser.parse(roster);
fs.writeFileSync('roster.csv', csvData);