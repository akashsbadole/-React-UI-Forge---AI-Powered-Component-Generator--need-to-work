
export interface ComponentSchema {
  name: string;
  props: PropDefinition[];
  description: string;
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export const generateComponentSchema = (code: string): ComponentSchema => {
  // Extract component name
  const nameMatch = code.match(/(?:export\s+)?(?:const|function)\s+(\w+)/);
  const name = nameMatch ? nameMatch[1] : 'Component';

  // Extract props interface
  const propsMatch = code.match(/interface\s+\w*Props\s*{([^}]*)}/);
  const props: PropDefinition[] = [];

  if (propsMatch) {
    const propsContent = propsMatch[1];
    const propLines = propsContent.split('\n').filter(line => line.trim());
    
    propLines.forEach(line => {
      const propMatch = line.match(/(\w+)(\?)?:\s*([^;]+);?/);
      if (propMatch) {
        props.push({
          name: propMatch[1],
          type: propMatch[3].trim(),
          required: !propMatch[2],
          description: `${propMatch[1]} property`,
        });
      }
    });
  }

  // Extract description from comments
  const descriptionMatch = code.match(/\/\*\*(.*?)\*\//s);
  const description = descriptionMatch 
    ? descriptionMatch[1].replace(/\*/g, '').trim()
    : `A React component named ${name}`;

  return {
    name,
    props,
    description,
  };
};

export const generateTypeDefinitions = (schema: ComponentSchema): string => {
  const propsInterface = schema.props.length > 0 
    ? `interface ${schema.name}Props {
${schema.props.map(prop => 
  `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};`
).join('\n')}
}`
    : '';

  return `${propsInterface}

export declare const ${schema.name}: React.FC${schema.props.length > 0 ? `<${schema.name}Props>` : ''};`;
};
