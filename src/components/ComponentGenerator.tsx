
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Key, Wand2 } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { toast } from '@/components/ui/use-toast';

export const ComponentGenerator = () => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { state, setAiProvider, setApiKey } = useProject();

  const quickTemplates = [
    'Modern button with hover effects',
    'Responsive card component',
    'Contact form with validation',
    'Navigation menu',
    'Hero section',
    'Pricing table'
  ];

  const handleQuickGenerate = (template: string) => {
    toast({
      title: "Quick Template",
      description: `Use the chat to generate: ${template}`,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4 h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Quick Setup</h3>
          </div>
          <Button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            size="sm"
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-2 block">AI Provider</label>
            <Select value={state.aiProvider} onValueChange={setAiProvider}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                <SelectItem value="claude">Anthropic Claude</SelectItem>
                <SelectItem value="perplexity">Perplexity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showApiKeyInput && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Key className="w-3 h-3 text-slate-400" />
                <label className="text-xs text-slate-300">API Key</label>
              </div>
              <Input
                type="password"
                placeholder={`Enter ${state.aiProvider.toUpperCase()} API key`}
                value={state.apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 h-8 text-xs"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-300 mb-2 block">Quick Templates</label>
          <div className="grid grid-cols-1 gap-2">
            {quickTemplates.slice(0, 3).map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickGenerate(template)}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white text-xs h-8 justify-start"
              >
                {template}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
