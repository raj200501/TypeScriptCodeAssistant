import React, { useMemo } from 'react';
import { QuickFix } from '@tca/shared';
import Button from '../ui/Button';

interface QuickFixPreviewProps {
  quickFix?: QuickFix;
  original: string;
  updated: string;
  onApply: () => void;
}

type DiffLine = {
  type: 'add' | 'remove' | 'same';
  content: string;
};

const buildLineDiff = (before: string, after: string): DiffLine[] => {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const dp: number[][] = Array.from({ length: beforeLines.length + 1 }, () =>
    Array(afterLines.length + 1).fill(0)
  );

  for (let i = beforeLines.length - 1; i >= 0; i -= 1) {
    for (let j = afterLines.length - 1; j >= 0; j -= 1) {
      if (beforeLines[i] === afterLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const diff: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < beforeLines.length && j < afterLines.length) {
    if (beforeLines[i] === afterLines[j]) {
      diff.push({ type: 'same', content: beforeLines[i] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      diff.push({ type: 'remove', content: beforeLines[i] });
      i += 1;
    } else {
      diff.push({ type: 'add', content: afterLines[j] });
      j += 1;
    }
  }

  while (i < beforeLines.length) {
    diff.push({ type: 'remove', content: beforeLines[i] });
    i += 1;
  }

  while (j < afterLines.length) {
    diff.push({ type: 'add', content: afterLines[j] });
    j += 1;
  }

  return diff;
};

const QuickFixPreview: React.FC<QuickFixPreviewProps> = ({ quickFix, original, updated, onApply }) => {
  const diff = useMemo(() => buildLineDiff(original, updated), [original, updated]);

  if (!quickFix) {
    return <div className="panel-empty">Select a quick fix to preview the changes.</div>;
  }

  return (
    <div className="quick-fix-preview">
      <div className="quick-fix-preview__header">
        <div>
          <h3>{quickFix.title}</h3>
          <p>{quickFix.description}</p>
        </div>
        <Button type="button" variant="primary" onClick={onApply}>
          Apply Quick Fix
        </Button>
      </div>
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
      <div className="diff-inline">
        <h4>Inline diff</h4>
        <div className="diff-inline__lines">
          {diff.map((line, index) => (
            <div key={`${line.type}-${index}`} className={`diff-line diff-line--${line.type}`}>
              <span className="diff-line__marker">
                {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : '·'}
              </span>
              <code>{line.content || ' '}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickFixPreview;
