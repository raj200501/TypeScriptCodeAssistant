import React, { useState } from 'react';
import { fetchSuggestions } from '../services/api';

function CodeEditor() {
  const [code, setCode] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleAnalyzeCode = async () => {
    try {
      const response = await fetchSuggestions(code);
      setSuggestions(response);
    } catch (error) {
      console.error('Error fetching suggestions', error);
    }
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
        {suggestions.map((suggestion, index) => (
          <div key={index}>
            <p>{suggestion.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeEditor;
