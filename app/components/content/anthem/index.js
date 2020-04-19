import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
//基类
import BaseCom from "@/app/components/BaseComponent";
import { getScrollTop, getScrollHeight } from "@/app/tool/scrollSetBottom";

import prop_dispatch from "./index_prop_dispatch";

const Container = styled.div`
  width: 100%;
  background: #fff;
  border-top: 1px #e8e8e8 solid;
  position: relative;
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

// 获取随机id
function performanceId() {
  return performance.now().toString().substring(0, 6);
}

class Anthem extends BaseCom {
  constructor(props) {
    super(props);
    this.state = {
      positioningNum: 0,
    };
    this.myRef = React.createRef();
  }
  componentDidMount() {
    const {
      setColumnsWidth,
      setViewHeight,
      setLocationLeft,
      setInitTop,
      maxColumns,
    } = this.props;

    const { clientWidth, clientHeight } =
      document.documentElement || document.body;
    //获取组件父级宽高
    const {
      clientWidth: anthemContainerWidth = clientWidth,
      clientHeight: anthemContainerHeight = clientHeight,
    } = this.myRef.current || {};

    //通过组件宽获取列宽
    setColumnsWidth(anthemContainerWidth);
    //获取可视区域高度
    setViewHeight(anthemContainerHeight);
    //获取left坐标
    setLocationLeft();
    //定位初始化top值
    setInitTop(maxColumns);
    // 加载初始数据
    this.getNewImg();
  }

  /**
   * 生成机器人id
   */
  generatorId(getInfo) {
    //没有给已知下标，则新建
    if (!getInfo.getNoShowRobotListNum && getInfo.getNoShowRobotListNum != 0) {
      return performanceId();
    }

    const getNoShowRobotListNum = getInfo.getNoShowRobotListNum.toString();

    const i = getInfo.i.toString();

    const domInfo = this.props.locationInfo.getIn([getNoShowRobotListNum, i]);

    return domInfo ? domInfo.robotId : performanceId();
  }

  //新资源
  getNewImg(getNoShowRobotListNum) {
    return this.props.getNewImgData(this.props.requestImgNum).then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        //获取机器人id
        let robotId = this.generatorId({ i, getNoShowRobotListNum });

        let beyond = this.positioning(res.data[i], robotId);

        if (beyond) {
          break;
        }
      }
    });
  }

  /**
   * 增加的时候开始 定位
   * @param {*} element
   * @param {*} robotId
   */
  positioning(element, robotId) {
    const {
      // 屏幕总数
      screenAllNum,
      // 最大列数
      maxColumns,
      // 列宽限定
      columnsWidth,
      robotTopLocation,
      locationLeft,
      viewHeight,
      setTop,
      upContainerHeight,
      addLocationInfo,
    } = this.props;
    let { positioningNum } = this.state;

    // 定位与列数一致时 换行
    if (positioningNum === maxColumns) {
      this.setState({
        positioningNum: 0,
      });
    }

    // 获取top数组中最小的座位下标
    const minTopNum = robotTopLocation.indexOf(
      Math.min.apply(Math, robotTopLocation)
    );
    // 图片原始宽度
    const imgWidth = element.width || 0;
    // 计算出图片在进入dom后的高度
    const imgHeight = Math.floor((columnsWidth / imgWidth) * (element.height || 0));
    // dom高
    element.domHeight = imgHeight;
    // dom宽
    element.domWidth = columnsWidth;
    // 位列一行中第几位
    element.columnsNum = minTopNum;
    const topNum = robotTopLocation[minTopNum];

    // 获取top值
    element.top = topNum;
    // 获取left值
    element.left = locationLeft[minTopNum];

    // 设定下一个同列图片的top
    setTop(minTopNum, imgHeight);
    
    upContainerHeight(topNum);

    // 获取所放置的屏幕号 下标
    let screenIng = screenAllNum - 1;
    // 新增
    addLocationInfo(element, robotId, screenIng);

    // 增长
    this.setState({
      positioningNum: positioningNum++,
    });

    // top大于当前view高度 则增加屏幕
    if (element.top > viewHeight * screenAllNum) {
      // 超出高度 则不管了
      return "beyond";
    }
  }

  scrollAction = (e) => {
    const target = e ? e.currentTarget : undefined;
    const targetHeight = target.clientHeight;
    const scrollTop = getScrollTop(target) + targetHeight;
    const screenNumIng = Math.floor(scrollTop / targetHeight) - 1;
    const {
      numIng,
      screenAllNum,
      addLocationInfoNum,
      addScreen,
      addLoadingScreen,
    } = this.props;

    if (screenNumIng !== numIng) {
      this.changeScreen(screenNumIng);
    }

    if (scrollTop === getScrollHeight(target)) {
      //增加下一个屏幕的元素队列
      addLocationInfoNum(screenAllNum);
      //增加屏幕
      addScreen();
      //增加当前加载的屏幕队
      addLoadingScreen(screenAllNum);
      //获取未显示的机器人屏幕下标
      const getNoShowRobotListNum = screenAllNum - 4;

      this.getNewImg(
        getNoShowRobotListNum < 1 ? undefined : getNoShowRobotListNum - 1
      );
    }
  };

  //显示屏幕号 change
  changeScreen = (screenNumIng) => {
    const { numIng, oldNum, changeOldNum, changeScreen } = this.props;
    //update oldScreen
    changeOldNum(numIng);

    //update screenIng
    changeScreen(screenNumIng);

    if (screenNumIng > oldNum) {
      const newShowScreenNum = screenNumIng + 2;

      this.props.loadingScreen.indexOf(newShowScreenNum) === -1
        ? this.props.downChange(screenNumIng)
        : null;
    } else if (screenNumIng < oldNum) {
      const newShowScreenNum = screenNumIng - 2;

      this.props.loadingScreen.indexOf(newShowScreenNum) === -1
        ? this.props.upChange(screenNumIng)
        : null;
    }
  };

  render() {
    const { containerHeight, renderRobot } = this.props;

    return (
      <Container ref={this.myRef} onScroll={this.scrollAction}>
        <div
          style={{
            width: "100%",
            position: "relative",
            height: containerHeight,
          }}
        >
          {renderRobot}
        </div>
      </Container>
    );
  }
}

export default connect(
  prop_dispatch.stateSetProp,
  prop_dispatch.dispatchToProps
)(Anthem);
