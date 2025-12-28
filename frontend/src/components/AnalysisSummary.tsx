import React from 'react';
import { AnalyzeResponse } from '@tca/shared';
import Badge from '../ui/Badge';

interface AnalysisSummaryProps {
  summary?: AnalyzeResponse['summary'];
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ summary }) => {
  if (!summary) {
    return <p className="panel-empty">Run an analysis to see summary stats.</p>;
  }

  return (
    <div className="summary-card">
      <div className="summary-card__row">
        <Badge variant={summary.errorCount > 0 ? 'error' : 'neutral'}>Errors</Badge>
        <span>{summary.errorCount}</span>
      </div>
      <div className="summary-card__row">
        <Badge variant={summary.warningCount > 0 ? 'warning' : 'neutral'}>Warnings</Badge>
        <span>{summary.warningCount}</span>
      </div>
      <div className="summary-card__row">
        <Badge variant={summary.infoCount > 0 ? 'info' : 'neutral'}>Info</Badge>
        <span>{summary.infoCount}</span>
      </div>
    </div>
  );
};

export default AnalysisSummary;
