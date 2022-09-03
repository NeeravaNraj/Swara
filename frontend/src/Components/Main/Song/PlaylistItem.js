import React from "react";
import { MenuItem } from "@mui/material";

function PlaylistItem({ id, name, handleClick }) {
  const handleSelect = () => {
    handleClick(id);
  };

  return <MenuItem onClick={handleSelect}>{name}</MenuItem>;
}

export default PlaylistItem;
