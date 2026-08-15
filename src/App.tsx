import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './components/nodes';
import NodePalette from './components/panels/NodePalette';
import NodeFormPanel from './components/forms/NodeFormPanel';
import SandboxPanel from './components/panels/SandboxPanel';
import { useWorkflow } from './hooks/useWorkflow';

export default function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    onDragStart,
    updateNodeData,
    deleteSelected,
    reactFlowWrapper,
    setReactFlowInstance,
  } = useWorkflow();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);

  const onSelectionChange = useCallback(({ nodes: selected }: { nodes: Node[] }) => {
    setSelectedNode(selected.length === 1 ? selected[0] : null);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // avoid deleting while typing in inputs
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        deleteSelected();
        setSelectedNode(null);
      }
    },
    [deleteSelected]
  );

  return (
    <div className="app" onKeyDown={onKeyDown} tabIndex={0}>
      <header className="app-header">
        <div className="brand">
          <span className="logo">HR</span>
          <div>
            <h1>Workflow Designer</h1>
            <small>Tredence Case Study – React + React Flow</small>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn secondary" onClick={() => setShowSandbox(true)}>
            ▶ Test Workflow
          </button>
        </div>
      </header>

      <div className="workspace">
        <NodePalette onDragStart={onDragStart} />

        <div className="canvas-wrap" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            deleteKeyCode={null} // we handle delete ourselves
            multiSelectionKeyCode="Shift"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              style={{ height: 120 }}
            />
          </ReactFlow>
        </div>

        <NodeFormPanel
          node={selectedNode}
          onUpdate={updateNodeData}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      {showSandbox && (
        <SandboxPanel
          nodes={nodes}
          edges={edges}
          onClose={() => setShowSandbox(false)}
        />
      )}
    </div>
  );
}
