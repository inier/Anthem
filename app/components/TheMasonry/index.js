import React, { Component } from "react";
import styled from "styled-components";
import Masonry, { dataTransfer } from "@ozo/masonry";
import { RadioList } from "@ozo/radio";
import axios from "axios";
import serverConf from "@/serverConf.js";

// 列数
const cols = 2;
// 槽宽，横向、纵向一致
const gutter = 10;
// 瀑布流容器高宽
const viewWidth = Math.min(window.screen.width, 414) - 24;
const viewHeight = Math.min(window.screen.width, 736) - 45;
// 子项的扩展内容高度
const addHeight = 32;
// 子项最大高度（包括addHeight）
const maxHeight = 500;
// 提前加载偏移（相对于图片容器顶部）
const lazyLoadOffset = 0;

// 请求总数
const reqCount = 50;

const DemoShow = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  [role="radiogroup"] label {
    margin-bottom: 5px;
  }
`;
const Demo = styled.div`
  position: relative;
  height: 100vh;
  // overflow: hidden;
  min-width: 320px;
  max-width: ${window.screen.width};
  max-height: 736px;
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
  padding: 0 12px;
`;
const Tools = styled.div`
  width: 42%;
  position: absolute;
  right: 0;
  bottom: 70px;
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
      data: [],
      cols,
      gutter,
      renderType: "position",
      lazyLoadOffset,
      maxHeight,
      close: true,
    };
    this.data = [];
    this.screenIndex = 1;
  }
  componentDidMount() {
    console.log("1:");

    this.getNewImgData(reqCount).then((res) => {
      this.data = res;
      this.calcData(this.data);
    });
  }
  // 获取图片
  getNewImgData = (requestImgNum) => {
    return axios
      .get(`http://${window.location.hostname}:${serverConf.imgServer.port}/`, {
        params: {
          num: requestImgNum,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data.map((item) => {
            const { src, ...rest } = item;
            return {
              src: `http://${window.location.hostname}:${serverConf.imgServer.port}/${item.src}`,
              ...rest,
            };
          });
        } else {
          alert("请求失败！");
        }
      });
  };
  calcData = (arr) => {
    const { cols, gutter, maxHeight } = this.state;
    const tStartTime = performance.now();
    dataTransfer(arr, cols, gutter, {
      viewWidth,
      viewHeight,
      addHeight,
      maxHeight,
    }).then((data) => {
      console.log(`本次数据转换耗时：`, performance.now() - tStartTime);
      this.setState({ data });
    });
  };
  handleClick = (id, item, e) => {
    console.log(id, item, e);
  };
  handleScroll = (scrollTop, e) => {
    const tHeight = e.currentTarget.clientHeight;

    if (Math.floor(scrollTop / tHeight) >= this.screenIndex) {
      this.screenIndex++;
      console.log("> 1:", scrollTop, tHeight);
      this.getNewImgData(20).then((res) => {
        const tArr = this.data.concat(res);
        this.calcData(tArr);
        this.data = tArr;
      });
    }
  };
  handleRadioChange = (value) => {
    this.setState({
      renderType: value,
    });
  };
  handleColChange = (e) => {
    this.setState(
      {
        cols: Number(e.currentTarget.value),
      },
      () => {
        this.calcData(this.data);
      }
    );
  };
  handleGutterChange = (e) => {
    this.setState(
      {
        gutter: Number(e.currentTarget.value),
      },
      () => {
        this.calcData(this.data);
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
    e.currentTarget.setAttribute("data-tag", this.state.close ? "-" : "+");
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
          <Tabs>
            Tabs(
            {data.reduce((r, v) => {
              return r + v.length;
            }, 0)}
            )
          </Tabs>
          <Container>
            <Masonry
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
        <Handler data-tag="+" onClick={this.handleSwitch} />
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