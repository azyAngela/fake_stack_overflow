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


// import React from "react";
// import Header from "./header";
// import Main from "./main";
// import {useState} from "react";

// export default function fakeStackOverflow() {
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState("home");
//     const setMainPage = (search = "", page= "home") => {
//         setSearch(search);
//         setPage(page);
//     };
//     return (
//         <>
//             <Header search = {search} setMainPage = {setMainPage}/>
//             <Main search={search} passpage = {page}/>
//         </>
//     );
// }


// // Parent component where Header and PostList components are rendered
// import React, { useState, useEffect } from 'react';
// import Header from './header';
// import Main from "./main";

// const fakeStackOverflow = () => {
//   const [allPosts, setAllPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Function to update the search query and trigger search
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     filterPosts(query);
//   };

//   // Function to filter posts based on search query
//   const filterPosts = (query) => {
//     // Implement search logic to filter allPosts based on query
//     const filtered = allPosts.filter(post => {
//       // Implement your search logic here
//       return post.title.toLowerCase().includes(query.toLowerCase()) || 
//              post.text.toLowerCase().includes(query.toLowerCase()) ||
//              post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
//     });
//     setFilteredPosts(filtered);
//   };

//   useEffect(() => {
//     // Fetch all posts
//     // Update allPosts state
//     // This is just a placeholder, you should replace it with your actual API call
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/question/getquestion');
//         setAllPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };
//     fetchPosts();
//   }, []);

//   return (
//     <div>
//       <Header search={searchQuery} handleSearch={handleSearch} />
//       <PostList posts={filteredPosts} />
//     </div>
//   );
// };

// export default fakeStackOverflow;
