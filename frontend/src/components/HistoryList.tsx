import React from 'react';
import { AnalysisRun } from '@tca/shared';
import Badge from '../ui/Badge';

interface HistoryListProps {
  runs: AnalysisRun[];
  onSelect?: (run: AnalysisRun) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ runs, onSelect }) => {
  if (runs.length === 0) {
    return <p className="panel-empty">No analysis runs recorded yet.</p>;
  }

  return (
    <div className="history-list">
      {runs.map((run) => (
        <button
          key={run.id}
          type="button"
          className="history-card"
          onClick={() => onSelect?.(run)}
        >
          <div>
            <h3>{run.fileName ?? 'Untitled run'}</h3>
            <p>{new Date(run.createdAt).toLocaleString()}</p>
          </div>
          <div className="history-card__summary">
            <Badge variant={run.summary.errorCount > 0 ? 'error' : 'neutral'}>
              {run.summary.errorCount} Errors
            </Badge>
            <Badge variant={run.summary.warningCount > 0 ? 'warning' : 'neutral'}>
              {run.summary.warningCount} Warnings
            </Badge>
            <Badge variant="info">{run.summary.infoCount} Info</Badge>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HistoryList;
