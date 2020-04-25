import React, { Component } from "react";
import styled from "styled-components";
import Masonry, { dataTransfer } from "@ozo/masonry";
import { RadioList } from "@ozo/radio";

// 生成[n,m]范围内的随机整数
const getRandomByRange = (n, m, randArr) => {
  function random() {
    const number1 = Math.random() * (m - n + 1);
    const number2 = Math.floor(number1);

    return number2 + n;
  }

  let rand = random();

  const tFlag = randArr.filter((item) => {
    if (item === rand) {
      return false;
    }
    if (item > rand + 20 || item < rand - 20) {
      return true;
    } else {
      return false;
    }
  });

  while (tFlag.length > 1) {
    rand = random();
  }

  return rand;
};

// 列数
const cols = 2;
// 槽宽，横向、纵向一致
const gutter = 10;
// 瀑布流容器高宽
const viewWidth = Math.min(window.screen.width, 414) - 24;
const viewHeight = Math.min(window.screen.height, 736) - 45;
// 子项的扩展内容高度
const addHeight = 32;
// 子项最大高度（包括addHeight）
const maxHeight = 500;
// 提前加载偏移（相对于图片容器顶部）
const lazyLoadOffset = 0;

// 请求总数
const reqCount = 50;
// 请求图片宽度
const reqWidth = Math.ceil(viewWidth / cols);
// 请求图片最小高度
const reqMinHeight = 200;
// 请求图片最大高度
const reqMaxHeight = maxHeight;

const getElements = (args = {}) => {
  const tDefault = {
    num: reqCount,
    minHeight: reqMinHeight,
    maxHeight: reqMaxHeight,
    start: 0,
    ...args,
  };
  const { num, minHeight, maxHeight, start } = tDefault;
  const result = [];
  const reqHeights = [];

  for (let i = 0; i < num; i++) {
    const reqHeight = getRandomByRange(minHeight, maxHeight, reqHeights);

    result.push({
      id: `m-${i + 1 + start}`,
      src: `https://i.picsum.photos/id/${i + 1}/${reqWidth}/${reqHeight}.jpg`,
      // src: `https://picsum.photos/${reqWidth}/${reqHeight}?image=${i + 1}`,
      title: `[${i + 1 + start}] 我是标题我是标题我是标题我是标题我是标题`,
    });
  }

  return result;
};

const DemoShow = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 320px;
  max-width: ${Math.min(window.screen.width, 414)}px;
  max-height: ${Math.min(window.screen.height, 736)}px;

  [role="radiogroup"] label {
    margin-bottom: 5px;
  }
`;
const Demo = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
`;
const Tabs = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  background-color: #ff3;
`;
const Container = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
`;
const Tools = styled.div`
  width: 42%;
  position: absolute;
  right: 0;
  bottom: 70px;
  z-index: 999999;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  &.close {
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
  }
  input {
    cursor: pointer;
  }
`;
const Handler = styled.div`
  position: absolute;
  bottom: 20px;
  right: 0;
  z-index: 999998;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: rgba(255, 60, 60, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:after {
    content: attr(data-tag);
    font-size: 50px;
    margin-top: -8px;
    color: rgba(255, 255, 255, 0.8);
  }
`;
const ToolsTitle = styled.div`
  font-size: 14px;
`;
const ToolsItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border: none;
  }
`;

const radioData = [
  { label: "position", value: "position" },
  { label: "normal", value: "normal" },
  { label: "column", value: "column" },
  { label: "grid", value: "grid" },
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      cols,
      gutter,
      renderType: "position",
      lazyLoadOffset,
      maxHeight,
      close: true,
    };
    this.data = getElements();
    this.screenIndex = 1;
  }
  componentDidMount() {
    console.log("初始化:");
    this.calcData(this.data);
  }
  calcData = (arr, isForce = false) => {
    const { cols, gutter, renderType, maxHeight } = this.state;
    const tStartTime = performance.now();
    dataTransfer(arr, {
      cols,
      gutter,
      viewWidth,
      viewHeight,
      addHeight,
      maxHeight,
      renderType,
      force: isForce,
    }).then((data) => {
      console.log(data);
      console.log(`本次数据转换耗时：`, performance.now() - tStartTime);
      this.setState({ data });
    });
  };
  handleClick = (id, item, e) => {
    console.log(id, item, e);
  };
  handleScroll = (e, scrollTop, screenCount) => {
    const tHeight = e.currentTarget.clientHeight;
    const screenIndex = Math.floor(scrollTop / tHeight);

    if (screenIndex >= this.screenIndex) {
      setTimeout(() => {
        this.screenIndex++;
        console.log("> 1:", scrollTop, tHeight);
        const tArr = this.data.concat(
          getElements({ num: 20, start: this.data.length })
        );
        this.calcData(tArr);
        this.data = tArr;
      }, 2000);
    }
  };
  handleRadioChange = (value) => {
    this.setState(
      {
        renderType: value,
      },
      () => {
        this.calcData(this.data, true);
      }
    );
  };
  handleColChange = (e) => {
    const tValue = Number(e.currentTarget.value);
    this.setState(
      {
        cols: tValue,
      },
      () => {
        this.calcData(this.data, tValue !== this.state.cols);
      }
    );
  };
  handleGutterChange = (e) => {
    const tValue = Number(e.currentTarget.value);
    this.setState(
      {
        gutter: tValue,
      },
      () => {
        this.calcData(this.data, tValue !== this.state.gutter);
      }
    );
  };
  handleMaxHeightChange = (e) => {
    this.setState(
      {
        maxHeight: Number(e.currentTarget.value),
      },
      () => {
        this.calcData(this.data);
      }
    );
  };
  handleLazyLoadOffsetChange = (e) => {
    console.log(e.currentTarget.value);
    this.setState({
      lazyLoadOffset: Number(e.currentTarget.value),
    });
  };
  handleSwitch = (e) => {
    e.currentTarget.setAttribute("data-tag", this.state.close ? "+" : "-");
    this.setState({
      close: !this.state.close,
    });
  };
  render() {
    const {
      data,
      cols,
      gutter,
      maxHeight,
      renderType,
      lazyLoadOffset,
      close,
    } = this.state;
    return (
      <DemoShow>
        <Demo>
          <Tabs>Tabs({data.total})</Tabs>
          <Container>
            <Masonry
              virtualized
              renderType={renderType}
              data={data}
              cols={cols}
              gutter={gutter}
              lazyLoadOffset={lazyLoadOffset}
              onClick={this.handleClick}
              onScroll={this.handleScroll}
            />
          </Container>
        </Demo>
        <Handler data-tag="-" onClick={this.handleSwitch} />
        <Tools className={close ? "close" : ""}>
          <ToolsItem>
            <ToolsTitle>cols: {cols}</ToolsTitle>
            <input
              type="range"
              min={2}
              max={8}
              step={1}
              value={cols}
              onChange={this.handleColChange}
            />
          </ToolsItem>
          <ToolsItem>
            <ToolsTitle>gutter: {gutter}</ToolsTitle>
            <input
              type="range"
              min={2}
              max={20}
              step={2}
              value={gutter}
              onChange={this.handleGutterChange}
            />
          </ToolsItem>
          <ToolsItem>
            <ToolsTitle>maxHeight: {maxHeight}</ToolsTitle>
            <input
              type="range"
              min={300}
              max={1000}
              step={50}
              value={maxHeight}
              onChange={this.handleMaxHeightChange}
            />
          </ToolsItem>
          <ToolsItem>
            <ToolsTitle>lazyLoadOffset: {lazyLoadOffset}</ToolsTitle>
            <input
              type="range"
              min={0}
              max={window.screen.height}
              step={300}
              value={lazyLoadOffset}
              onChange={this.handleLazyLoadOffsetChange}
            />
          </ToolsItem>
          <ToolsItem>
            <ToolsTitle>renderType: {renderType}</ToolsTitle>
            <RadioList
              inline
              name="renderType"
              data={radioData}
              selectedValue={renderType}
              onChange={this.handleRadioChange}
              style={{ color: "#fff" }}
            />
          </ToolsItem>
        </Tools>
      </DemoShow>
    );
  }
}

export default App;
