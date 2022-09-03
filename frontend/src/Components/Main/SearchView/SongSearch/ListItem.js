import React, { useEffect, useState } from "react";

const ListItem = ({ item, active, currChecked, onchange, indx }) => {
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    if (currChecked === item.colName) setChecked(true);
    else setChecked(false);
  }, [currChecked]);


  return (
    <label className="suggestions">
      <input
        type="checkbox"
        className={`suggestions ${active ? "active" : ""}`}
        onChange={() => onchange(item.colName)}
        checked={(isChecked)}
      />
      {item.title}
    </label>
  );
};

export default ListItem;
