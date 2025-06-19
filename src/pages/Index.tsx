
import React from 'react';
import { EnhancedLayout } from '../components/EnhancedLayout';
import { ChatInterface } from '../components/ChatInterface';
import { CodeEditor } from '../components/CodeEditor';
import { ComponentLibrary } from '../components/ComponentLibrary';
import { ComponentGenerator } from '../components/ComponentGenerator';
import { ProjectProvider } from '../contexts/ProjectContext';

const Index = () => {
  return (
    <ProjectProvider>
      <EnhancedLayout>
        <div className="h-full grid grid-cols-12 gap-4 p-4">
          {/* Left Panel - Chat & Generator */}
          <div className="col-span-4 space-y-4">
            <div className="h-2/3">
              <ChatInterface />
            </div>
            <div className="h-1/3">
              <ComponentGenerator />
            </div>
          </div>
          
          {/* Center Panel - Code Editor */}
          <div className="col-span-5">
            <CodeEditor />
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
