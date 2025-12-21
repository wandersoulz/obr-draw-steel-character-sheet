import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PlayerView } from "./views/player-view";
import { CharacterSheet } from "./views/character-sheet";
import GMView from "./views/gm-view";
import { useEffect, useState } from "react";
import { ActiveSourcebooks } from "forgesteel";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import { OBRContext } from "../context/obr-context";
import { useObr } from "../hooks/useObr";
import { usePlayer } from "@/hooks/usePlayer";
import { METADATA_KEYS } from "@/constants";


export default function App() {
  const obrState = useObr();
  const { characters, updateCharacter } = usePlayer();
  const [playerRole, setPlayerRole] = useState<"GM" | "PLAYER">();
  const [prevItems, setPrevItems] = useState<Item[]>([]);
  const [forgeSteelLoaded, setForgeSteelLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (!obrState.isOBRReady) return;
    OBR.player.getRole().then((role) => {
      setPlayerRole(role);
    });
    OBR.action.setWidth(700);
  }, [obrState]);

  useEffect(() => {
    if (!obrState.isOBRReady || !obrState.isSceneReady) return;
    OBR.scene.items.getItems().then(setPrevItems);
  }, [obrState]);

  useEffect(() => {
    if (!obrState.isOBRReady || !obrState.isSceneReady) return;
    // Set up listener to handle token deletions or character unassignment
    const unsubscribe = OBR.scene.items.onChange((items) => {
      const itemSet = new Set(items.map(item => item.id));
      const deletedItems = prevItems.filter(item => !itemSet.has(item.id));
      deletedItems.forEach((item) => {
        const character = characters.find((c) => item.id == c.tokenId);
        if (!character) return;
        updateCharacter(character, {tokenId: ""});
      });
      items.forEach((item) => {
        const character = characters.find((c) => item.id == c.tokenId);
        if (!character) return;
        if (!item.metadata[METADATA_KEYS.CHARACTER_DATA]) {
           updateCharacter(character, {tokenId: ""});
        }
      });
      setPrevItems(items);
    });
    return unsubscribe;
  }, [prevItems, characters]);

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