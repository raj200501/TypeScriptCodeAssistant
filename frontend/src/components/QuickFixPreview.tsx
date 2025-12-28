import React from 'react';
import { QuickFix } from '@tca/shared';

interface QuickFixPreviewProps {
  quickFix?: QuickFix;
  original: string;
  updated: string;
  onApply: () => void;
}

const QuickFixPreview: React.FC<QuickFixPreviewProps> = ({ quickFix, original, updated, onApply }) => {
  if (!quickFix) {
    return (
      <div className="panel-empty">
        Select a quick fix to preview the changes.
      </div>
    );
  }

  return (
    <div className="quick-fix-preview">
      <h3>{quickFix.title}</h3>
      <p>{quickFix.description}</p>
      <div className="diff-grid">
        <div>
          <h4>Before</h4>
          <pre>{original}</pre>
        </div>
        <div>
          <h4>After</h4>
          <pre>{updated}</pre>
        </div>
      </div>
      <button type="button" className="button button--primary" onClick={onApply}>
        Apply Quick Fix
      </button>
    </div>
  );
};

export default QuickFixPreview;
