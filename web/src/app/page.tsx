'use client';

import { useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import dynamic from 'next/dynamic';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

export default function Home() {
  const [editor] = useState(() => withReact(createEditor()));
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: 'Hello, Live Code Slide!' }],
    },
  ]);
  const [code, setCode] = useState('console.log("Hi")');
  const [output, setOutput] = useState('');

  const runCode = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        files: [{ content: code }],
      }),
    });
    const data = await res.json();
    setOutput(data.run?.stdout || '');
  };

  return (
    <main style={{ padding: 20 }}>
      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable style={{ border: '1px solid #ccc', padding: 10, minHeight: 100 }} />
      </Slate>
      <div style={{ marginTop: 20 }}>
        <CodeMirror value={code} height="200px" onChange={(val) => setCode(val)} />
      </div>
      <button onClick={runCode} style={{ marginTop: 10 }}>
        Run
      </button>
      <pre>{output}</pre>
    </main>
  );
}
