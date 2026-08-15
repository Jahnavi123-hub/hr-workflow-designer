import { useEffect, useState } from 'react';
import type { Node } from '@xyflow/react';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  AutomationAction,
  NodeType,
} from '../../types/workflow';
import KeyValueEditor from './KeyValueEditor';
import { getAutomations } from '../../api/mockApi';
import { NODE_TYPE_META } from '../../utils/nodeDefaults';

interface Props {
  node: Node | null;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
  onClose: () => void;
}

export default function NodeFormPanel({ node, onUpdate, onClose }: Props) {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [local, setLocal] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (node) {
      setLocal({ ...node.data });
    }
  }, [node?.id]); // re-sync when selection changes

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, []);

  if (!node) {
    return (
      <aside className="form-panel empty">
        <p>Select a node to configure it</p>
      </aside>
    );
  }

  const type = node.type as NodeType;
  const meta = NODE_TYPE_META[type];

  const update = (partial: Record<string, unknown>) => {
    const next = { ...local, ...partial };
    // keep label in sync with title for visual consistency
    if (partial.title !== undefined) {
      next.label = String(partial.title).slice(0, 24) || meta.title;
    }
    if (partial.endMessage !== undefined) {
      next.label = String(partial.endMessage).slice(0, 24) || 'End';
    }
    setLocal(next);
    onUpdate(node.id, next);
  };

  return (
    <aside className="form-panel">
      <div className="form-panel-header">
        <div>
          <span className="type-pill" style={{ background: meta.color }}>
            {meta.title}
          </span>
          <h3>Configure Node</h3>
        </div>
        <button className="btn-icon" onClick={onClose} title="Close">
          ×
        </button>
      </div>

      <div className="form-panel-body">
        {type === 'start' && (
          <>
            <div className="form-group">
              <label>Start Title *</label>
              <input
                value={(local as StartNodeData).title || ''}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="e.g. Onboarding Kick-off"
              />
            </div>
            <KeyValueEditor
              pairs={(local as StartNodeData).metadata || []}
              onChange={(metadata) => update({ metadata })}
              label="Metadata"
            />
          </>
        )}

        {type === 'task' && (
          <>
            <div className="form-group">
              <label>Title *</label>
              <input
                value={(local as TaskNodeData).title || ''}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Collect documents"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                value={(local as TaskNodeData).description || ''}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="What the assignee should do…"
              />
            </div>
            <div className="form-group">
              <label>Assignee</label>
              <input
                value={(local as TaskNodeData).assignee || ''}
                onChange={(e) => update({ assignee: e.target.value })}
                placeholder="e.g. jane.doe@company.com"
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={(local as TaskNodeData).dueDate || ''}
                onChange={(e) => update({ dueDate: e.target.value })}
              />
            </div>
            <KeyValueEditor
              pairs={(local as TaskNodeData).customFields || []}
              onChange={(customFields) => update({ customFields })}
              label="Custom Fields"
            />
          </>
        )}

        {type === 'approval' && (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                value={(local as ApprovalNodeData).title || ''}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Manager Approval"
              />
            </div>
            <div className="form-group">
              <label>Approver Role</label>
              <select
                value={(local as ApprovalNodeData).approverRole || 'Manager'}
                onChange={(e) => update({ approverRole: e.target.value })}
              >
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
                <option value="VP">VP</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Auto-approve Threshold</label>
              <input
                type="number"
                min={0}
                value={(local as ApprovalNodeData).autoApproveThreshold ?? 0}
                onChange={(e) => update({ autoApproveThreshold: Number(e.target.value) })}
              />
              <small>0 = always require manual approval</small>
            </div>
          </>
        )}

        {type === 'automated' && (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                value={(local as AutomatedNodeData).title || ''}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Send welcome email"
              />
            </div>
            <div className="form-group">
              <label>Action *</label>
              <select
                value={(local as AutomatedNodeData).actionId || ''}
                onChange={(e) => {
                  const actionId = e.target.value;
                  const action = automations.find((a) => a.id === actionId);
                  const actionParams: Record<string, string> = {};
                  action?.params.forEach((p) => {
                    actionParams[p] = (local as AutomatedNodeData).actionParams?.[p] || '';
                  });
                  update({ actionId, actionParams });
                }}
              >
                <option value="">— Select action —</option>
                {automations.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
            {(local as AutomatedNodeData).actionId &&
              automations
                .find((a) => a.id === (local as AutomatedNodeData).actionId)
                ?.params.map((param) => (
                  <div className="form-group" key={param}>
                    <label>{param}</label>
                    <input
                      value={(local as AutomatedNodeData).actionParams?.[param] || ''}
                      onChange={(e) =>
                        update({
                          actionParams: {
                            ...((local as AutomatedNodeData).actionParams || {}),
                            [param]: e.target.value,
                          },
                        })
                      }
                      placeholder={`Enter ${param}`}
                    />
                  </div>
                ))}
          </>
        )}

        {type === 'end' && (
          <>
            <div className="form-group">
              <label>End Message</label>
              <textarea
                rows={3}
                value={(local as EndNodeData).endMessage || ''}
                onChange={(e) => update({ endMessage: e.target.value })}
                placeholder="Workflow completed successfully"
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={!!(local as EndNodeData).summaryFlag}
                  onChange={(e) => update({ summaryFlag: e.target.checked })}
                />
                Generate summary report
              </label>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
