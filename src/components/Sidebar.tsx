
import React from 'react';
import { Code, Layout as LayoutIcon, Settings, Search } from 'lucide-react';

const menuItems = [
  { icon: Code, label: 'Generator', active: true },
  { icon: LayoutIcon, label: 'Components', active: false },
  { icon: Search, label: 'Library', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export const Sidebar = () => {
  return (
    <div className="w-16 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-8">
        <Code className="w-6 h-6 text-white" />
      </div>
      
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
              item.active 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
    </div>
  );
};
