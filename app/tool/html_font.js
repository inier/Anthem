((doc, win) => {
  const docEl = doc.documentElement;
  const resizeEvt =
    "orientationchange" in window ? "orientationchange" : "resize";
  const reCalc = (() => {
    const clientWidth = docEl.clientWidth;

    if (!clientWidth) {
      return;
    }

    const num = ((clientWidth / 320) * 10).toFixed(1);
    
    docEl.style.fontSize = `${num}px`;
  })();

  if (!doc.addEventListener) {
    return;
  }

  win.addEventListener(resizeEvt, reCalc, false);
})(document, window);
