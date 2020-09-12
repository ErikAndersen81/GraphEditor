import React from "react";
import { nodeSize, VectorI } from "../common";

interface ArcProps extends VectorI {
  label: JSX.Element;
  idx: number;
  bend: number;
  directed: boolean;
  selected: boolean;
  handleClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const controlVectors = (vec: VectorI, bend: number) => {
  let v1 = scaleVector(rotateVector(vec, bend), 0.4);
  let v2 = scaleVector(
    rotateVector(
      { dx: vec.dx + vec.x, dy: vec.dy + vec.y, x: -vec.x, y: -vec.y },
      -bend
    ),
    0.4
  );
  return { v1: v1, v2: v2 };
};

interface ArrowHeadProps extends VectorI {
  bend: number;
  selected: boolean;
}

const ArrowHead = (props: ArrowHeadProps) => {
  let [x, y] = [props.dx + props.x, props.dy + props.y];
  let unitVec: VectorI = toUnitVector(props as VectorI);
  let vec1: VectorI = scaleVector(
    rotateVector(unitVec, Math.PI - props.bend - 0.3),
    2
  );
  let vec2: VectorI = scaleVector(
    rotateVector(unitVec, Math.PI - props.bend + 0.3),
    2
  );
  const data: string = `M ${x} ${y} L ${x + vec1.x} ${
    y + vec1.y
  } M ${x} ${y} L ${x + vec2.x} ${y + vec2.y} `;
  return <path className={props.selected ? "selected" : ""} d={data} />;
};

const toUnitVector = (vec: VectorI): VectorI => {
  let len = vectorLength(vec);
  let unitVec = { dx: vec.dx, x: vec.x / len, dy: vec.dy, y: vec.y / len };
  return unitVec;
};

const vectorLength = (vec: VectorI) => {
  let len = Math.sqrt(vec.x ** 2 + vec.y ** 2);
  return len;
};

const rotateVector = (vec: VectorI, angle: number) => {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  return {
    dx: vec.dx,
    dy: vec.dy,
    x: vec.x * cos - vec.y * sin,
    y: vec.x * sin + vec.y * cos,
  };
};

const scaleVector = (vec: VectorI, scalar: number): VectorI => {
  return { dx: vec.dx, dy: vec.dy, x: vec.x * scalar, y: vec.y * scalar };
};

const vectorAngle = (vec: VectorI): number => {
  return Math.acos(vec.x / vectorLength(vec));
};

const Arc = (props: ArcProps) => {
  let radians = (props.bend * Math.PI) / 180;
  let { v1: c1, v2: c2 } = controlVectors(props as VectorI, radians);
  let angle1 = vectorAngle(c1);
  let angle2 = vectorAngle(c2);
  let sign = props.y < 0 ? -1 : 1;
  let outPoint = {
    x: props.dx + nodeSize * Math.cos(angle1),
    y: props.dy + sign * nodeSize * Math.sin(angle1),
  };
  let inPoint = {
    x: props.dx + props.x + nodeSize * Math.cos(angle2),
    y: props.dy + props.y - sign * nodeSize * Math.sin(angle2),
  };
  const data: string = `M ${outPoint.x} ${outPoint.y} C ${c1.x + c1.dx} ${
    c1.y + c1.dy
  },${c2.x + c2.dx} ${c2.y + c2.dy},${inPoint.x} ${inPoint.y}`;
  const txtPath =
    props.x >= 0
      ? data
      : `M ${inPoint.x} ${inPoint.y} 
      C ${c2.x + c2.dx} ${c2.y + c2.dy}, 
        ${c1.x + c1.dx} ${c1.y + c1.dy},
        ${outPoint.x} ${outPoint.y}`;
  return (
    <g
      className="Arc"
      id={"arc_" + props.idx}
      onMouseDown={props.handleClick}
      onMouseUp={props.handleClick}
    >
      <path
        className={props.selected ? "selected" : ""}
        d={data}
        fillOpacity={0}
      />
      <ArrowHead
        dx={outPoint.x}
        dy={outPoint.y}
        x={inPoint.x - outPoint.x}
        y={inPoint.y - outPoint.y}
        bend={radians}
        selected={props.selected}
      />
      <text dy={-1}>
        <textPath startOffset="50%" path={txtPath}>
          {props.label}
        </textPath>
      </text>
    </g>
  );
};

export default Arc;
