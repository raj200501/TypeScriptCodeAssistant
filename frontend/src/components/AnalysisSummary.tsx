import React from 'react';
import { AnalyzeResponse } from '@tca/shared';

interface AnalysisSummaryProps {
  summary?: AnalyzeResponse['summary'];
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ summary }) => {
  if (!summary) {
    return <p className="panel-empty">Run an analysis to see summary stats.</p>;
  }

  return (
    <div className="summary-card">
      <div>
        <h3>Analysis Summary</h3>
        <p>Errors: {summary.errorCount}</p>
        <p>Warnings: {summary.warningCount}</p>
        <p>Info: {summary.infoCount}</p>
      </div>
    </div>
  );
};

export default AnalysisSummary;
