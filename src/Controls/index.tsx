import React from "react";
import ArcController from "../ArcController";
import OperationController from "../OperationController";
import { OperationE, ArcAttributesI, attribute } from "../common";
import NodeController from "../NodeController";

export interface ControlsProps {
  operation: OperationE;
  setOperation: React.Dispatch<React.SetStateAction<OperationE>>;
  defaultArc: ArcAttributesI;
  setDefaultArc: React.Dispatch<React.SetStateAction<ArcAttributesI>>;
  defaultNode: attribute;
  setDefaultNode: React.Dispatch<React.SetStateAction<attribute>>;
}

const Controls = (props: ControlsProps) => {
  return (
    <div className="Controls">
      {null && (
        <OperationController
          operation={props.operation}
          setOperation={props.setOperation}
        />
      )}
      <ArcController
        defaultArc={props.defaultArc}
        setDefaultArc={props.setDefaultArc}
      />
      <NodeController
        defaultNode={props.defaultNode}
        setDefaultNode={props.setDefaultNode}
      />
      <div>
        <h3>How to:</h3>
        <p>Click to add Nodes.</p>
        <p>Select/deselect a single node or arc by clicking it.</p>
        <p>
          Clicking a node while holding down ctrl will draw an arc from the
          selected node to the clicked node.
        </p>
        <p>Shift+click on a node/arc will delete it. </p>
        <p>
          Attributes of nodes/arcs can manipulated by selecting them and using
          Arc Control/Node Control.
        </p>
      </div>
    </div>
  );
};

export default Controls;
