/*
 * @Author: your name
 * @Date: 2020-04-18 14:01:26
 * @LastEditTime: 2020-04-21 00:07:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Anthem\app\components\App.js
 */
import React from "react";
import styled from "styled-components";
import BaseCom from "./BaseComponent";
import Title from "./titile/index";
import Content from "./content/index";
import { hot } from "react-hot-loader/root";
import TheMasonry from "./TheMasonry";
import RandMasonry from "./RandMasonry";

const ContainerApp = styled.div`
  max-width: 1024px;
  min-width: ${window.screen.width * 3};
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Demo = styled.div`
  position: relative;
  height: 100vh;
  // overflow: hidden;
  min-width: 320px;
  max-width: ${window.screen.width};
  max-height: 736px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
`;

class App extends BaseCom {
  render() {
    return (
      <ContainerApp>
        <TheMasonry />
        <RandMasonry />
        <Demo>
          <Title />
          <Content />
        </Demo>
      </ContainerApp>
    );
  }
}

export default hot(App);
