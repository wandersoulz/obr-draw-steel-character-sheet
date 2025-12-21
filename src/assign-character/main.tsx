import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/action/index.css";
import { AssignCharacterView } from "./assign-character";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AssignCharacterView />
  </StrictMode>,
);
