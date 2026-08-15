import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { ApprovalNodeData } from '../../types/workflow';

function ApprovalNode(props: NodeProps) {
  const data = props.data as ApprovalNodeData;
  return (
    <BaseNode {...props} type="approval">
      {data.approverRole && <div className="node-meta">🛡️ {data.approverRole}</div>}
      {data.autoApproveThreshold > 0 && (
        <div className="node-meta">⚡ Auto ≥ {data.autoApproveThreshold}</div>
      )}
    </BaseNode>
  );
}

export default memo(ApprovalNode);
