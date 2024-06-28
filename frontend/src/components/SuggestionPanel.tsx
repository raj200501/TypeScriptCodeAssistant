import React from 'react';

interface SuggestionPanelProps {
  suggestions: { suggestion: string }[];
}

function SuggestionPanel({ suggestions }: SuggestionPanelProps) {
  return (
    <div>
      <h2>Suggestions</h2>
      <ul>
        {suggestions.map((s, index) => (
          <li key={index}>{s.suggestion}</li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestionPanel;
