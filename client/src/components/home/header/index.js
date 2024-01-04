import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router";

//Header component
const Header = () => {
  const navigate = useNavigate();
  const [val, setVal] = useState("");
  return (
    <div id="header" className="header">
      <div></div>
      <div className="title">Fake Stack Overflow</div>
      <input
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            navigate({
              pathname: "/home/question",
              search: `keyword=${val}&from=search`,
            });
          }
        }}
      />
    </div>
  );
};

export default Header;
