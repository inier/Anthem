import React from "react";
import serverConf from "@/serverConf";

import BaseCom from "@/app/components/BaseComponent";
import Zmage from "react-zmage";
// import LazyLoad from "react-lazyload";
class Robot extends BaseCom {
  constructor(props) {
    super(props);
  }

  render() {
    const { domWidth, left, top, img,domHeight } = this.props.info;

    return (
      <div
        style={{
          width: domWidth,
          position: "absolute",
          left: left,
          top: top,
        }}
      >
        {/* <LazyLoad
          scroll={true}
          overflow={true}
          height={domHeight} //添加高
          offset={window.screen.height}
        > */}
          <Zmage
            src={`http://${window.location.hostname}:${serverConf.imgServer.port}/${img}`}
            style={{
              maxWidth: "100%",
              border: 0,
              display: "block",
            }}
          />
        {/* </LazyLoad> */}
      </div>
    );
  }
}

export default Robot;
