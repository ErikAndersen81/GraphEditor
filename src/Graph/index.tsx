import React from "react";

import Node from "../Node";
import Arc from "../Arc";
import { ArcI, NodeI } from "../common";

const Graph = (props: {
  forwardRef: React.RefObject<SVGSVGElement>;
  nodes: Array<NodeI>;
  arcs: Array<ArcI>;
  handleClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}) => {
  let nodes = props.nodes.map((node: NodeI, idx: number) => (
    <Node
      key={"node_" + idx}
      idx={idx}
      x={node.x}
      y={node.y}
      balance={node.balance}
      selected={node.selected}
      handleClick={props.handleClick}
    />
  ));
  let arcs = props.arcs.map((arc: ArcI, idx: number) => (
    <Arc
      key={"node_" + idx}
      idx={idx}
      dx={arc.dx}
      dy={arc.dy}
      x={arc.x}
      y={arc.y}
      bend={arc.bend}
      label={buildArcLabel({
        cost: arc.cost,
        lower: arc.lower,
        upper: arc.upper,
        flow: arc.flow,
      })}
      directed={arc.directed}
      selected={arc.selected}
      handleClick={props.handleClick}
    />
  ));

  return (
    <div className="Graph">
      <svg
        ref={props.forwardRef}
        id={"svg_0"}
        onMouseDown={props.handleClick}
        onMouseMove={props.handleClick}
        onMouseUp={props.handleClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        height="600"
        width="600"
      >
        {nodes}
        {arcs}
      </svg>
    </div>
  );
};

const buildArcLabel = (props: {
  cost: number | null;
  lower: number | null;
  upper: number | null;
  flow: number | null;
}) => {
  let cost = <tspan className="cost">{props.cost}</tspan>;
  let lower = <tspan className="lower">{props.lower}</tspan>;
  let upper = <tspan className="upper">{props.upper}</tspan>;
  let flow = <tspan className="flow">{props.flow}</tspan>;
  return (
    <>
      {cost} {flow} {lower} {upper}
    </>
  );
};

export default Graph;
