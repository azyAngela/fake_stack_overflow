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
