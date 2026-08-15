# HR Workflow Designer

**Tredence Analytics – Full Stack Engineering Intern Case Study**

A functional prototype of a mini HR Workflow Designer built with **React + TypeScript + React Flow**. An HR admin can visually compose, configure and simulate internal workflows (onboarding, leave approval, document verification, etc.).

---

## Quick Start

```bash
# from project root
pnpm install   # or npm install / yarn
pnpm dev       # http://localhost:5173
```

---

## Deliverables Checklist

| Requirement | Status |
|-------------|--------|
| React app (Vite + TypeScript) | ✅ |
| React Flow canvas with custom nodes | ✅ |
| 5 node types: Start, Task, Approval, Automated, End | ✅ |
| Drag-and-drop from sidebar | ✅ |
| Connect / select / delete nodes & edges | ✅ |
| Node configuration forms (dynamic per type) | ✅ |
| Mock API layer (`GET /automations`, `POST /simulate`) | ✅ |
| Workflow Test / Sandbox panel with step log | ✅ |
| Structural validation (start/end, connectivity, cycles) | ✅ |
| Clean folder structure & typed interfaces | ✅ |
| README with architecture notes | ✅ |

**Optional bonuses included:** MiniMap, snap-to-grid, Delete key support, basic single-Start constraint.

---

## Architecture

```
src/
├── api/
│   └── mockApi.ts          # Lightweight mock layer (getAutomations, simulateWorkflow)
├── components/
│   ├── nodes/              # Custom React Flow node components
│   │   ├── BaseNode.tsx    # Shared chrome (handles, header, selection)
│   │   ├── StartNode.tsx … EndNode.tsx
│   │   └── index.ts        # nodeTypes map
│   ├── forms/
│   │   ├── NodeFormPanel.tsx   # Dynamic form panel (key requirement)
│   │   └── KeyValueEditor.tsx  # Reusable key-value pairs
│   └── panels/
│       ├── NodePalette.tsx     # Drag source sidebar
│       └── SandboxPanel.tsx    # Simulation modal
├── hooks/
│   └── useWorkflow.ts      # Nodes/edges state, drop, connect, update helpers
├── types/
│   └── workflow.ts         # All shared TypeScript interfaces
├── utils/
│   └── nodeDefaults.ts     # Factory + visual metadata per node type
├── App.tsx                 # Composition root
├── main.tsx
└── index.css
```

### Design Decisions

1. **Separation of concerns**  
   Canvas logic lives in `useWorkflow`. Node rendering is isolated in `components/nodes`. Forms are completely decoupled from the canvas and receive a selected `Node` + update callback.

2. **Type-safe node data**  
   Each node type has its own interface (`StartNodeData`, `TaskNodeData`, …). The form panel narrows on `node.type` and updates only the relevant fields. Extending with a new node type requires:
   - a type definition
   - a default-data factory entry
   - a small node component
   - a form branch

3. **Mock API abstraction**  
   `mockApi.ts` mimics real HTTP endpoints with artificial latency. Swapping to a real backend (or MSW) only requires changing this module; the UI already treats it as async.

4. **Simulation & validation**  
   The sandbox serializes the full graph → posts to `simulateWorkflow` → receives a step-by-step log plus structural errors (missing start/end, disconnected nodes, cycles via DFS).

5. **Controlled forms**  
   Local state is synced when selection changes; every field update immediately propagates back to the React Flow node data so the canvas reflects changes live.

---

## How to Use

1. **Drag** a node type from the left palette onto the canvas.
2. **Connect** nodes by dragging from the bottom handle of one node to the top handle of another.
3. **Select** a node → the right panel shows its configuration form.
4. Fill in titles, assignees, actions, etc.
5. Click **Test Workflow** to run the mock simulation and inspect the execution log / validation errors.
6. Press **Delete / Backspace** (when focus is not inside an input) to remove selected nodes/edges.

---

## What Was Completed vs. Future Improvements

**Completed (core + a few bonuses)**  
- All required node types, forms, mock API, sandbox, validation  
- MiniMap, Controls, snap-to-grid, single-Start constraint  

**Would add with more time**  
- Export / Import workflow as JSON  
- Undo / Redo (history stack)  
- Visual error badges on invalid nodes  
- Auto-layout (dagre / elk)  
- Node templates & version history  
- Proper E2E tests (Playwright) and unit tests for the graph validator  

---

## Assumptions

- No authentication or persistence required (per brief).
- Only one Start node is allowed (enforced on drop).
- Automated actions come from a static mock list; parameters are free-form strings.
- Simulation is linear BFS from Start; parallel branches are still listed but not true concurrency.

---

Built as a time-boxed (4–6 h) exercise focused on architectural clarity and working functionality.
