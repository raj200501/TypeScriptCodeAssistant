import React from 'react';
import { AnalysisRun } from '@tca/shared';

interface HistoryListProps {
  runs: AnalysisRun[];
}

const HistoryList: React.FC<HistoryListProps> = ({ runs }) => {
  if (runs.length === 0) {
    return <p className="panel-empty">No analysis runs recorded yet.</p>;
  }

  return (
    <div className="history-list">
      {runs.map((run) => (
        <div key={run.id} className="history-card">
          <div>
            <h3>{run.fileName ?? 'Untitled run'}</h3>
            <p>{new Date(run.createdAt).toLocaleString()}</p>
          </div>
          <div className="history-card__summary">
            <span>Errors: {run.summary.errorCount}</span>
            <span>Warnings: {run.summary.warningCount}</span>
            <span>Info: {run.summary.infoCount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
