import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { AutomatedNodeData } from '../../types/workflow';

function AutomatedNode(props: NodeProps) {
  const data = props.data as AutomatedNodeData;
  return (
    <BaseNode {...props} type="automated">
      {data.actionId && <div className="node-meta">⚙️ {data.actionId}</div>}
    </BaseNode>
  );
}

export default memo(AutomatedNode);
