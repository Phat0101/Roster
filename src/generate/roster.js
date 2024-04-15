// Alf - mucking about with roster 20220219
// 20220219 - read staff and holiday lists
// 20220220 - loop the days
// 20220221 - add week of year counter

let startDate = '2024-03-18' // yyyy-mm-dd

let durationDays = 14*5 // 14 weeks

let holidays = loadFromList( 'nswholidays.txt' )
console.log(holidays.length, 'days off this year!' )

let staff = loadFromList( 'staff.txt' )
console.log( staff.length, 'staff' )
console.log( '' )

let dayCounter = 0, staffCounter = 10, dmy = "", holidayFlag = false

let nowDate = new Date( startDate )

console.log('Week ##, Date,       AM, PM, Backup')

while (dayCounter < durationDays) {

  let week = weekOfYear( nowDate )
  dmy = datetoDDMMYYYY( nowDate )
 
  holidayFlag = holidays.includes( dmy ) // do we work this day?

  if (holidayFlag) {
    console.log( 'Week', week + ',', dmy + ', -, -, -')
  } else {
    console.log( 'Week', week + ',', dmy + ',',
    staff[  staffCounter    % staff.length ] + ',', // am
    staff[ (staffCounter+4) % staff.length ] + ',', // pm
    staff[ (staffCounter+8) % staff.length ] )      // backup
  }

  nowDate = getNextWorkingDate( nowDate )
  dayCounter++

  if (!holidayFlag) { staffCounter++ }
}

function loadFromList( file ) { // load strings from a file

  let fs = require('fs')
  let elements = fs.readFileSync( file ).toString().split('\n')
  elements = elements.filter( s => s.charAt(0) != '#' ) //  ignore comment # lines
  elements = elements.filter( String ) //  only use valid strings, rm end of file marker
  console.warn(elements)

  return elements
}

function datetoDDMMYYYY( d ) { // convert js Date to dd/mm/yyyy string

  let dd = String( d.getDate()).padStart(2,'0')
  let mm = String( d.getMonth() + 1).padStart(2,'0')
  let yyyy = d.getFullYear()

  return dd + '/' + mm + '/' + yyyy
}

function getNextWorkingDate( d ) {

  let newDate = new Date(d)
  newDate.setDate( d.getDate() + 1 )
  let dayOfWeek = newDate.getDay() // Sun=0, Mon=1, ... Sat=6

  while (dayOfWeek == 0 || dayOfWeek == 6) { // is day Sun or Sat
    newDate.setDate( newDate.getDate() + 1)
    dayOfWeek = newDate.getDay()
  }

  return newDate
}

function weekOfYear( d ) {

  let oneJan = new Date(d.getFullYear(), 0, 1)
  let week = Math.ceil((((d.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);

  return week
}
