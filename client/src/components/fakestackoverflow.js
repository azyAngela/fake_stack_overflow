import React from "react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Welcome from "./welcome";
import Login from "./login";
import Register from "./register";
import Home from "./home";

export default function fakeStackOverflow() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Welcome />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="home/*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}
