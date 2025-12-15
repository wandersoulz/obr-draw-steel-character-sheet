import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CharacterListView from "./CharacterListView";
import CharacterSheetView from "./CharacterSheetView";
import GMView from "./GMView";
import WizardView from "./WizardView";

interface AppProps {
  role: "GM" | "PLAYER";
  playerId: string;
}

export default function App({ role, playerId }: AppProps) {
  let View = CharacterListView;
  if (role === "GM") {
    View = GMView;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<View playerId={playerId} role={role} />} />
        <Route path="/character/:characterId" element={<CharacterSheetView playerId={playerId} role={role} />} />
        <Route path="/Character_Wizard" element={<WizardView playerId={playerId} role={role} />} />
      </Routes>
    </HashRouter>
  );
}