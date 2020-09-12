import React from "react";
import { nodeSize, NodeI } from "../common";

export interface NodeProps extends NodeI {
  key: string;
  idx: number;
  handleClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const Node = (props: NodeProps) => {
  let tag = String.fromCharCode(props.idx + 97);
  let dy = props.balance ? 1.3 : 0;
  let cls = props.balance ? "splitNode" : "Node";

  return (
    <g
      className={cls}
      id={"node_" + props.idx}
      onMouseDown={props.handleClick}
      onMouseUp={props.handleClick}
      onMouseMove={props.handleClick}
      onClick={props.handleClick}
      onMouseLeave={props.handleClick}
    >
      <circle
        className={props.selected ? "selected" : ""}
        cx={props.x}
        cy={props.y}
        r={nodeSize}
      />
      <text x={props.x} y={props.y} dy={dy + 1}>
        {tag}
      </text>
      <line
        x1={props.x - nodeSize}
        x2={props.x + nodeSize}
        y1={props.y}
        y2={props.y}
      />
      <text x={props.x} y={props.y} dy={-dy + 1}>
        {props.balance ? props.balance : ""}
      </text>
    </g>
  );
};

export default Node;
