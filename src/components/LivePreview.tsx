
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface LivePreviewProps {
  code: string;
  componentName: string;
}

export const LivePreview = ({ code, componentName }: LivePreviewProps) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const compileComponent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a safe evaluation environment
      const wrappedCode = `
        const React = window.React;
        const { useState, useEffect, useCallback, useMemo } = React;
        
        ${code}
        
        return ${componentName};
      `;
      
      const compiledComponent = new Function('window', wrappedCode);
      const ComponentClass = compiledComponent(window);
      setComponent(() => ComponentClass);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compilation error');
      console.error('Component compilation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code && componentName) {
      compileComponent();
    }
  }, [code, componentName]);

  const handleRefresh = () => {
    compileComponent();
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-6 h-full flex items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Compiling component...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Compilation Error</span>
          </div>
          <Button
            onClick={handleRefresh}
            size="sm"
            variant="outline"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <pre className="text-sm text-red-300 bg-red-900/20 p-3 rounded border border-red-700">
          {error}
        </pre>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Preview</h3>
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="outline"
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="bg-white rounded-lg p-6 min-h-[300px]">
        <div className="prose max-w-none">
          {Component ? (
            <React.Suspense fallback={<div>Loading component...</div>}>
              <Component />
            </React.Suspense>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No component to preview
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
