import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';

const defaultCode = `// Write your JavaScript code here
function example() {
  console.log("Hello, World!");
}

example();`;

export default function CodeEditor() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  const runCode = useCallback(() => {
    setOutput('');
    const consoleLog = console.log;
    const logs = [];

    try {
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      const func = new Function(code);
      func();

      setOutput(logs.join('\n'));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      console.log = consoleLog;
    }
  }, [code]);

  return (
    <div className="h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold">JavaScript Editor</h2>
        <button
          onClick={runCode}
          disabled={!isEditorReady}
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Run Code
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="60%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          loading={<div className="p-4 text-gray-500">Loading editor...</div>}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
        <div className="h-[40%] bg-gray-900 text-white p-4 font-mono overflow-auto">
          <div className="text-sm">
            <h3 className="text-gray-400 mb-2">Output:</h3>
            <pre className="whitespace-pre-wrap">{output || 'Run your code to see the output here...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}