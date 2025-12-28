import React, { useEffect, useState } from 'react';
import { AnalysisRun } from '@tca/shared';
import HistoryList from '../components/HistoryList';
import { tcaClient } from '../services/tcaClient';
import { Badge, Card, Modal, PageHeader, Skeleton } from '../ui';

function RunsPage() {
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [activeRun, setActiveRun] = useState<AnalysisRun | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      setIsLoading(true);
      const data = await tcaClient.listRuns();
      setRuns(data);
      setIsLoading(false);
    };
    fetchRuns();
  }, []);

  return (
    <div className="page page--runs">
      <PageHeader
        title="Analysis History"
        subtitle="Track recent analyses, severities, and run metadata."
        meta={<Badge variant="neutral">{runs.length} runs</Badge>}
      />
      <Card title="Recent Runs" subtitle="Tap any run to view details and metrics.">
        {isLoading ? (
          <div className="stack-lg">
            <Skeleton height={24} />
            <Skeleton height={24} />
            <Skeleton height={24} />
          </div>
        ) : (
          <HistoryList runs={runs} onSelect={setActiveRun} />
        )}
      </Card>
      <Modal
        isOpen={Boolean(activeRun)}
        title={activeRun?.fileName ?? 'Run details'}
        description={activeRun ? new Date(activeRun.createdAt).toLocaleString() : undefined}
        onClose={() => setActiveRun(null)}
        actions={
          <div className="stack-row">
            <Badge variant={activeRun?.summary.errorCount ? 'error' : 'neutral'}>
              {activeRun?.summary.errorCount ?? 0} Errors
            </Badge>
            <Badge variant={activeRun?.summary.warningCount ? 'warning' : 'neutral'}>
              {activeRun?.summary.warningCount ?? 0} Warnings
            </Badge>
            <Badge variant="info">{activeRun?.summary.infoCount ?? 0} Info</Badge>
          </div>
        }
      >
        <div className="stack-lg">
          <p>Analysis runs capture the file name, diagnostics counts, and timestamp.</p>
          <div className="run-details">
            <div>
              <strong>File</strong>
              <span>{activeRun?.fileName ?? 'Untitled'}</span>
            </div>
            <div>
              <strong>Diagnostics</strong>
              <span>{activeRun ? activeRun.summary.errorCount + activeRun.summary.warningCount + activeRun.summary.infoCount : 0}</span>
            </div>
            <div>
              <strong>Engine</strong>
              <span>TypeScript Code Assistant</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RunsPage;
