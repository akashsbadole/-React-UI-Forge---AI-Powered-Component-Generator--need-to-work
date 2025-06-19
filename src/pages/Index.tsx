
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
        <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-1">
          {/* Mobile/Tablet: Stacked layout, Desktop: 3-column grid */}
          
          {/* Left Panel - Enhanced Chat & Quick Generator */}
          <div className="order-1 lg:col-span-3 flex flex-col space-y-1 h-96 lg:h-full">
            <div className="flex-1 lg:h-3/4">
              <EnhancedChatInterface />
            </div>
            <div className="h-32 lg:h-1/4">
              <ComponentGenerator />
            </div>
          </div>
          
          {/* Center Panel - Advanced Code Editor */}
          <div className="order-3 lg:order-2 lg:col-span-6 h-96 lg:h-full">
            <AdvancedCodeEditor />
          </div>
          
          {/* Right Panel - Component Library */}
          <div className="order-2 lg:order-3 lg:col-span-3 h-64 lg:h-full">
            <ComponentLibrary />
          </div>
        </div>
      </EnhancedLayout>
    </ProjectProvider>
  );
};

export default Index;
