
'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async () => {
    if (!file) {
      alert('Please select an Excel (.xlsx) file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err : any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h1>Upload Excel (.xlsx)</h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={uploadFile} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: 20 }}>
          ❌ {error}
        </p>
      )}

      {result && (
        <>
          <h3>Response JSON</h3>
          <pre
            style={{
              background: '#111',
              color: '#0f0',
              padding: 20,
              overflow: 'auto',
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
