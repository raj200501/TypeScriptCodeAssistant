import React from 'react';
import { Snippet } from '@tca/shared';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

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
            <h3>{snippet.title || 'Untitled snippet'}</h3>
            <p className="snippet-card__meta">
              Updated {new Date(snippet.updatedAt).toLocaleString()}
            </p>
            <div className="snippet-card__tags">
              <Badge variant="info">Snippet</Badge>
              <Badge variant="neutral">{snippet.code.split('\n').length} lines</Badge>
            </div>
          </div>
          <div className="snippet-card__actions">
            <Button variant="secondary" size="sm" onClick={() => onSelect(snippet)}>
              Open
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(snippet)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;
