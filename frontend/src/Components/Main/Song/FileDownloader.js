import React, { useEffect, useRef } from "react";

function FileDownloader({ fileUrl, handleStop }) {
  const ref = useRef();
  useEffect(() => {
    ref.current.setAttribute("src", fileUrl);
  }, [fileUrl]);
  setTimeout(() => handleStop(), 200)

  return (
    <div
      style={{
        visibility: "hidden",
        height: "0",
        width: "0",
      }}
    >
      <iframe ref={ref} src={'about:blank'}/>
    </div>
  );
}

export default FileDownloader;
