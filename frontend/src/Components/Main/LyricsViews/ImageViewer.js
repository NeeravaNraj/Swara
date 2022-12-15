import React, { useEffect, useRef, useState } from "react";
import { useUrl } from "../../../Hooks/SongProvider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import "../../../Stylesheets/Imageviewer.css";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { MdRotateLeft, MdRotateRight } from "react-icons/md";

const ImageViewer = ({ songId, maxPages, handleClose, handleError }) => {
  const [page, setPage] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [maxW, setMaxW] = useState(50);
  const [rotate, setRotate] = useState(0);
  const [isLargerH, setIsLargerH] = useState(false);
  const [isLarger, setIsLarger] = useState(false);
  const [changingW, setChangingW] = useState(0);

  // console.log(page)

  const URL = useUrl();
  const imgRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (page === 0) setShowLeft(false);
    else setShowLeft(true);
    if (page === maxPages - 1) setShowRight(false);
    else setShowRight(true);
  }, [page]);

  useEffect(() => {
    setRotate(0);
    setMaxW(50);
    setIsLarger(false);
    setIsLargerH(false);
    setChangingW(0);
  }, [page]);

  // useEffect(() => {
  //   if (imgRef?.current?.height >= wrapperRef?.current?.offsetHeight) {
  //     setIsLarger(true);
  //   } else setIsLarger(false);
  // }, [imgRef?.current?.height]);

  // useEffect(() => {
  //   if (rotate === 90 || rotate === -90 || rotate === 270 || rotate === -270) {
  //     if (imgRef?.current?.naturalWidth > imgRef?.current?.naturalHeight) {
  //       if (imgRef?.current?.width >= wrapperRef?.current?.offsetHeight) {
  //         setIsLargerH(true);
  //       } else setIsLargerH(false);
  //     }
  //   } else {
  //     if (imgRef?.current?.height >= wrapperRef?.current?.offsetHeight) {
  //       setIsLarger(true);
  //     } else setIsLarger(false);
  //   }
  // }, [maxW, rotate]);

  const handleImageChange = (incDec) => {
    if (page < maxPages - 1) {
      if (incDec) setPage(page + 1);
    }
    if (page > 0) if (!incDec) setPage(page - 1);
  };

  const handleZoom = (incDec) => {
    if (maxW !== 20)
      if (!incDec) {
        setMaxW(maxW - 10);
      }
    if (
      imgRef?.current?.width === imgRef?.current?.naturalWidth &&
      incDec === true
    ) {
      handleError("Looks like this image cant zoom anymore!");
    } else {
      if (maxW !== 150) if (incDec) setMaxW(maxW + 10);
    }
  };

  const handleRotate = (incDec) => {
    if (rotate === 270 && incDec === true) setRotate(0);
    if (rotate === -270 && incDec === false) setRotate(0);
    if (rotate !== 270) if (incDec) setRotate((prev) => prev + 90);
    if (rotate !== -270) if (!incDec) setRotate((prev) => prev - 90);
  };

  return (
    <>
      <div className="image-viewer-wrapper" ref={wrapperRef}>
        <IoMdClose
          className="fullscreen-lyrics-close-btn-icon close-btn-image"
          onClick={handleClose}
        />
        <div className="image-viewer">
          <button
            className="image-control-buttons pagination-btns"
            onClick={() => handleImageChange(false)}
            style={{
              visibility: showLeft ? "visible" : "hidden",
            }}
          >
            <FaArrowLeft />
          </button>
          <div className="imageview-container">
            <img
              ref={imgRef}
              src={`${URL}/api/imageStream/${songId}/${page}`}
              type="image/jpg"
              preload="metadata"
              className="lyrics-image"
              alt="image"
              style={{
                transform: `rotate(${rotate}deg)`,
                maxWidth: `${maxW}vh`,
                top: isLargerH ? "35%" : isLarger ? 0 : "",
                marginTop: isLarger ? "5em" : "",
                marginBottom: isLarger ? "5em" : "",
              }}
            />
          </div>
          <button
            className="image-control-buttons pagination-btns"
            onClick={() => handleImageChange(true)}
            style={{ visibility: showRight ? "visible" : "hidden" }}
          >
            <FaArrowRight />
          </button>
        </div>
        <div className="control-btn-group">
          <button className="control-btns" onClick={() => handleRotate(false)}>
            <MdRotateLeft />
          </button>
          <button className="control-btns" onClick={() => handleRotate(true)}>
            <MdRotateRight />
          </button>
          <button className="control-btns" onClick={() => handleZoom(false)}>
            <AiOutlineZoomOut />
          </button>
          <button className="control-btns" onClick={() => handleZoom(true)}>
            <AiOutlineZoomIn />
          </button>
          <p className="zoomper">{maxW + 50}% zoom</p>
        </div>
      </div>
    </>
  );
};

export default ImageViewer;
