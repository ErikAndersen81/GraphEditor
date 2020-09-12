export const nodeSize = 3;

export type balance = Array<number>;
export type flow = Array<number>;
export type upper = Array<number>;
export type lower = Array<number>;
export type cost = Array<number>;
export type nodeArcMatrix = Array<Array<number>>;

export type attribute = number | null;

export enum OperationE {
  none = "NONE",
  addNode = "ADDNODE",
  removeNode = "REMOVENODE",
  addArc = "ADDARC",
  removeArc = "REMOVEARC",
  editArc = "EDITARC",
  editNode = "EDITNODE",
}

export interface graphItem {
  idx: number;
  type: string;
}

export interface PointI {
  x: number;
  y: number;
}

export interface VectorI extends PointI {
  dx: number;
  dy: number;
}

export interface SelectableI {
  selected: boolean;
}

export interface ArcAttributesI {
  bend: number;
  cost: attribute;
  flow: attribute;
  lower: attribute;
  upper: attribute;
  directed: boolean;
}

export interface ArcI extends VectorI, ArcAttributesI, SelectableI {
  outNode: number;
  inNode: number;
}

export interface NodeI extends PointI, SelectableI {
  balance: attribute;
}

export interface network {
  b: balance;
  c: cost;
  x: flow;
  u: upper;
  l: lower;
  N: nodeArcMatrix;
}

export const isFeasible = (x: flow, l: lower, u: upper) => {
  return x.reduce(
    (acc: boolean, cur: number, i: number): boolean =>
      acc && l[i] <= x[i] && x[i] <= u[i],
    true
  );
};

export const totalCost = (x: flow, c: cost) => {
  return x.reduce(
    (acc: number, curr: number, i: number) => acc + x[i] * c[i],
    0
  );
};
