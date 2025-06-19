
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Copy, Download, Eye, Code, Database, FileText, 
  Save, Play, Lightbulb, Wand2, MessageSquare,
  File, Folder, Plus, Search, Settings
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { LivePreview } from './LivePreview';
import { generateComponentSchema, generateTypeDefinitions } from '../services/schemaGenerator';
import { toast } from '@/components/ui/use-toast';

export const AdvancedCodeEditor = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state, exportToZip, updateComponentCode } = useProject();

  const tabs = [
    { id: 'editor', label: 'Code Editor', icon: Code },
    { id: 'preview', label: 'Live Preview', icon: Eye },
    { id: 'schema', label: 'Component Schema', icon: Database },
    { id: 'types', label: 'Type Definitions', icon: FileText },
  ];

  const currentComponent = state.activeComponent;
  const schema = currentComponent ? generateComponentSchema(currentComponent.code) : null;
  const typeDefinitions = schema ? generateTypeDefinitions(schema) : '';

  useEffect(() => {
    if (currentComponent) {
      setCodeContent(currentComponent.code);
    }
  }, [currentComponent]);

  const handleCodeChange = (value: string) => {
    setCodeContent(value);
    if (currentComponent) {
      updateComponentCode(currentComponent.id, value);
    }
  };

  const handleAiAssist = async () => {
    if (!aiPrompt.trim() || !currentComponent) return;
    
    setIsAiProcessing(true);
    try {
      // Simulate AI code assistance
      const aiSuggestion = `// AI Suggestion: ${aiPrompt}\n${codeContent}`;
      setCodeContent(aiSuggestion);
      handleCodeChange(aiSuggestion);
      setAiPrompt('');
      toast({
        title: "AI Assistant",
        description: "Code suggestion applied successfully",
      });
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to get AI assistance",
        variant: "destructive",
      });
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSave = () => {
    if (currentComponent) {
      updateComponentCode(currentComponent.id, codeContent);
      toast({
        title: "Saved",
        description: "Component code saved successfully",
      });
    }
  };

  const handleFormat = () => {
    // Basic code formatting
    const formatted = codeContent
      .replace(/;\s*}/g, ';\n}')
      .replace(/{\s*/g, '{\n  ')
      .replace(/}\s*/g, '\n}');
    setCodeContent(formatted);
    handleCodeChange(formatted);
  };

  if (!currentComponent) {
    return (
      <Card className="bg-slate-800 border-slate-700 h-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Advanced Code Editor</h3>
          <p className="text-sm mb-4">Generate a component to start coding</p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => setShowAiHelper(!showAiHelper)}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Start with AI
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Editor Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id 
                  ? 'bg-blue-600 text-white h-8 text-xs' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700 h-8 text-xs'
                }
              >
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAiHelper(!showAiHelper)}
              className={`text-slate-400 hover:text-white h-8 ${showAiHelper ? 'bg-purple-600' : ''}`}
            >
              <Lightbulb className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFormat} className="text-slate-400 hover:text-white h-8">
              <Settings className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave} className="text-slate-400 hover:text-white h-8">
              <Save className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={exportToZip} className="text-slate-400 hover:text-white h-8">
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Helper Panel */}
      {showAiHelper && (
        <div className="bg-slate-800 border-b border-slate-700 p-3">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Ask AI to help with your code..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 bg-slate-700 border border-slate-600 rounded text-white text-sm px-3 py-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAiAssist()}
            />
            <Button 
              size="sm" 
              onClick={handleAiAssist}
              disabled={isAiProcessing}
              className="bg-purple-600 hover:bg-purple-700 h-7 text-xs"
            >
              {isAiProcessing ? 'Processing...' : 'Apply'}
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'editor' && (
          <div className="h-full flex">
            {/* File Explorer */}
            <div className="w-64 bg-slate-800 border-r border-slate-700 p-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase">Explorer</h4>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-slate-300 p-1 hover:bg-slate-700 rounded cursor-pointer">
                  <Folder className="w-4 h-4 mr-2 text-blue-400" />
                  src
                </div>
                <div className="ml-4 space-y-1">
                  <div className="flex items-center text-sm text-slate-300 p-1 hover:bg-slate-700 rounded cursor-pointer">
                    <Folder className="w-4 h-4 mr-2 text-blue-400" />
                    components
                  </div>
                  {state.components.map((comp) => (
                    <div 
                      key={comp.id}
                      className={`ml-4 flex items-center text-sm p-1 rounded cursor-pointer ${
                        comp.id === currentComponent.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <File className="w-4 h-4 mr-2 text-green-400" />
                      {comp.name}.tsx
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={codeContent}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-full bg-slate-900 border-0 text-slate-300 font-mono text-sm resize-none focus:ring-0 p-4 leading-6"
                placeholder="Start coding here..."
                spellCheck={false}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div className="h-full overflow-auto p-6 bg-white">
            <LivePreview 
              code={codeContent} 
              componentName={currentComponent.name}
            />
          </div>
        )}
        
        {activeTab === 'schema' && schema && (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm text-slate-300 font-mono leading-relaxed bg-slate-900">
              <code>{JSON.stringify(schema, null, 2)}</code>
            </pre>
          </div>
        )}
        
        {activeTab === 'types' && (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm text-slate-300 font-mono leading-relaxed bg-slate-900">
              <code>{typeDefinitions}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
