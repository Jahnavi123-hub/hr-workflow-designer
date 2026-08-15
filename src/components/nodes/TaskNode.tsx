import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { TaskNodeData } from '../../types/workflow';

function TaskNode(props: NodeProps) {
  const data = props.data as TaskNodeData;
  return (
    <BaseNode {...props} type="task">
      {data.assignee && <div className="node-meta">👤 {data.assignee}</div>}
      {data.dueDate && <div className="node-meta">📅 {data.dueDate}</div>}
    </BaseNode>
  );
}

export default memo(TaskNode);
