
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Code, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useProject } from '../contexts/ProjectContext';

const templateComponents = [
  { name: 'Login Form', category: 'Forms', description: 'Modern login with validation' },
  { name: 'Hero Section', category: 'Layout', description: 'Eye-catching hero banner' },
  { name: 'Navigation Bar', category: 'Navigation', description: 'Responsive navbar' },
  { name: 'Card Grid', category: 'Layout', description: 'Responsive card layout' },
  { name: 'Contact Form', category: 'Forms', description: 'Contact form with fields' },
  { name: 'Pricing Table', category: 'Business', description: 'Pricing comparison table' },
];

export const ComponentLibrary = () => {
  const { state, setActiveComponent } = useProject();

  return (
    <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-3">Component Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search components..."
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {/* Generated Components */}
        {state.components.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
              Generated Components ({state.components.length})
            </h3>
            <div className="space-y-3">
              {state.components.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 rounded-lg border cursor-pointer group transition-colors ${
                    state.activeComponent?.id === component.id
                      ? 'bg-blue-900/30 border-blue-500'
                      : 'bg-slate-700 border-slate-600 hover:border-blue-500'
                  }`}
                  onClick={() => setActiveComponent(component)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {component.name}
                      </h4>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {component.description}
                      </p>
                      <div className="flex items-center text-xs text-slate-500 mt-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        {component.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                    <Code className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Template Components */}
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
            Template Components
          </h3>
          <div className="space-y-3">
            {templateComponents.map((component, index) => (
              <div
                key={index}
                className="p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-blue-500 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                      {component.name}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">{component.description}</p>
                    <span className="inline-block px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded mt-2">
                      {component.category}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-600 border-slate-500 text-white hover:bg-blue-600 hover:border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
