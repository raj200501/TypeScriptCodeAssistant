import React from 'react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      className="code-textarea"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default MonacoEditor;
