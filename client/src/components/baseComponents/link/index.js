import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const CLink = ({ className, text, target }) => {
    return (
        <Link className={`${className} none_text_decoration`} to={target}>
            {text}
        </Link>
    );
};

export default CLink;
