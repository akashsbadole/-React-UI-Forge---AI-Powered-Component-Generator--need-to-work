
import React from 'react';
import { Layout } from '../components/Layout';
import { ComponentGenerator } from '../components/ComponentGenerator';
import { CodeEditor } from '../components/CodeEditor';
import { ComponentLibrary } from '../components/ComponentLibrary';
import { ProjectProvider } from '../contexts/ProjectContext';

const Index = () => {
  return (
    <ProjectProvider>
      <Layout>
        <div className="h-full grid grid-cols-12 gap-4 p-4">
          {/* Left Panel - Generator & Library */}
          <div className="col-span-3 space-y-4">
            <ComponentGenerator />
            <ComponentLibrary />
          </div>
          
          {/* Right Panel - Code Editor & Preview */}
          <div className="col-span-9">
            <CodeEditor />
          </div>
        </div>
      </Layout>
    </ProjectProvider>
  );
};

export default Index;
