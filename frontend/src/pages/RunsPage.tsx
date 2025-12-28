import React, { useEffect, useState } from 'react';
import { AnalysisRun } from '@tca/shared';
import HistoryList from '../components/HistoryList';
import { tcaClient } from '../services/tcaClient';

function RunsPage() {
  const [runs, setRuns] = useState<AnalysisRun[]>([]);

  useEffect(() => {
    const fetchRuns = async () => {
      const data = await tcaClient.listRuns();
      setRuns(data);
    };
    fetchRuns();
  }, []);

  return (
    <div className="page page--runs">
      <div className="section-header">
        <h2>Analysis History</h2>
        <p>Track recent analyses executed by the engine.</p>
      </div>
      <HistoryList runs={runs} />
    </div>
  );
}

export default RunsPage;
