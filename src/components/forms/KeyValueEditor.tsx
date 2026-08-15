import { useState } from 'react';
import type { KeyValue } from '../../types/workflow';

interface Props {
  pairs: KeyValue[];
  onChange: (pairs: KeyValue[]) => void;
  label?: string;
}

export default function KeyValueEditor({ pairs, onChange, label = 'Key-Value pairs' }: Props) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const add = () => {
    if (!key.trim()) return;
    onChange([...pairs, { key: key.trim(), value: value.trim() }]);
    setKey('');
    setValue('');
  };

  const remove = (idx: number) => {
    onChange(pairs.filter((_, i) => i !== idx));
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="kv-list">
        {pairs.map((p, i) => (
          <div key={i} className="kv-row">
            <span className="kv-key">{p.key}</span>
            <span className="kv-val">{p.value || '—'}</span>
            <button type="button" className="btn-icon" onClick={() => remove(i)} title="Remove">
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="kv-add">
        <input
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <input
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button type="button" className="btn secondary small" onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
}
