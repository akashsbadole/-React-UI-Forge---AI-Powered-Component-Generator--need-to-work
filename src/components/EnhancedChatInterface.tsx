
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, User, Bot, Sparkles, Code, Palette, 
  Layout, Database, Shield, Zap, Star, Lightbulb
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { getAIProvider } from '../services/aiService';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  category?: string;
}

const featureCategories = [
  { id: 'ui', label: 'UI Components', icon: Palette, color: 'bg-pink-600' },
  { id: 'layout', label: 'Layouts', icon: Layout, color: 'bg-blue-600' },
  { id: 'forms', label: 'Forms & Input', icon: Code, color: 'bg-green-600' },
  { id: 'data', label: 'Data Display', icon: Database, color: 'bg-purple-600' },
  { id: 'auth', label: 'Authentication', icon: Shield, color: 'bg-orange-600' },
  { id: 'advanced', label: 'Advanced', icon: Zap, color: 'bg-red-600' },
];

const quickPrompts = [
  { text: "Create a modern dashboard layout with sidebar", category: 'layout' },
  { text: "Build a responsive pricing table with animations", category: 'ui' },
  { text: "Generate a contact form with validation", category: 'forms' },
  { text: "Create a data table with sorting and filtering", category: 'data' },
  { text: "Build a login form with social auth buttons", category: 'auth' },
  { text: "Create a real-time chat component", category: 'advanced' },
];

export const EnhancedChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '🚀 Welcome to AI-Powered React Development!\n\nI specialize in creating high-quality, production-ready React components. I can help you build:\n\n• Modern UI components with Tailwind CSS\n• Complex layouts and responsive designs\n• Forms with validation and state management\n• Data visualization and interactive elements\n• Authentication flows and protected routes\n• Advanced features like real-time updates\n\nWhat amazing feature would you like to build today?',
      timestamp: new Date(),
      category: 'system'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state, addComponent, setIsGenerating } = useProject();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const promptToUse = customPrompt || input;
    if (!promptToUse.trim() || isLoading) return;

    if (!state.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your API key in the settings to use AI features",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: promptToUse,
      timestamp: new Date(),
      category: selectedCategory || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) {
      setInput('');
      setSelectedCategory(null);
    }
    setIsLoading(true);
    setIsGenerating(true);

    try {
      const aiProvider = getAIProvider(state.aiProvider);
      const enhancedPrompt = `Create a high-quality React TypeScript component: ${promptToUse}. 
      
      Requirements:
      - Use modern React patterns with hooks
      - Include TypeScript interfaces for props
      - Use Tailwind CSS for styling
      - Make it responsive and accessible
      - Add proper error handling
      - Include hover effects and smooth transitions
      - Follow best practices for performance
      - Add JSDoc comments for documentation
      
      Return only the complete component code.`;

      const response = await aiProvider.generateComponent(enhancedPrompt, state.apiKey);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `✨ I've created a premium-quality component for you! Here's what I included:

🎨 **Modern Design**: Clean, professional styling with Tailwind CSS
📱 **Responsive**: Works perfectly on all device sizes  
♿ **Accessible**: WCAG compliant with proper ARIA attributes
🚀 **Performance**: Optimized with React best practices
💫 **Interactive**: Smooth animations and hover effects
📝 **Documented**: Complete TypeScript interfaces and JSDoc comments

The component is now available in your code editor. You can customize it further or use it as a base for more advanced features!`,
        timestamp: new Date(),
        category: selectedCategory || undefined
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Extract component name and add to project
      const nameMatch = response.match(/(?:export\s+)?(?:const|function)\s+(\w+)/);
      const componentName = nameMatch ? nameMatch[1] : `Component${Date.now()}`;
      
      const newComponent = {
        id: `comp_${Date.now()}`,
        name: componentName,
        code: response,
        description: promptToUse,
        timestamp: new Date(),
      };
      
      addComponent(newComponent);
      
      toast({
        title: "🎉 Component Generated!",
        description: `${componentName} has been created with premium features!`,
      });
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ I encountered an error while generating your component: ${error instanceof Error ? error.message : 'Unknown error'}

Please check your API key and try again. If the issue persists, try breaking down your request into smaller, more specific requirements.`,
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

  const handleQuickPrompt = (prompt: string, category: string) => {
    setSelectedCategory(category);
    handleSend(prompt);
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
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI Feature Generator</h2>
          <Badge variant="secondary" className="bg-purple-600 text-white">
            Premium
          </Badge>
        </div>
        
        {/* Feature Categories */}
        <div className="grid grid-cols-3 gap-2">
          {featureCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
              className={`h-8 text-xs ${
                selectedCategory === category.id 
                  ? `${category.color} text-white` 
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <category.icon className="w-3 h-3 mr-1" />
              {category.label}
            </Button>
          ))}
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
                : message.type === 'system'
                ? 'bg-gradient-to-r from-green-600 to-blue-600'
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : message.type === 'system' ? (
                <Star className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`flex-1 max-w-xs sm:max-w-md ${
              message.type === 'user' ? 'text-right' : ''
            }`}>
              {message.category && (
                <Badge variant="outline" className="mb-2 text-xs bg-slate-700 border-slate-600">
                  {featureCategories.find(c => c.id === message.category)?.label}
                </Badge>
              )}
              <div className={`p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : message.type === 'system'
                  ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 text-green-100'
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-slate-400">Generating premium component...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Prompts */}
      <div className="p-3 border-t border-slate-700">
        <div className="mb-3">
          <h4 className="text-xs font-medium text-slate-400 mb-2">🔥 Popular Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.slice(0, 4).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(prompt.text, prompt.category)}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white text-xs h-8 justify-start"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                {prompt.text.substring(0, 25)}...
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Textarea
            placeholder="Describe the amazing feature you want to build..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          💡 Tip: Be specific about what you want - I'll add premium features automatically!
        </p>
      </div>
    </Card>
  );
};
