import immutable from "immutable";
import { arrangeProperties } from "../defaultData";

module.exports = (state = immutable.fromJS(arrangeProperties), action) => {
  switch (action.type) {
    /**
     * 通过父级组件的宽获取列宽
     */
    case "SET_columnsWidth":
      let spacing = state.get("spacing");
      let maxColumns = state.get("maxColumns");

      return state.set(
        "columnsWidth",
        Math.floor((action.data - spacing * maxColumns) / maxColumns)
      );

    case "SET_locationLeft":
      let getSpacing = state.get("spacing");
      let columnsWidth = state.get("columnsWidth");
      let columns = state.get("maxColumns");

      columnsWidth += getSpacing;

      let newLeftLocation = [];

      for (let i = 0; i < columns; i++) {
        newLeftLocation.push(columnsWidth * i + getSpacing / 2);
      }

      return state.set("locationLeft", newLeftLocation);

    case "SET_viewHeight":
      return state.update(
        "viewHeight",
        (defaultHeight) => defaultHeight + action.data
      );

    case "UP_containerHeight":
      return state.update("containerHeight", (currentHeight) =>
        currentHeight < action.data ? action.data : currentHeight
      );

    default:
      return state;
  }
};
