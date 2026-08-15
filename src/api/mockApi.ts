/**
 * Lightweight mock API layer.
 * In a real app this would be replaced by fetch / axios + MSW / JSON-server.
 */

import type { AutomationAction, SimulationResult, WorkflowGraph } from '../types/workflow';

const AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create Ticket', params: ['queue', 'priority', 'title'] },
  { id: 'notify_slack', label: 'Notify Slack Channel', params: ['channel', 'message'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
];

/** Artificial latency to feel realistic */
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(200);
  return [...AUTOMATIONS];
}

/**
 * POST /simulate – accepts full workflow graph and returns a mock step-by-step log.
 * Performs basic structural validation (missing start/end, disconnected nodes, simple cycle detection).
 */
export async function simulateWorkflow(graph: WorkflowGraph): Promise<SimulationResult> {
  await delay(600);

  const errors: string[] = [];
  const steps: SimulationResult['steps'] = [];

  const { nodes, edges } = graph;

  if (nodes.length === 0) {
    return {
      success: false,
      steps: [],
      errors: ['Workflow is empty'],
      summary: 'Nothing to simulate',
    };
  }

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) errors.push('Missing Start node');
  if (startNodes.length > 1) errors.push('Multiple Start nodes found – only one is allowed');
  if (endNodes.length === 0) errors.push('Missing End node');

  // Build adjacency list
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();
  nodes.forEach((n) => {
    outgoing.set(n.id, []);
    incoming.set(n.id, []);
  });
  edges.forEach((e) => {
    outgoing.get(e.source)?.push(e.target);
    incoming.get(e.target)?.push(e.source);
  });

  // Detect nodes with no connections (except pure start/end)
  nodes.forEach((n) => {
    const out = outgoing.get(n.id)?.length ?? 0;
    const inn = incoming.get(n.id)?.length ?? 0;
    if (n.type !== 'start' && inn === 0) {
      errors.push(`Node "${(n.data as { label?: string }).label || n.id}" has no incoming edge`);
    }
    if (n.type !== 'end' && out === 0) {
      errors.push(`Node "${(n.data as { label?: string }).label || n.id}" has no outgoing edge`);
    }
  });

  // Simple cycle detection via DFS
  const visited = new Set<string>();
  const stack = new Set<string>();
  let hasCycle = false;

  function dfs(id: string) {
    if (stack.has(id)) {
      hasCycle = true;
      return;
    }
    if (visited.has(id)) return;
    visited.add(id);
    stack.add(id);
    (outgoing.get(id) || []).forEach(dfs);
    stack.delete(id);
  }

  startNodes.forEach((s) => dfs(s.id));
  if (hasCycle) errors.push('Cycle detected in workflow');

  // Walk the graph from start (BFS) and produce a linear-ish execution log
  const queue: string[] = startNodes.map((s) => s.id);
  const seen = new Set<string>();
  let order = 0;

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);

    const node = nodes.find((n) => n.id === id);
    if (!node) continue;

    const label =
      (node.data as { title?: string; label?: string; endMessage?: string }).title ||
      (node.data as { label?: string }).label ||
      node.type;

    let message = '';
    let status: SimulationResult['steps'][0]['status'] = 'completed';

    switch (node.type) {
      case 'start':
        message = `Workflow started: ${label}`;
        break;
      case 'task':
        message = `Task assigned to "${(node.data as any).assignee || 'unassigned'}" – due ${(node.data as any).dueDate || 'N/A'}`;
        break;
      case 'approval':
        message = `Awaiting approval from role "${(node.data as any).approverRole || 'unknown'}" (auto-approve ≥ ${(node.data as any).autoApproveThreshold ?? 0})`;
        break;
      case 'automated': {
        const actionId = (node.data as any).actionId;
        const action = AUTOMATIONS.find((a) => a.id === actionId);
        message = action
          ? `Executed automation "${action.label}"`
          : `Unknown automation "${actionId}"`;
        if (!action) status = 'failed';
        break;
      }
      case 'end':
        message = (node.data as any).endMessage || 'Workflow completed';
        break;
      default:
        message = `Processed ${node.type}`;
    }

    steps.push({
      nodeId: id,
      nodeType: node.type,
      label: String(label),
      status,
      message,
      timestamp: new Date(Date.now() + order * 800).toISOString(),
    });
    order++;

    (outgoing.get(id) || []).forEach((t) => {
      if (!seen.has(t)) queue.push(t);
    });
  }

  // Nodes never reached
  nodes.forEach((n) => {
    if (!seen.has(n.id)) {
      errors.push(`Unreachable node: ${(n.data as any).label || n.id}`);
    }
  });

  const success = errors.length === 0;

  return {
    success,
    steps,
    errors,
    summary: success
      ? `Simulation finished successfully – ${steps.length} steps executed`
      : `Simulation completed with ${errors.length} validation error(s)`,
  };
}
