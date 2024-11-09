// Navbar.js
import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 w-screen fixed top-0 z-50">
      <div className="w-full flex justify-between items-center px-8">
        <div className="text-white font-bold text-xl">SOLEMATE</div>
        <div className="space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Graphics
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Reports
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
