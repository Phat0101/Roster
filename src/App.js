import { useState } from 'react';
import './App.css';
import Table from './components/table';
import NavBar from './components/nav';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <html>
      <body className={`App ${darkMode ? 'text-black bg-gray-800' : 'text-black bg-white'} font-sans`}>
        <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Table darkMode={darkMode} />
        </body>
    </html>

  );
}

export default App;