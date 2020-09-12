import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Graph from "../Graph";
import {
  NodeI,
  ArcI,
  OperationE,
  ArcAttributesI,
  attribute,
  PointI,
  graphItem,
} from "../common";
import Controls from "../Controls";
import GraphContext, { GraphContextI } from "../GraphContext";

// TODO: un-nest nested functions
// TODO: move ALOT of the functions to suitable modules and import them instead

// TODO: BUG ctrl + click on empty svg chrashes
// TODO: restore basic functionality

function App() {
  const [selectedItem, setSelectedItem] = useState<graphItem | null>(null);
  const [nodes, setNodes] = useState<Array<NodeI>>([]);
  const [arcs, setArcs] = useState<Array<ArcI>>([]);
  const [offset, setOffset] = useState<PointI>({ x: 0, y: 0 });
  const graph: GraphContextI = {
    nodes: nodes,
    setNodes: setNodes,
    arcs: arcs,
    setArcs: setArcs,
    selectedItem: selectedItem,
    setSelectedItem: setSelectedItem,
  };

  const [operation, setOperation] = useState<OperationE>(OperationE.none);
  const [defaultNode, setDefaultNode] = useState<attribute>(null);
  const [defaultArc, setDefaultArc] = useState<ArcAttributesI>(initialArc);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.preventDefault();
    const { targetType, targetIdx } = getTarget(event);
    let mouseDown = event.type === "mousedown",
      mouseUp = event.type === "mouseup",
      mouseMove = event.type === "mousemove",
      click = event.type === "click";
    if (event.shiftKey) {
      if (click) {
        //delete item
        if (targetType === "node") {
          deleteNode(setArcs, setNodes, targetIdx);
          setSelectedItem(null);
        } else {
          deleteArc(setArcs, targetIdx);
        }
      }
    } else if (event.ctrlKey) {
      if (mouseDown) {
        setIsDrawing(true);
        initializeDrawArc(event);
      } else if (mouseUp) {
        endDrawArc(event);
        setIsDrawing(false);
      } else if (mouseMove) {
        drawArc(event);
      }
    } else {
      if (mouseDown && targetType !== "svg") {
        setSelectedItem({ idx: targetIdx, type: targetType });
      }
      if (mouseUp) {
        if (targetType === "node" && selectedItem) {
          markItem(setNodes, setSelectedItem, selectedItem, targetIdx, "node");
        } else if (targetType === "arc" && selectedItem) {
          markItem(setArcs, setSelectedItem, selectedItem, targetIdx, "arc");
        } else if (isDrawing) {
          endDrawArc(event);
        } else {
          addNode(event);
        }
      }
      if (mouseMove && selectedItem) {
        dragNode(event, selectedItem.idx);
      }
    }
    if (targetType !== "svg") event.stopPropagation();
  };

  const dragNode = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    nodeIdx: number
  ) => {
    if (graphRef && graphRef.current) {
      let pt = calculatePoint(graphRef.current, event.clientX, event.clientY);
      const newNode: NodeI = { ...nodes[nodeIdx], x: pt.x, y: pt.y };
      let newNodes = [...nodes];
      newNodes[nodeIdx] = newNode;
      setNodes(() => [...newNodes]);
    }
  };

  const addNode = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    let pt = calculatePoint(event.currentTarget, event.clientX, event.clientY);
    const newNode: NodeI = {
      x: pt.x,
      y: pt.y,
      selected: true,
      balance: defaultNode,
    };
    setSelectedItem({ idx: nodes.length, type: "node" });
    markSelected([...arcs], -1);
    setNodes((nodes) => markSelected([...nodes, newNode], nodes.length));
  };

  const initializeDrawArc = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    let { targetIdx } = getTarget(event);
    if (graphRef && graphRef.current) {
      let pt = calculatePoint(graphRef.current, event.clientX, event.clientY);
      const temporaryArc: ArcI = {
        dx: nodes[targetIdx].x,
        dy: nodes[targetIdx].y,
        outNode: targetIdx,
        inNode: -1,
        x: pt.x - nodes[targetIdx].x,
        y: pt.y - nodes[targetIdx].y,
        selected: false,
        ...defaultArc,
      };
      setSelectedItem({ idx: arcs.length, type: "arc" });
      setNodes(() => markSelected(nodes, -1));
      setArcs((arcs) => markSelected([...arcs, temporaryArc], arcs.length));
    }
  };

  const drawArc = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    let svg = event.currentTarget.ownerSVGElement;
    if (svg) {
      let pt = calculatePoint(svg, event.clientX, event.clientY);
      const temporaryArc: ArcI = {
        ...arcs[arcs.length - 1],
        x: pt.x - arcs[arcs.length - 1].dx,
        y: pt.y - arcs[arcs.length - 1].dy,
      };
      let newArcs = [...arcs];
      newArcs[newArcs.length - 1] = temporaryArc;
      setArcs(() => [...newArcs]);
    }
  };

  const endDrawArc = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    let { targetIdx, targetType } = getTarget(event);
    if (targetType === "node" && targetIdx !== arcs[arcs.length - 1].outNode) {
      let svg = event.currentTarget.ownerSVGElement;
      if (svg) {
        const temporaryArc: ArcI = {
          ...arcs[arcs.length - 1],
          x: nodes[targetIdx].x - arcs[arcs.length - 1].dx,
          y: nodes[targetIdx].y - arcs[arcs.length - 1].dy,
          inNode: targetIdx,
        };
        let newArcs = [...arcs];
        newArcs[newArcs.length - 1] = temporaryArc;
        setSelectedItem({ idx: arcs.length, type: "arc" });
        setNodes(() => markSelected(nodes, -1));
        setArcs(() => markSelected([...newArcs], arcs.length));
      }
    }
  };

  const graphRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleResize = () => {
      let rect = graphRef.current?.getBoundingClientRect();
      if (rect && (offset.x !== rect.x || offset.y !== rect.y)) {
        setOffset({ x: rect.x, y: rect.y });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
  });

  return (
    <div className="App">
      <h1>Graph Editor </h1>
      <GraphContext.Provider value={graph}>
        <Graph
          forwardRef={graphRef}
          nodes={nodes}
          arcs={arcs}
          handleClick={handleClick}
        />
        <Controls
          operation={operation}
          setOperation={setOperation}
          defaultArc={defaultArc}
          setDefaultArc={setDefaultArc}
          defaultNode={defaultNode}
          setDefaultNode={setDefaultNode}
        />
      </GraphContext.Provider>
    </div>
  );
}

function markItem<T>(
  setItem: React.Dispatch<React.SetStateAction<Array<T>>>,
  setSelectedItem: React.Dispatch<React.SetStateAction<graphItem | null>>,
  selectedItem: graphItem,
  itemIdx: number | null,
  itemType: string
): void {
  setItem(
    (items: Array<T>) =>
      markSelected(
        items,
        itemIdx === selectedItem.idx ? null : itemIdx
      ) as Array<T>
  );
  if (itemIdx === null) {
    setSelectedItem(null);
  } else {
    setSelectedItem({ idx: itemIdx, type: itemType });
  }
}

function markSelected<T>(items: Array<T>, idx: attribute): T[] {
  return items.map<T>((item, i) => {
    return i === idx
      ? ({ ...item, selected: true } as T)
      : ({ ...item, selected: false } as T);
  });
}

const initialArc = {
  cost: null,
  upper: null,
  lower: null,
  flow: null,
  directed: true,
  bend: 20,
};

const nonIncidentArc = (a: ArcI, nodeIdx: number): boolean => {
  return !(a.inNode === nodeIdx || a.outNode === nodeIdx);
};

const adjustInOutNode = (a: ArcI, nodeIdx: number): ArcI => {
  let outNode = a.outNode > nodeIdx ? a.outNode - 1 : a.outNode;
  let inNode = a.inNode > nodeIdx ? a.inNode - 1 : a.inNode;
  return { ...a, outNode: outNode, inNode: inNode };
};

const deleteNode = (
  setArcs: React.Dispatch<React.SetStateAction<ArcI[]>>,
  setNodes: React.Dispatch<React.SetStateAction<NodeI[]>>,
  nodeIdx: number
) => {
  setArcs((arcs) =>
    arcs
      .filter((arc) => nonIncidentArc(arc, nodeIdx))
      .map((arc) => adjustInOutNode(arc, nodeIdx))
  );
  setNodes((nodes) => nodes.filter((_node, i) => i !== nodeIdx));
};

const deleteArc = (
  setArcs: React.Dispatch<React.SetStateAction<ArcI[]>>,
  arcIdx: number
) => {
  setArcs((arcs) => arcs.filter((n, i) => i !== arcIdx));
};

const calculatePoint = (svg: SVGSVGElement, x: number, y: number) => {
  let pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(svg.getScreenCTM()?.inverse());
};

const getTarget = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
  const [targetType, idx] = event.currentTarget.id.split("_");
  let targetIdx = parseInt(idx);
  return { targetType: targetType, targetIdx: targetIdx };
};

export default App;
