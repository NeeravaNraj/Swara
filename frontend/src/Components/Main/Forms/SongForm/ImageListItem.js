import React from "react";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import { nanoid } from "nanoid";

const ImageListItem = ({
  image,
  idx,
  images,
  handleOrderUp,
  handleOrderDown,
}) => {
  return (
    <div className="image-wrapper" key={nanoid(10)}>
      {image}
      <p className="image-index">{idx + 1}</p>
      <div className="order-btns-wrapper">
        {idx !== 0 && (
          <button
            className="order-btns"
            onClick={() => handleOrderUp(images[idx].order)}
          >
            <BsFillArrowUpCircleFill />
          </button>
        )}
        {idx !== images.length - 1 && (
          <button
            className="order-btns"
            onClick={() => handleOrderDown(images[idx].order)}
          >
            <BsFillArrowDownCircleFill />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageListItem;
