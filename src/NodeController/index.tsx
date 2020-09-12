import { attribute } from "../common";
import React, { useContext, useState } from "react";
import GraphContext from "../GraphContext";

interface NodeControllerProps {
  defaultNode: attribute;
  setDefaultNode: React.Dispatch<React.SetStateAction<attribute>>;
}

const NodeController = (props: NodeControllerProps) => {
  const { nodes, setNodes, selectedItem } = useContext(GraphContext);
  const [balance, setBalance] = useState<attribute>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.currentTarget.value);
    let newBalance = isNaN(value) ? null : value;
    if (selectedItem) {
      if (nodes[selectedItem.idx] === undefined)
        console.log(selectedItem, nodes);
      nodes[selectedItem.idx].balance = newBalance;
      setNodes((nodes) => [...nodes]);
    }
    setBalance(newBalance);
  };
  return (
    <div>
      <h3>Node Control</h3>
      <div>
        <label>
          Balance
          <input
            type="number"
            value={"" + balance}
            className="CircleInput"
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
};

export default NodeController;
