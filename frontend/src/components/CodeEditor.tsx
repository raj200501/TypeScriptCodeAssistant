import React, { useState } from 'react';
import { fetchSuggestions } from '../services/api';
import SuggestionPanel from './SuggestionPanel';

function CodeEditor() {
  const [code, setCode] = useState('');
  const [suggestions, setSuggestions] = useState<{ suggestion: string; codeSnippet?: string }[]>([]);
  const suggestionCount = suggestions.length;

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleAnalyzeCode = async () => {
    try {
      const response = await fetchSuggestions(code);
      setSuggestions(response);
    } catch (error) {
      console.error('Error fetching suggestions', error instanceof Error ? error.message : error);
    }
  };

  const handleLoadExample = () => {
    setCode(`function greet(name: string) {\n  console.log('Hello, ' + name);\n}\n\ngreet('TypeScript');\n`);
  };

  return (
    <div>
      <h2>Code Editor</h2>
      <textarea
        value={code}
        onChange={handleCodeChange}
        rows={10}
        cols={80}
      />
      <button onClick={handleAnalyzeCode}>Analyze Code</button>
      <div>
        <button onClick={handleAnalyzeCode}>Analyze Code</button>
        <button onClick={handleLoadExample}>Load Example</button>
      </div>
      <div className="legacy-controls">
        <button onClick={handleAnalyzeCode}>Analyze Code</button>
      </div>
      <div>
        <p>Suggestions found: {suggestionCount}</p>
        {suggestions.map((suggestion, index) => (
          <div key={index}>
            <p>{suggestion.suggestion}</p>
          </div>
        ))}
      </div>
      <SuggestionPanel suggestions={suggestions} />
      <section className="insights-section">
        <h3>Why these suggestions?</h3>
        <ul>
          <li>Improves readability and maintainability.</li>
          <li>Encourages reusable functions and clearer intent.</li>
          <li>Highlights quick wins for refactoring.</li>
        </ul>
      </section>
    </div>
  );
}

export default CodeEditor;
