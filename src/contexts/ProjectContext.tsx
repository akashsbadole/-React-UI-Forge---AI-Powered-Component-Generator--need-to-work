import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GeneratedComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  timestamp: Date;
}

export interface ProjectState {
  components: GeneratedComponent[];
  activeComponent: GeneratedComponent | null;
  isGenerating: boolean;
  aiProvider: 'openai' | 'claude' | 'perplexity';
  apiKey: string;
}

interface ProjectContextType {
  state: ProjectState;
  addComponent: (component: GeneratedComponent) => void;
  setActiveComponent: (component: GeneratedComponent | null) => void;
  updateComponentCode: (componentId: string, newCode: string) => void;
  setIsGenerating: (loading: boolean) => void;
  setAiProvider: (provider: 'openai' | 'claude' | 'perplexity') => void;
  setApiKey: (key: string) => void;
  exportToZip: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ProjectState>({
    components: [],
    activeComponent: null,
    isGenerating: false,
    aiProvider: 'openai',
    apiKey: '',
  });

  const addComponent = (component: GeneratedComponent) => {
    setState(prev => ({
      ...prev,
      components: [...prev.components, component],
      activeComponent: component,
    }));
  };

  const setActiveComponent = (component: GeneratedComponent | null) => {
    setState(prev => ({ ...prev, activeComponent: component }));
  };

  const updateComponentCode = (componentId: string, newCode: string) => {
    setState(prev => {
      const updatedComponents = prev.components.map(comp =>
        comp.id === componentId ? { ...comp, code: newCode } : comp
      );
      const updatedActiveComponent = prev.activeComponent?.id === componentId
        ? { ...prev.activeComponent, code: newCode }
        : prev.activeComponent;
      
      return {
        ...prev,
        components: updatedComponents,
        activeComponent: updatedActiveComponent,
      };
    });
  };

  const setIsGenerating = (isGenerating: boolean) => {
    setState(prev => ({ ...prev, isGenerating }));
  };

  const setAiProvider = (aiProvider: 'openai' | 'claude' | 'perplexity') => {
    setState(prev => ({ ...prev, aiProvider }));
  };

  const setApiKey = (apiKey: string) => {
    setState(prev => ({ ...prev, apiKey }));
  };

  const exportToZip = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Add package.json
    const packageJson = {
      name: "react-ui-components",
      version: "1.0.0",
      dependencies: {
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "@types/react": "^18.3.1",
        "@types/react-dom": "^18.3.1"
      }
    };
    zip.file("package.json", JSON.stringify(packageJson, null, 2));
    
    // Add components
    const componentsFolder = zip.folder("src/components");
    state.components.forEach(component => {
      componentsFolder?.file(`${component.name}.tsx`, component.code);
    });
    
    // Add index file
    const indexContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
${state.components.map(c => `import { ${c.name} } from './components/${c.name}';`).join('\n')}

const App = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Generated Components</h1>
      ${state.components.map(c => `<${c.name} />`).join('\n      ')}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
    `;
    zip.file("src/index.tsx", indexContent);
    
    // Generate and download zip
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'react-components.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ProjectContext.Provider value={{
      state,
      addComponent,
      setActiveComponent,
      updateComponentCode,
      setIsGenerating,
      setAiProvider,
      setApiKey,
      exportToZip,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
