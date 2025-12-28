import React from 'react';
import { Diagnostic, QuickFix } from '@tca/shared';

interface DiagnosticsListProps {
  diagnostics: Diagnostic[];
  onSelectQuickFix: (fix: QuickFix) => void;
}

const DiagnosticsList: React.FC<DiagnosticsListProps> = ({ diagnostics, onSelectQuickFix }) => {
  if (diagnostics.length === 0) {
    return <p className="panel-empty">No diagnostics found. You're in the clear!</p>;
  }

  return (
    <div className="diagnostics-list">
      {diagnostics.map((diagnostic) => (
        <div key={diagnostic.id} className={`diagnostic diagnostic--${diagnostic.severity}`}>
          <div className="diagnostic__header">
            <span className="diagnostic__rule">{diagnostic.ruleId}</span>
            <span className="diagnostic__severity">{diagnostic.severity}</span>
          </div>
          <p className="diagnostic__message">{diagnostic.message}</p>
          <p className="diagnostic__explanation">{diagnostic.explanation}</p>
          {diagnostic.quickFixes.length > 0 && (
            <div className="diagnostic__fixes">
              {diagnostic.quickFixes.map((fix) => (
                <button
                  key={fix.id}
                  type="button"
                  className="button button--secondary"
                  onClick={() => onSelectQuickFix(fix)}
                >
                  {fix.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiagnosticsList;
