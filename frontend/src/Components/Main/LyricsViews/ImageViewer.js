import React, { useEffect, useState } from "react";
import { useUrl } from "../../../Hooks/SongProvider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import "../../../Stylesheets/Imageviewer.css";

const ImageViewer = ({ songId, maxPages, handleClose }) => {
  const [id, setId] = useState(songId);
  const [page, setPage] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const URL = useUrl();

  useEffect(() => {
    if (page === 0) setShowLeft(false);
    else setShowLeft(true);
    if (page === maxPages - 1) setShowRight(false);
    else setShowRight(true);
  }, [page]);

  const handleImageChange = (incDec) => {
    if (page < maxPages - 1) {
      if (incDec) setPage(page + 1);
    }
    if (page > 0) if (!incDec) setPage(page - 1);
  };

  return (
    <div className="image-viewer-wrapper">
      <IoMdClose
        className="fullscreen-lyrics-close-btn-icon close-btn-image"
        onClick={handleClose}
      />
      <div className="image-viewer">
        <button
          className="image-control-buttons"
          onClick={() => handleImageChange(false)}
          style={{ visibility: showLeft ? "visible" : "hidden" }}
        >
          <FaArrowLeft />
        </button>
        <img
          src={`${URL}/api/imageStream/${id}/${page}`}
          type="image/jpg"
          preload="metadata"
          className="lyrics-image"
        />
        <button
          className="image-control-buttons"
          onClick={() => handleImageChange(true)}
          style={{ visibility: showRight ? "visible" : "hidden" }}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
