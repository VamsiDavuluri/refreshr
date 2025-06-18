// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";

import "./App.css"; // For our global theme and styles

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
