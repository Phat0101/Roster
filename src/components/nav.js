import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

function NavBar({ darkMode, toggleDarkMode }) {
  return (
    <nav className={`flex justify-between items-center shadow-md h-14
    ${darkMode ? 'bg-gray-700 text-white' : 'bg-stone-100 text-black'}`}>
        <div className='flex items-center'>
        <img src={process.env.PUBLIC_URL+"/logo.png"} alt="WSU logo" className="h-14 rounded-br-lg" />
        <h1 className="text-2xl font-bold ml-2">IT Staff Roster</h1>
        </div>
      <button onClick={toggleDarkMode} className="p-5">
        {darkMode ? 
        <FiSun className="text-yellow-500 text-2xl hover:bg-neutral-700 rounded-lg"/> : 
        <FiMoon className="text-gray-500 text-2xl hover:bg-neutral-200 rounded-lg"/>}
      </button>
    </nav>
  );
}

export default NavBar;