import { v4 as uuidv4 } from 'uuid';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  NodeType,
} from '../types/workflow';

export function createNodeId(type: NodeType) {
  return `${type}-${uuidv4().slice(0, 8)}`;
}

export function defaultData(type: NodeType): StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData {
  switch (type) {
    case 'start':
      return {
        label: 'Start',
        title: 'Workflow Start',
        metadata: [],
      };
    case 'task':
      return {
        label: 'Task',
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      };
    case 'approval':
      return {
        label: 'Approval',
        title: 'Approval Step',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      };
    case 'automated':
      return {
        label: 'Automated',
        title: 'Automated Action',
        actionId: '',
        actionParams: {},
      };
    case 'end':
      return {
        label: 'End',
        endMessage: 'Workflow completed successfully',
        summaryFlag: true,
      };
    default:
      return { label: 'Unknown', title: 'Unknown' } as any;
  }
}

export const NODE_TYPE_META: Record<
  NodeType,
  { title: string; color: string; description: string }
> = {
  start: {
    title: 'Start',
    color: '#10b981',
    description: 'Workflow entry point',
  },
  task: {
    title: 'Task',
    color: '#3b82f6',
    description: 'Human task (collect docs, fill form…)',
  },
  approval: {
    title: 'Approval',
    color: '#f59e0b',
    description: 'Manager / HR approval step',
  },
  automated: {
    title: 'Automated',
    color: '#8b5cf6',
    description: 'System action (email, PDF, HRIS…)',
  },
  end: {
    title: 'End',
    color: '#ef4444',
    description: 'Workflow completion',
  },
};
