import React from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import "./index.css";

const OrderButton = ({ message }) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    return (
        <button
            className="btn"
            onClick={() => {
                setSearchParams((p) => {
                    p.set("order", message.toLowerCase());
                    return p;
                });
                navigate({
                    pathname: "/home/question",
                    search: searchParams.toString(),
                });
            }}
        >
            {message}
        </button>
    );
};

export default OrderButton;
