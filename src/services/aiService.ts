
export interface AIProvider {
  name: string;
  generateComponent: (prompt: string, apiKey: string) => Promise<string>;
}

export const openAIProvider: AIProvider = {
  name: 'OpenAI',
  generateComponent: async (prompt: string, apiKey: string): Promise<string> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a React component generator. Generate clean, functional React components with TypeScript. Only return the component code, no explanations. Use modern React patterns with hooks.'
          },
          {
            role: 'user',
            content: `Generate a React TypeScript component: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
};

export const claudeProvider: AIProvider = {
  name: 'Claude',
  generateComponent: async (prompt: string, apiKey: string): Promise<string> => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Generate a React TypeScript component: ${prompt}. Only return the component code, no explanations. Use modern React patterns with hooks.`
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  },
};

export const perplexityProvider: AIProvider = {
  name: 'Perplexity',
  generateComponent: async (prompt: string, apiKey: string): Promise<string> => {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a React component generator. Generate clean, functional React components with TypeScript. Only return the component code, no explanations.'
          },
          {
            role: 'user',
            content: `Generate a React TypeScript component: ${prompt}`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
};

export const getAIProvider = (provider: string): AIProvider => {
  switch (provider) {
    case 'claude':
      return claudeProvider;
    case 'perplexity':
      return perplexityProvider;
    default:
      return openAIProvider;
  }
};
