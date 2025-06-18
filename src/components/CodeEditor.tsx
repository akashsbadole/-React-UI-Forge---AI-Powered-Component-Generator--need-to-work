
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Eye, Code, Schema, FileText } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { LivePreview } from './LivePreview';
import { generateComponentSchema, generateTypeDefinitions } from '../services/schemaGenerator';
import { toast } from '@/components/ui/use-toast';

export const CodeEditor = () => {
  const [activeTab, setActiveTab] = useState('component');
  const { state, exportToZip } = useProject();

  const tabs = [
    { id: 'component', label: 'Component', icon: Code },
    { id: 'preview', label: 'Live Preview', icon: Eye },
    { id: 'schema', label: 'Schema', icon: Schema },
    { id: 'types', label: 'Types', icon: FileText },
  ];

  const currentComponent = state.activeComponent;
  const schema = currentComponent ? generateComponentSchema(currentComponent.code) : null;
  const typeDefinitions = schema ? generateTypeDefinitions(schema) : '';

  const handleCopy = async () => {
    if (!currentComponent) return;
    
    let contentToCopy = '';
    switch (activeTab) {
      case 'component':
        contentToCopy = currentComponent.code;
        break;
      case 'schema':
        contentToCopy = JSON.stringify(schema, null, 2);
        break;
      case 'types':
        contentToCopy = typeDefinitions;
        break;
      default:
        contentToCopy = currentComponent.code;
    }
    
    await navigator.clipboard.writeText(contentToCopy);
    toast({
      title: "Copied to clipboard",
      description: `${activeTab} content copied successfully`,
    });
  };

  const handleExport = async () => {
    try {
      await exportToZip();
      toast({
        title: "Export successful",
        description: "Components exported as ZIP file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export components",
        variant: "destructive",
      });
    }
  };

  if (!currentComponent) {
    return (
      <Card className="bg-slate-800 border-slate-700 h-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No component selected</p>
          <p className="text-sm">Generate a component to see it here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'component' && (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm text-slate-300 font-mono leading-relaxed">
              <code className="language-jsx">{currentComponent.code}</code>
            </pre>
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div className="h-full overflow-auto p-6">
            <LivePreview 
              code={currentComponent.code} 
              componentName={currentComponent.name}
            />
          </div>
        )}
        
        {activeTab === 'schema' && schema && (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm text-slate-300 font-mono leading-relaxed">
              <code className="language-json">{JSON.stringify(schema, null, 2)}</code>
            </pre>
          </div>
        )}
        
        {activeTab === 'types' && (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm text-slate-300 font-mono leading-relaxed">
              <code className="language-typescript">{typeDefinitions}</code>
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};
