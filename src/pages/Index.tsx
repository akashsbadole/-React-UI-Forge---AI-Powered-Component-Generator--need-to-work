
import React from 'react';
import { EnhancedLayout } from '../components/EnhancedLayout';
import { EnhancedChatInterface } from '../components/EnhancedChatInterface';
import { AdvancedCodeEditor } from '../components/AdvancedCodeEditor';
import { ComponentLibrary } from '../components/ComponentLibrary';
import { ComponentGenerator } from '../components/ComponentGenerator';
import { ProjectProvider } from '../contexts/ProjectContext';

const Index = () => {
  return (
    <ProjectProvider>
      <EnhancedLayout>
        <div className="h-full grid grid-cols-12 gap-1">
          {/* Left Panel - Enhanced Chat & Quick Generator */}
          <div className="col-span-3 space-y-1">
            <div className="h-3/4">
              <EnhancedChatInterface />
            </div>
            <div className="h-1/4">
              <ComponentGenerator />
            </div>
          </div>
          
          {/* Center Panel - Advanced Code Editor */}
          <div className="col-span-6">
            <AdvancedCodeEditor />
          </div>
          
          {/* Right Panel - Component Library */}
          <div className="col-span-3">
            <ComponentLibrary />
          </div>
        </div>
      </EnhancedLayout>
    </ProjectProvider>
  );
};

export default Index;
