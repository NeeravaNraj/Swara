import React, { useEffect, useRef, useState } from "react";
import { AiOutlineZoomIn } from "react-icons/ai";
import { IoMdCloseCircle } from "react-icons/io";

const ImagePreview = ({ src, style, openImg, removeImg }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [wantsRemove, setWantsRemove] = useState(false);

  const outsideRef = useRef();

  useEffect(() => {
    const oustideClick = (e) => {
      if (outsideRef.current && !outsideRef.current.contains(e.target))
        setWantsRemove(false);
    };
    document.addEventListener("mousedown", oustideClick);

    return () => {
      document.removeEventListener("mousedown", oustideClick);
    };
  }, [outsideRef]);

  const handleWantsRemove = () => {
    setWantsRemove(true);
  };

  return (
    <>
      <div
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
        }}
      >
        <img className="img-preview-wrapper" src={src} style={style} />
        <div
          className="img-hover"
          style={{
            backgroundColor: isHovered ? "rgba(60, 60, 60, 0.5)" : "",
          }}
        >
          <button
            className="open-image"
            style={{ visibility: isHovered ? "visible" : "hidden" }}
            onClick={openImg}
          >
            <AiOutlineZoomIn />
          </button>
        </div>
        {!wantsRemove && (
          <button
            className="remove-img-btn"
            style={{ visibility: isHovered ? "visible" : "hidden" }}
            onClick={handleWantsRemove}
          >
            <IoMdCloseCircle />
          </button>
        )}
      </div>
      <div
        className="remove-btn-container"
        style={{
          transform: wantsRemove ? "translateY(0)" : "translateY(-4em)",
          opacity: wantsRemove ? "1" : "0",
          height: wantsRemove ? "" : 0,
          padding: wantsRemove ? "" : 0,
          transition: "0.2s",
        }}
        ref={outsideRef}
      >
        <button className="remove-btn" onClick={removeImg}>
          Remove
        </button>
      </div>
    </>
  );
};

export default ImagePreview;
