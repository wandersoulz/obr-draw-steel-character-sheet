import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PlayerView } from "./PlayerView";
import { CharacterSheetView } from "./CharacterSheetView";
import GMView from "./GMView";
import { useEffect, useState } from "react";
import { ActiveSourcebooks, SourcebookInterface } from "forgesteel";

interface AppProps {
  role: "GM" | "PLAYER";
  playerId: string;
}

export default function App({ role, playerId }: AppProps) {
  const [sourcebooks, setSourcebooks] = useState<SourcebookInterface[]>([])
  useEffect(() => {
    ActiveSourcebooks.getInstance().getSourcebooks().then((sourcebooks) => {
      setSourcebooks(sourcebooks);
    });
  }, []);

  let View = PlayerView;
  if (role === "GM") {
    View = GMView;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<View sourcebooks={sourcebooks} playerId={playerId} role={role} />} />
        <Route path="/character/:characterId" element={<CharacterSheetView sourcebooks={sourcebooks} playerId={playerId} role={role} />} />
      </Routes>
    </HashRouter>
  );
}