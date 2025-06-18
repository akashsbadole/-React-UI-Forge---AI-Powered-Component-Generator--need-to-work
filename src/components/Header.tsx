
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Play } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-white">React UI Forge</h1>
        <span className="text-sm text-slate-400">Rapid Prototyping Tool</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Play className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>
    </header>
  );
};
