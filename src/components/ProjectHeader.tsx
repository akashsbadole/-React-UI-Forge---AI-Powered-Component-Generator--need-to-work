
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Play, Settings, Github, Globe, Menu } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { toast } from '@/components/ui/use-toast';

export const ProjectHeader = () => {
  const { state, exportToZip } = useProject();

  const handleExport = async () => {
    try {
      await exportToZip();
      toast({
        title: "Export successful",
        description: "Project exported as ZIP file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export project",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Project link copied to clipboard",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Coming soon",
      description: "Publish feature will be available soon",
    });
  };

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-3 lg:px-6">
      <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Play className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm lg:text-lg font-semibold text-white truncate">React UI Forge</h1>
            <p className="text-xs text-slate-400 hidden lg:block">AI-Powered Component Generator</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
          <span>•</span>
          <span>{state.components.length} components</span>
          {state.activeComponent && (
            <>
              <span>•</span>
              <span className="text-blue-400 truncate max-w-32">{state.activeComponent.name}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-1 lg:space-x-2">
        {/* Desktop buttons */}
        <div className="hidden lg:flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
          
          <Button 
            size="sm" 
            onClick={handlePublish}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Globe className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
        
        {/* Mobile buttons - only essential ones */}
        <div className="flex lg:hidden items-center space-x-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 px-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 px-2"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button 
            size="sm" 
            onClick={handlePublish}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-2"
          >
            <Globe className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
