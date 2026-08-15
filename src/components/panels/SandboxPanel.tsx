import { useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { simulateWorkflow } from '../../api/mockApi';
import type { SimulationResult, WorkflowGraph, NodeType } from '../../types/workflow';

interface Props {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

export default function SandboxPanel({ nodes, edges, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const run = async () => {
    setLoading(true);
    setResult(null);

    const graph: WorkflowGraph = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type as NodeType,
        position: n.position,
        data: n.data as any,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      })),
    };

    try {
      const res = await simulateWorkflow(graph);
      setResult(res);
    } catch (err) {
      setResult({
        success: false,
        steps: [],
        errors: [String(err)],
        summary: 'Simulation failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sandbox-overlay">
      <div className="sandbox-modal">
        <div className="sandbox-header">
          <h2>Workflow Sandbox</h2>
          <button className="btn-icon" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sandbox-body">
          <p className="sandbox-desc">
            Serializes the current graph and posts it to the mock <code>/simulate</code> endpoint.
            Validates structure (start/end, connectivity, cycles) and returns a step-by-step log.
          </p>

          <button className="btn primary" onClick={run} disabled={loading || nodes.length === 0}>
            {loading ? 'Running…' : '▶ Run Simulation'}
          </button>

          {result && (
            <div className="sim-result">
              <div className={`sim-summary ${result.success ? 'ok' : 'err'}`}>
                {result.summary}
              </div>

              {result.errors.length > 0 && (
                <div className="sim-errors">
                  <h4>Validation Errors</h4>
                  <ul>
                    {result.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.steps.length > 0 && (
                <div className="sim-timeline">
                  <h4>Execution Log</h4>
                  {result.steps.map((step, i) => (
                    <div key={step.nodeId} className={`sim-step status-${step.status}`}>
                      <div className="sim-step-index">{i + 1}</div>
                      <div className="sim-step-content">
                        <div className="sim-step-title">
                          <span className="sim-type">{step.nodeType}</span>
                          {step.label}
                        </div>
                        <div className="sim-step-msg">{step.message}</div>
                        <div className="sim-step-time">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
