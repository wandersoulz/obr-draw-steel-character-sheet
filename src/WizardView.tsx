import { useEffect, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { WIZARD_ID } from "./constants";

interface WizardViewProps {
  role: "GM" | "PLAYER";
  playerId: string;
}

export default function WizardView({ playerId, role }: WizardViewProps) {4
    console.debug(playerId, role);
    const [name, setName] = useState("");

    useEffect(() => {
        
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        OBR.popover.close(WIZARD_ID);
    };

    return (
        <div className="h-screen w-full bg-slate-900 text-white flex flex-col items-center p-6">
            <h2 className="text-2xl font-bold mb-4">New Character Creator</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Character Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 rounded bg-slate-800 border border-slate-700"
                />
                <button type="submit" className="p-2 rounded bg-blue-600 hover:bg-blue-500">Create Character</button>
            </form>
        </div>
    );
}