import immutable from 'immutable';
import {
  robot
} from '../defaultData';

module.exports = (state = immutable.fromJS(robot), action) => {
  switch (action.type) {
    /**
     * 新增加机器人
     */
    case 'SET_addLocationInfo':
      const { robotId, screenNumIng, imgData, } = action.data;
      const { src, width, height, left, top, domHeight, domWidth, columnsNum} = imgData;

      return state.updateIn(['locationInfo', screenNumIng.toString()], list => list.push({
        robotId: robotId,
        img: src,
        oWidth: width,
        oHeight: height,
        left: left,
        top: top,
        domHeight: domHeight,
        domWidth: domWidth,
        columnsNum: columnsNum
      }));

      //存储robot
    case 'SET_robotContainer':

      return state.update('robotContainer', container => {
        const getRobot = action.data.map(item => {
          return {
            robotId: item.robotId,
            info: item
          }
        });

        return container.concat(getRobot);
      });

      /**
       * 初始化top值
       */
    case 'SET_initTop':
      return state.set('robotTopLocation', new Array(action.data).fill(0));

      /**
       * 更新top值
       */
    case 'SET_top':
      return state.update('robotTopLocation', list => {
        list[action.data.columnsNum] += action.data.height;

        return list;
      });

      //添加位置信息
    case 'ADD_locationInfoNum':
      return state.setIn(['locationInfo', action.data.toString()], immutable.fromJS([]));

    default:
      return state;
  }
}