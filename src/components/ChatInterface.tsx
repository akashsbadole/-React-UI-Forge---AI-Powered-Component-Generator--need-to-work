
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { getAIProvider } from '../services/aiService';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you generate React components, modify existing code, and build your application. What would you like to create today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state, addComponent, setIsGenerating } = useProject();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!state.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your API key in the component generator first",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsGenerating(true);

    try {
      const aiProvider = getAIProvider(state.aiProvider);
      const response = await aiProvider.generateComponent(input, state.apiKey);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I've generated a component based on your request. You can see it in the code editor on the right.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Extract component name and add to project
      const nameMatch = response.match(/(?:export\s+)?(?:const|function)\s+(\w+)/);
      const componentName = nameMatch ? nameMatch[1] : `Component${Date.now()}`;
      
      const newComponent = {
        id: `comp_${Date.now()}`,
        name: componentName,
        code: response,
        description: input,
        timestamp: new Date(),
      };
      
      addComponent(newComponent);
      
      toast({
        title: "Component Generated",
        description: `${componentName} has been created successfully!`,
      });
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate component",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' 
                ? 'bg-blue-600' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`flex-1 max-w-xs sm:max-w-md ${
              message.type === 'user' ? 'text-right' : ''
            }`}>
              <div className={`p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-slate-700 text-slate-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Describe the component you want to create..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>
  );
};
