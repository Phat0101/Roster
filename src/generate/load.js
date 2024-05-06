const fs = require('fs');
const moment = require('moment');
const { Parser } = require('json2csv');


function loadStaffList(file) {
    let elements = fs.readFileSync(file).toString().split('\n');
    elements = elements.filter(s => s.charAt(0) !== '#'); // Ignore lines starting with '#'
    elements = elements.filter(String); // Ignore empty lines

    return elements;
}

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

            if (!currentDate.isValid() || !endDate.isValid()) {
                throw new Error(`Invalid date range in ${file}: ${element}`);
            }

            while (currentDate.isSameOrBefore(endDate)) {
                dates.push(currentDate.format('DD/MM/YYYY'));
                currentDate.add(1, 'days');
            }
        } else {
            let date = moment(element, 'DD/MM/YYYY', true); // true for strict parsing so that 31/02/2024 or 01012024 is invalid
            if (!date.isValid()) {
                throw new Error(`Invalid date in ${file}: ${element}`);
            }
            dates.push(element);
        }
    }

    return dates;
}

function loadStaffLeave(file, staffList) {
    let elements = fs.readFileSync(file).toString().split('\n');
    elements = elements.filter(String); // Ignore empty lines

    let staffLeave = [];
    for (let element of elements) {
        let [staffName, dateRange] = element.split(', ');
        if (!staffList.includes(staffName)) {
            throw new Error(`Invalid staff name in ${file}: ${staffName}`);
        }

        if (!dateRange.includes('-')) {
            throw new Error(`Invalid date range in ${file}: ${dateRange}`);
        }

        let [start, end] = dateRange.split(' - ');
        let startDate = moment(start, 'DD/MM/YYYY');
        let endDate = moment(end, 'DD/MM/YYYY');

        if (!startDate.isValid() || !endDate.isValid()) {
            throw new Error(`Invalid date range in ${file}: ${dateRange}`);
        }

        staffLeave.push({ staffName, startDate, endDate });
    }

    return staffLeave;
}

function writeToFile(roster) {
    fs.writeFileSync("roster.json", JSON.stringify(roster, null, 2));
    const csvParser = new Parser();
    const csvData = csvParser.parse(roster);
    fs.writeFileSync("roster.csv", csvData);
}

module.exports = { loadStaffList, loadFromList, loadStaffLeave, writeToFile };