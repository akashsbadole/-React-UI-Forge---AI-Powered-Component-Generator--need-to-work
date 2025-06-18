
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Image, Code2, Key, Settings } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { getAIProvider } from '../services/aiService';
import { toast } from '@/components/ui/use-toast';

export const ComponentGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { state, addComponent, setIsGenerating, setAiProvider, setApiKey } = useProject();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a component description",
        variant: "destructive",
      });
      return;
    }

    if (!state.apiKey) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: `Please enter your ${state.aiProvider.toUpperCase()} API key`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const aiProvider = getAIProvider(state.aiProvider);
      const generatedCode = await aiProvider.generateComponent(prompt, state.apiKey);
      
      // Extract component name from generated code
      const nameMatch = generatedCode.match(/(?:export\s+)?(?:const|function)\s+(\w+)/);
      const componentName = nameMatch ? nameMatch[1] : `Component${Date.now()}`;
      
      const newComponent = {
        id: `comp_${Date.now()}`,
        name: componentName,
        code: generatedCode,
        description: prompt,
        timestamp: new Date(),
      };
      
      addComponent(newComponent);
      setPrompt('');
      toast({
        title: "Component Generated",
        description: `${componentName} has been generated successfully!`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate component",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Wand2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">AI Component Generator</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-300">AI Provider</label>
            <Button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <Select value={state.aiProvider} onValueChange={setAiProvider}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="openai">OpenAI GPT-4</SelectItem>
              <SelectItem value="claude">Anthropic Claude</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
            </SelectContent>
          </Select>
          
          {showApiKeyInput && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-slate-400" />
                <label className="text-sm text-slate-300">API Key</label>
              </div>
              <Input
                type="password"
                placeholder={`Enter your ${state.aiProvider.toUpperCase()} API key`}
                value={state.apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          )}
          
          <label className="text-sm font-medium text-slate-300">Describe your component</label>
          <Textarea
            placeholder="Create a modern login form with email, password, and remember me checkbox..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
          />
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || state.isGenerating}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {state.isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Component
              </>
            )}
          </Button>
          
          <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
            <Image className="w-4 h-4 mr-2" />
            From Image
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          {['Button', 'Card', 'Form'].map((template) => (
            <Button
              key={template}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(`Create a modern ${template.toLowerCase()} component`)}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              <Code2 className="w-3 h-3 mr-1" />
              {template}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
