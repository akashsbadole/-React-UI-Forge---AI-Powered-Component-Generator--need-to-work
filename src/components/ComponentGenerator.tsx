
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Wand2, Image, Code2 } from 'lucide-react';

export const ComponentGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Wand2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">AI Component Generator</h2>
        </div>
        
        <div className="space-y-3">
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
            disabled={!prompt.trim() || isGenerating}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isGenerating ? (
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
