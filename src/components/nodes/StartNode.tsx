import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { StartNodeData } from '../../types/workflow';

function StartNode(props: NodeProps) {
  const data = props.data as StartNodeData;
  return (
    <BaseNode {...props} type="start">
      {data.metadata?.length > 0 && (
        <div className="node-meta">{data.metadata.length} metadata field(s)</div>
      )}
    </BaseNode>
  );
}

export default memo(StartNode);
