import React from 'react';
import { Snippet } from '@tca/shared';

interface SnippetListProps {
  snippets: Snippet[];
  onSelect: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
}

const SnippetList: React.FC<SnippetListProps> = ({ snippets, onSelect, onDelete }) => {
  if (snippets.length === 0) {
    return <p className="panel-empty">No snippets saved yet.</p>;
  }

  return (
    <div className="snippet-list">
      {snippets.map((snippet) => (
        <div key={snippet.id} className="snippet-card">
          <div>
            <h3>{snippet.title}</h3>
            <p className="snippet-card__meta">Updated {new Date(snippet.updatedAt).toLocaleString()}</p>
          </div>
          <div className="snippet-card__actions">
            <button className="button button--secondary" onClick={() => onSelect(snippet)}>
              Open
            </button>
            <button className="button button--ghost" onClick={() => onDelete(snippet)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;
