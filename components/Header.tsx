
import React from 'react';
import { LeafIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-green-600 text-white p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LeafIcon className="w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-tight">Green Machine</h1>
        </div>
        <p className="text-sm opacity-90 hidden sm:block">Optimize Your Energy Use</p>
      </div>
    </header>
  );
};

export default Header;
    