import React, { useState } from "react";
import Header from "./header";
import Main from "./main";

export default function FakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState("home");

    const handleSearch = (query) => {
        setSearch(query);
        setPage("search"); // Update page to indicate search results
    };

    return (
        <>
            <Header search={search} handleSearch={handleSearch} />
            <Main search={search} passpage={page} />
        </>
    );
}