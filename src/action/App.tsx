import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PlayerView } from "./player-view";
import { CharacterSheet } from "./character-sheet";
import GMView from "./gm-view";
import { useEffect, useState } from "react";
import { ActiveSourcebooks, SourcebookInterface } from "forgesteel";
import OBR from "@owlbear-rodeo/sdk";
import { OBRContext } from "../context/obr-context";
import { useObr } from "../hooks/useObr";


export default function App() {
  const { isOBRReady, isSceneReady} = useObr();
  const [playerRole, setPlayerRole] = useState<"GM" | "PLAYER">("PLAYER");

  useEffect(() => {
    if (isOBRReady) {
      OBR.player.getRole().then((role) => {
        setPlayerRole(role);
      });
      OBR.action.setWidth(700);
    }
  }, [isOBRReady]);

  const [sourcebooks, setSourcebooks] = useState<SourcebookInterface[]>([])
  useEffect(() => {
    ActiveSourcebooks.getInstance().getSourcebooks().then((sourcebooks) => {
      setSourcebooks(sourcebooks);
    });
  }, []);

  let View = PlayerView;
  if (playerRole === "GM") {
    View = GMView;
  }

  return (
    <OBRContext value={{
      isOBRReady,
      isSceneReady,
    }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<View sourcebooks={sourcebooks} />} />
          <Route path="/character/:characterId" element={<CharacterSheet sourcebooks={sourcebooks} />} />
        </Routes>
      </HashRouter>
    </OBRContext>
  );
}