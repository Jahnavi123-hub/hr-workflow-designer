/** Shared type definitions for the HR Workflow Designer */

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValue {
  key: string;
  value: string;
}

export interface StartNodeData {
  label: string;
  title: string;
  metadata: KeyValue[];
  [key: string]: unknown;
}

export interface TaskNodeData {
  label: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValue[];
  [key: string]: unknown;
}

export interface ApprovalNodeData {
  label: string;
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
  [key: string]: unknown;
}

export interface AutomatedNodeData {
  label: string;
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
  [key: string]: unknown;
}

export interface EndNodeData {
  label: string;
  endMessage: string;
  summaryFlag: boolean;
  [key: string]: unknown;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
  summary: string;
}

export interface WorkflowGraph {
  nodes: Array<{
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: WorkflowNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
  }>;
}
