import React, { useContext, useState } from "react";
import { ArcAttributesI } from "../common";
import GraphContext from "../GraphContext";

interface ArcControllerProps {
  defaultArc: ArcAttributesI;
  setDefaultArc: React.Dispatch<React.SetStateAction<ArcAttributesI>>;
}

const ArcController = (props: ArcControllerProps) => {
  const { arcs, setArcs, selectedItem } = useContext(GraphContext);
  const [values, setValues] = useState<ArcAttributesI>({
    bend: 20,
    lower: null,
    cost: null,
    directed: true,
    flow: null,
    upper: null,
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let n = parseInt(event.currentTarget.value);
    let value: number | null = isNaN(n) ? null : n;
    let attribute = event.currentTarget.id;
    setValues({ ...values, [attribute]: value });
    if (selectedItem !== null) {
      arcs[selectedItem.idx] = {
        ...arcs[selectedItem.idx],
        [attribute]: value,
      };
      setArcs((arcs) => [...arcs]);
    }
  };
  return (
    <div>
      <h3>Arc Control</h3>
      <div>
        <div>
          <label className="cost" htmlFor="cost">
            Cost
          </label>
          <input
            className="CircleInput cost"
            type="number"
            id="cost"
            value={"" + values.cost}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="flow" htmlFor="flow">
            Flow
          </label>
          <input
            className="CircleInput flow"
            type="number"
            id="flow"
            value={"" + values.flow}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="lower" htmlFor="lower">
            Lower
          </label>
          <input
            className="CircleInput lower"
            type="number"
            id="lower"
            value={"" + values.lower}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="upper" htmlFor="upper">
            Upper
          </label>
          <input
            className="CircleInput upper"
            type="number"
            id="upper"
            value={"" + values.upper}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="bend">Bend</label>
          <input
            className="CircleInput"
            type="number"
            id="bend"
            value={"" + values.bend}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ArcController;
