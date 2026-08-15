import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { EndNodeData } from '../../types/workflow';

function EndNode(props: NodeProps) {
  const data = props.data as EndNodeData;
  return (
    <BaseNode {...props} type="end">
      {data.summaryFlag && <div className="node-meta">📋 Generate summary</div>}
    </BaseNode>
  );
}

export default memo(EndNode);
