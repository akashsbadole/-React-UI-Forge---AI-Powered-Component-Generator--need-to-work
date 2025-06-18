
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Eye, Code } from 'lucide-react';

export const CodeEditor = () => {
  const [activeTab, setActiveTab] = useState('component');
  const [generatedCode] = useState(`import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" className="text-sm">
              Remember me
            </label>
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};`);

  const tabs = [
    { id: 'component', label: 'Component', icon: Code },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

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
          <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'component' ? (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm text-slate-300 font-mono leading-relaxed">
              <code className="language-jsx">{generatedCode}</code>
            </pre>
          </div>
        ) : (
          <div className="h-full overflow-auto p-6 bg-slate-50">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-lg border">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-center text-gray-900">Welcome Back</h2>
                </div>
                <div className="p-6">
                  <form className="space-y-4">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember" className="rounded" />
                      <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Sign In
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
