import { OperationE } from "../common";
import React, { useContext } from "react";
import GraphContext from "../GraphContext";

export interface OperationControllerProps {
  operation: OperationE;
  setOperation: React.Dispatch<React.SetStateAction<OperationE>>;
}

const OperationController = (props: OperationControllerProps) => {
  // TODO use GraphContext to deselect nodes/arch
  return (
    <div>
      <h3>Operation</h3>
      <div>
        <OperationControllerInput
          label="Add Node"
          operation={OperationE.addNode}
          selectedOperation={props.operation}
          setOperation={props.setOperation}
        />
        <OperationControllerInput
          label="Add Arc"
          operation={OperationE.addArc}
          selectedOperation={props.operation}
          setOperation={props.setOperation}
        />
        <OperationControllerInput
          label="Edit Node"
          operation={OperationE.editNode}
          selectedOperation={props.operation}
          setOperation={props.setOperation}
        />
        <OperationControllerInput
          label="Edit Arc"
          operation={OperationE.editArc}
          selectedOperation={props.operation}
          setOperation={props.setOperation}
        />
        <OperationControllerInput
          label="Remove Node"
          operation={OperationE.removeNode}
          selectedOperation={props.operation}
          setOperation={props.setOperation}
        />
        <OperationControllerInput
          label="Remove Arc"
          operation={OperationE.removeArc}
          selectedOperation={props.operation}
          setOperation={props.setOperation}
        />
      </div>
    </div>
  );
};

interface OperationControllerInputI {
  selectedOperation: OperationE;
  operation: OperationE;
  setOperation: React.Dispatch<React.SetStateAction<OperationE>>;
  label: string;
}

const OperationControllerInput = (props: OperationControllerInputI) => {
  const { setSelectedItem } = useContext(GraphContext);
  return (
    <div>
      <input
        type="radio"
        id={props.operation}
        value={props.operation}
        checked={props.selectedOperation === props.operation}
        onChange={(event) => {
          event.preventDefault();
          setSelectedItem(null);
          props.setOperation(event.currentTarget.value as OperationE);
        }}
      />
      <label htmlFor={props.operation}>{props.label}</label>
    </div>
  );
};

export default OperationController;
