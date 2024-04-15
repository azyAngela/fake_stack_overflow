import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";

function App() {
    return (
      <Router>
          <FakeStackOverflow />
      </Router>
    );
  }

export default App;
