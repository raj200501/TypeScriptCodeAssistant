import React from 'react';
import { Diagnostic, QuickFix } from '@tca/shared';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface DiagnosticsListProps {
  diagnostics: Diagnostic[];
  onSelectQuickFix: (fix: QuickFix) => void;
}

const severityVariant: Record<Diagnostic['severity'], 'info' | 'warning' | 'error'> = {
  info: 'info',
  warning: 'warning',
  error: 'error',
};

const DiagnosticsList: React.FC<DiagnosticsListProps> = ({ diagnostics, onSelectQuickFix }) => {
  if (diagnostics.length === 0) {
    return <p className="panel-empty">No diagnostics found. You're in the clear!</p>;
  }

  return (
    <div className="diagnostics-list">
      {diagnostics.map((diagnostic) => (
        <div key={diagnostic.id} className={`diagnostic diagnostic--${diagnostic.severity}`}>
          <div className="diagnostic__header">
            <div className="diagnostic__title">
              <Badge variant={severityVariant[diagnostic.severity]}>{diagnostic.severity}</Badge>
              <span>{diagnostic.ruleId}</span>
            </div>
            <span className="diagnostic__location">
              Ln {diagnostic.range.start.line + 1}, Col {diagnostic.range.start.character + 1}
            </span>
          </div>
          <p className="diagnostic__message">{diagnostic.message}</p>
          <p className="diagnostic__explanation">{diagnostic.explanation}</p>
          {diagnostic.quickFixes.length > 0 && (
            <div className="diagnostic__fixes">
              {diagnostic.quickFixes.map((fix) => (
                <Button
                  key={fix.id}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectQuickFix(fix)}
                >
                  {fix.title}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiagnosticsList;
