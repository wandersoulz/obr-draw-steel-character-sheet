import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./../index.css";
import { AssignCharacterView } from "./AssignCharacter";
import OBR from "@owlbear-rodeo/sdk";

OBR.onReady(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AssignCharacterView />
    </StrictMode>,
  );
});
