import React from 'react';
import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white py-3 shadow-lg z-50 border-t border-t-gray-300">
      <div className="text-center text-sm">
        <span className="text-gray-500">Developed by: </span>
        <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          Siraj Abid
        </span>
      </div>
    </footer>
  );
}
