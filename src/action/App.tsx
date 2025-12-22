import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PlayerView } from "./views/player-view";
import { CharacterSheet } from "./views/character-sheet";
import GMView from "./views/gm-view";
import { useEffect, useState } from "react";
import { ActiveSourcebooks } from "forgesteel";
import OBR from "@owlbear-rodeo/sdk";
import { OBRContext } from "../context/obr-context";
import { useObr } from "../hooks/useObr";

export default function App() {
  const obrState = useObr();
  const [playerRole, setPlayerRole] = useState<"GM" | "PLAYER">();
  const [forgeSteelLoaded, setForgeSteelLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (!obrState.isOBRReady) return;
    OBR.player.getRole().then((role) => {
      setPlayerRole(role);
    });
    OBR.action.setWidth(700);
  }, [obrState]);

  useEffect(() => {
    ActiveSourcebooks.getInstance().getSourcebooks().then(() => {
      setForgeSteelLoaded(true);
    });
  }, []);

  let View = PlayerView;
  if (playerRole === "GM") {
    View = GMView;
  }

  return (
    <OBRContext value={obrState}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<View forgeSteelLoaded={forgeSteelLoaded} />} />
          <Route path="/character/:characterId" element={<CharacterSheet playerRole={playerRole} forgeSteelLoaded={forgeSteelLoaded} />} />
        </Routes>
      </HashRouter>
    </OBRContext>
  );
}