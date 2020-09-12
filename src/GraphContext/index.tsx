import { NodeI, ArcI, attribute, graphItem } from "../common";
import React from "react";

export type nodePair = {
  outNode: number | null;
  inNode: number | null;
};

export interface GraphContextI {
  nodes: NodeI[];
  setNodes: React.Dispatch<React.SetStateAction<NodeI[]>>;
  arcs: ArcI[];
  setArcs: React.Dispatch<React.SetStateAction<ArcI[]>>;
  selectedItem: graphItem | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<graphItem | null>>;
}

const emptyGraph: GraphContextI = {
  arcs: [],
  nodes: [],
  setArcs: () => {},
  setNodes: () => {},
  selectedItem: null,
  setSelectedItem: () => {},
};
const GraphContext = React.createContext<GraphContextI>(emptyGraph);

export default GraphContext;
