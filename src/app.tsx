import { Select } from '@cloudflare/kumo/components/select';
import { useState } from 'react';

const ITEMS = Array.from({ length: 15 }, (_, i) => ({ label: `Option ${i + 1}`, value: `opt${i + 1}` }));

export function App() {
  const [v, setV] = useState('opt15');
  return (
    <>
      <header className="topbar">
        <strong>sticky header (z-index: 20)</strong>
      </header>
      <main style={{ padding: 24, maxWidth: 420 }}>
        <Select
          label="15 options, last one selected"
          items={ITEMS}
          value={v}
          onValueChange={(x: string | null) => setV(x ?? 'opt15')}
        />
        <p style={{ marginTop: 12, font: '13px system-ui', color: 'var(--color-kumo-text-subtle, #999)' }}>
          Open the Select. Option 15 is selected, so the popup opens upward across the header and
          its upper rows paint behind it. Remove the header's z-index in styles.css and the same
          popup renders fine.
        </p>
      </main>
    </>
  );
}
