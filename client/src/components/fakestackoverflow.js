import React from "react";
import Header from "./header";
import Main from "./main";
import {useState} from "react";

export default function fakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState("home");
    const setMainPage = (search = "", page= "home") => {
        setSearch(search);
        setPage(page);
    };
    return (
        <>
            <Header search = {search} setMainPage = {setMainPage}/>
            <Main search={search} passpage = {page}/>
        </>
    );
}
