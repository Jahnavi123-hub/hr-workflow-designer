import type { NodeType } from '../../types/workflow';
import { NODE_TYPE_META } from '../../utils/nodeDefaults';
// NodeType is re-exported via types; NODE_TYPE_META lives in utils


const TYPES: NodeType[] = ['start', 'task', 'approval', 'automated', 'end'];

interface Props {
  onDragStart: (event: React.DragEvent, type: NodeType) => void;
}

export default function NodePalette({ onDragStart }: Props) {
  return (
    <aside className="palette">
      <h2>Nodes</h2>
      <p className="hint">Drag onto the canvas</p>
      <div className="palette-list">
        {TYPES.map((type) => {
          const meta = NODE_TYPE_META[type];
          return (
            <div
              key={type}
              className="palette-item"
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              style={{ borderLeftColor: meta.color }}
            >
              <span className="palette-dot" style={{ background: meta.color }} />
              <div>
                <strong>{meta.title}</strong>
                <small>{meta.description}</small>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
