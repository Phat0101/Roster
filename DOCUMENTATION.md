# React Frontend Rendering logic

React is a JavaScript library for building user interfaces. 

The entry point of a React application is typically a file named `index.js`. This file is responsible for rendering the root React component into a DOM element, which is often a div element with the id of `'root'` in the public `index.html` file. 

In our application, `index.js` renders the `App` component. This is done by calling the `ReactDOM.render()` function with the `App` component and the root DOM node as arguments.

The `App` component, defined in `App.js`, is the top-level component in our application. It maintains the state for the darkMode and provides a function toggleDarkMode to toggle this state. The darkMode state and toggleDarkMode function are passed down to the child components, `NavBar` and `Table`, as props.

The `NavBar` and `Table` components receive the darkMode state and toggleDarkMode function as props and use them to render their own UI and handle user interactions.

# Each component summary 
## Table Component
The `Table` component takes a darkMode prop. It uses several state variables:

- `staffFilter` and `setStaffFilter`: These are used to filter the roster by staff name.
- `monthFilter` and `setMonthFilter`: These are used to filter the roster by month.
- `isGeneratingPDF` and `setIsGeneratingPDF`: These are used to track the state of PDF generation.
- `icalErrorMessage` and `setErrorMessage`: These are used to handle errors during iCalendar file generation.

The Table component uses several functions:
- `handleStaffFilterChange`: This function updates the staffFilter state when the staff filter dropdown value changes.
- `handleMonthFilterChange`: This function updates the monthFilter state when the month filter dropdown value changes.
- `getFilteredRoster`: This function filters the roster based on the `staffFilter` and `monthFilter` states. It is used in `groupByWeek` and `handleICalendarButtonClick` functions.
- `groupByWeek`: This function groups the filtered roster by week. It is used in the component's render method to display the roster.
- `handleICalendarButtonClick`: This function generates an iCalendar file from the filtered roster when the iCalendar button is clicked. It uses the generateICalendarFile function from `utils/ical.js`.
- `handleGeneratePDFWithLoading`: This function generates PDF, when the PDF button is clicked. It uses `generatePDF()` function from `utils/pdf.js`.

## Navbar Component
The `NavBar` component takes two props: darkMode and toggleDarkMode.
- It is rendered at the top of the application, above the `Table` component
- darkMode: This prop is a boolean that determines the theme of the navigation bar.
- toggleDarkMode: This prop is a function that toggles the darkMode state in the `App` component. When the button in the navigation bar is clicked, this function is called.
- The NavBar component returns a navigation bar with a logo, a title, and a button to toggle the dark mode. The color of the navigation bar and the icon of the button depend on the darkMode prop.
- The NavBar component uses the `FiSun` and `FiMoon` icons from the `react-icons/fi` library to represent the light mode and the dark mode, respectively.

# Table component detailed logic
## Dependencies
The Table component depends on several libraries and utility functions:

- `React` and `useState`: These are used to define the component and manage its state.
- `roster.json`: This is the data source for the roster.
- `ical.js` and `pdf.js`: These utility modules provide functions to generate iCalendar and PDF files from `utils/`
- `moment`: This library is used to format dates.
- `IoCalendarSharp` and `FaFilePdf`: These are icon components from the react-icons library.

## Rendering

The `Table` component uses the `return` statement to render its UI. It first creates arrays of unique staff names and months from the roster. It then renders a `div` element that contains dropdown menus for the staff and month filters, buttons for generating iCalendar and PDF files, and a table that displays the roster grouped by week.

The table is rendered using JSX. Each row in the table corresponds to a week in the roster, and each cell in a row corresponds to a day in the week. The cell content depends on the roster data for the corresponding day.

## Styling
1. The project uses TailwindCSS and `table.css` for styling. The `darkMode` prop is used to conditionally apply different styles based on whether dark mode is enabled. For example, `the text-black bg-gray-800` classes are applied when `darkMode` is true, and the `text-black bg-white` classes are applied when `darkMode` is false. This allows the component to support both light and dark themes.

To change the color or font of the component, you can modify the Tailwind CSS classes in the component's JSX code. For example, to change the text color to red, you can replace `text-black` with `text-red-500`. To change the font, you can add a `font-` class, such as `font-serif` for a serif font. 

2. Color Coding for Different Shifts: (Morning, Afternoon, Backup). These colors are defined in the `table.css` file under the classes `.am-row`, `.pm-row`, and `.backup-row`. If you want to change the color for a specific shift, you can modify the background property in the corresponding CSS class.

3. Color Coding for Different Time Slots: The `table.js` component uses different colors for different time slots (9h30-12h30, 12h30-15h30, Backup). These colors are defined in the `table.css` file under the classes `.am-color`, `.pm-color`, and `.backup-color`. If you want to change the color for a specific time slot, you can modify the background-color property in the corresponding CSS class.

In summary for styling, there are two ways: one using traditional css file the other is using TailwindCSS, to use TailwindCSS correctly, you have to name the correct class name, you can check in [TailwindCSS](https://tailwindcss.com/docs/installation). For example:
```js
<td className={`p-2 border ${darkMode ? 'bg-gray-700 text-white' : ''}`}>Morning</td>
```
- `p-2` means 
```css
{padding: 0.5rem /* 8px */;}
```
- `border` means 
```css
{border-width: 1px;}
```
- if `darkMode` is true then the classes `'bg-gray-700 text-white'` are applied, means 
```css
{
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity));
   --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
```

# Generating Roster Logic
The `generate.js` script is responsible for generating a staff roster based on the provided parameters. It uses the `moment`, `minimist` from npm, and `load.js` modules from to accomplish this.

## Dependecies
The script imports the following modules:
- `moment`: This library is used for handling and manipulating dates.
- `minimist`: This library is used for parsing command-line arguments.
- `load.js`: This module contains functions: loadStaffList, loadFromList, loadStaffLeave, writeToFile. loadStaffList: read staff's firstname, loadFromList: load holidays list, loadStaffLeave: load staff's firstname with their long leave. writeToFile: write json and csv files for checking. 

## Input parameters
The script accepts user input through command-line arguments. The `minimist` library is used to parse these arguments. The script expects the following arguments:
- startdate: The start date for the roster. It defaults to '2024-03-18' if not provided. The date has to be Monday
- weeks: The duration of the roster in weeks. It defaults to 12 if not provided.
- startstaff: The firstname of the staff member to start the roster with. It defaults to an empty string if not provided.

Example: 
```shell
./generate.js --startdate="18/03/2024" --weeks=16 --startstaff=David
```
### Input constraints
- startdate are in following formats: 'YYYY-MM-DD', 'DD-MM-YYYY', 'DDMMYYYY', 'DD/MM/YYYY' and has to be Monday
- weeks are integer
- startstaff: correct name from `staff.txt`

## Input files format
### nswholidays.txt
This file contains dates of holidays in the format 'DD/MM/YYYY'. Each date is on a new line.

### uniholidays.txt
This file contains date ranges of holidays in the format 'DD/MM/YYYY - DD/MM/YYYY'. Each date range is on a new line.

### staff.txt
This file contains the names of the staff. Each name is on a new line and one word only.

### staffleave.txt
This file contains the names of the staff and their leave dates in the format 'Name, DD/MM/YYYY - DD/MM/YYYY'. Each entry is on a new line.

# Main Logic
The script first validates the user input. If the input is invalid, it logs an error message and exits the process.

Next, it loads the staff list and staff leave data from the respective files using the `loadStaffList` and  `loadStaffLeave` functions.

The script then generates the roster. For each day in the duration, it checks if the day is a holiday or if the staff member is on leave. If so, it marks the staff member as absent for that day. Otherwise, it assigns the staff member to the AM, PM, or Backup shift.

Finally, the script writes the generated roster to a json file and csv file using the `writeToFile` function.