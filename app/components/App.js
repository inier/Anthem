import React from 'react';
import styled from 'styled-components';
import BaseCom from './BaseComponent';
import Title from './titile/index';
import Content from './content/index';
import { hot } from 'react-hot-loader/root';
const ContainerApp = styled.div `
    max-width: 1024px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

class App extends BaseCom {
  render() {
    return (
      <ContainerApp>
        <Title/>
        <Content/>
      </ContainerApp>
    );
  }
}

export default hot(App);