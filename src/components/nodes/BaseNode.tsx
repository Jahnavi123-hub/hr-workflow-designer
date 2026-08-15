import { memo, type ReactNode } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NODE_TYPE_META } from '../../utils/nodeDefaults';
import type { NodeType } from '../../types/workflow';

interface BaseNodeProps extends NodeProps {
  type: NodeType;
  children?: ReactNode;
  selected?: boolean;
}

function BaseNodeComponent({ type, data, selected, children }: BaseNodeProps) {
  const meta = NODE_TYPE_META[type];
  const label = (data as any)?.label || meta.title;
  const title = (data as any)?.title || (data as any)?.endMessage || label;

  return (
    <div
      className={`workflow-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: meta.color }}
    >
      {type !== 'start' && (
        <Handle type="target" position={Position.Top} className="node-handle" />
      )}

      <div className="node-header" style={{ background: meta.color }}>
        <span className="node-type-badge">{meta.title}</span>
      </div>

      <div className="node-body">
        <div className="node-title">{title}</div>
        {children}
      </div>

      {type !== 'end' && (
        <Handle type="source" position={Position.Bottom} className="node-handle" />
      )}
    </div>
  );
}

export default memo(BaseNodeComponent);
