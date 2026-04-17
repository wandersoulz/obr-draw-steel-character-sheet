import React from "react";
import ReactDOM from "react-dom/client";
import { HeroView } from "./views/HeroView";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroView />
  </React.StrictMode>,
);
