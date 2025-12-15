import ReactDOM from "react-dom/client";
import OBR from "@owlbear-rodeo/sdk";
import App from "./App";
import "./index.css";

OBR.onReady(async () => {
  const playerId = await OBR.player.getId();
  const role = await OBR.player.getRole();
  OBR.action.setWidth(700);

  const rootElement = ReactDOM.createRoot(document.getElementById("root")!);
  rootElement.render(
    <App playerId={playerId} role={role} />
  );
});