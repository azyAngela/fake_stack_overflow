// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React from "react";
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import { UserProvider } from "./context/user.js";

function App() {
    return (
        <UserProvider>
            <FakeStackOverflow />
        </UserProvider>
    );
}

export default App;
