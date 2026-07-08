import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// @ts-ignore: CSS import handled by bundler
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
