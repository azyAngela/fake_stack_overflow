// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
// import React from "react";
// import "./stylesheets/App.css";
// import FakeStackOverflow from "./components/fakestackoverflow.js";

// function App() {
//     return (
//         <FakeStackOverflow />
//     );
// }

// export default App;

import { UserProvider } from "./utlis/userprovider.js"
import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";

function App() {
    return (
        <UserProvider>
            <Router>
                <FakeStackOverflow />
            </Router>
        </UserProvider>
    );
}

export default App;
