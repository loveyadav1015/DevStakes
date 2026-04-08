import { memo } from 'react';
import type { SyllabusNode } from '../../types';

/* ──────────────────────────────────────────────────────────
   NodeConnection — SVG line between two syllabus nodes
   Recalculates in real-time during drag operations
   ────────────────────────────────────────────────────────── */

interface NodeConnectionProps {
  fromNode: SyllabusNode;
  toNode: SyllabusNode;
}

const NODE_RADIUS = 38;

function NodeConnectionComponent({ fromNode, toNode }: NodeConnectionProps) {
  // Calculate line endpoints at node centers
  const x1 = fromNode.x + NODE_RADIUS;
  const y1 = fromNode.y + NODE_RADIUS;
  const x2 = toNode.x + NODE_RADIUS;
  const y2 = toNode.y + NODE_RADIUS;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(168, 130, 255, 0.15)"
      strokeWidth={1.5}
      strokeDasharray="6 4"
      className="transition-all duration-75"
    />
  );
}

export const NodeConnectionLine = memo(NodeConnectionComponent);
