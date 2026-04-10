import { CheckCircle2, Footprints, Shield, Swords, Activity } from 'lucide-react';
import { ActionType } from '@/stores/turnStore';

interface TurnActionsProps {
    tokenId: string | undefined;
    turnActions: Record<string, boolean> | any;
    isMyTurn: boolean;
    toggleAction: (id: string, action: ActionType) => void;
    speed: number;
}

export function TurnActions({ tokenId, turnActions, isMyTurn, toggleAction, speed }: TurnActionsProps) {
    return (
        <div className="mt-1 border-t border-slate-700">
            <div
                className="flex text-md items-center gap-3 py-2 border-b-2 mb-3 group select-none"
                style={{ borderColor: '#960583' }}
            >
                <h3 className="text-md font-bold flex-1 text-slate-100 uppercase tracking-wide">
                    Turn Actions
                </h3>
                <div className="flex items-center">
                    <span className="text-md text-slate-400">
                        Speed: <span className="font-bold text-rose-500">{speed}</span> sq.
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    onClick={() => tokenId && toggleAction(tokenId, 'main')}
                    className={`flex items-center justify-between p-3 rounded border transition-colors disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ${
                        turnActions.main
                            ? 'bg-emerald-900/40 border-emerald-600 text-emerald-400'
                            : 'bg-slate-700 border-slate-600 text-slate-300 enabled:hover:bg-slate-600'
                    }`}
                    disabled={!isMyTurn}
                >
                    <div className="flex items-center gap-2">
                        <Swords
                            size={16}
                            className={turnActions.main ? 'text-emerald-400' : 'text-indigo-400'}
                        />
                        <span className="font-semibold">Main Action</span>
                    </div>
                    {turnActions.main ? (
                        <CheckCircle2 size={18} />
                    ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                    )}
                </button>

                <button
                    onClick={() => tokenId && toggleAction(tokenId, 'maneuver')}
                    className={`flex items-center justify-between p-3 rounded border transition-colors disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ${
                        turnActions.maneuver
                            ? 'bg-emerald-900/40 border-emerald-600 text-emerald-400'
                            : 'bg-slate-700 border-slate-600 text-slate-300 enabled:hover:bg-slate-600'
                    }`}
                    disabled={!isMyTurn}
                >
                    <div className="flex items-center gap-2">
                        <Shield
                            size={16}
                            className={turnActions.maneuver ? 'text-emerald-400' : 'text-emerald-400'}
                        />
                        <span className="font-semibold">Maneuver</span>
                    </div>
                    {turnActions.maneuver ? (
                        <CheckCircle2 size={18} />
                    ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                    )}
                </button>

                <button
                    onClick={() => tokenId && toggleAction(tokenId, 'move')}
                    className={`flex items-center justify-between p-3 rounded border transition-colors disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ${
                        turnActions.move
                            ? 'bg-emerald-900/40 border-emerald-600 text-emerald-400'
                            : 'bg-slate-700 border-slate-600 text-slate-300 enabled:hover:bg-slate-600'
                    }`}
                    disabled={!isMyTurn}
                >
                    <div className="flex items-center gap-2">
                        <Footprints
                            size={16}
                            className={turnActions.move ? 'text-emerald-400' : 'text-cyan-400'}
                        />
                        <span className="font-semibold">Movement</span>
                    </div>
                    {turnActions.move ? (
                        <CheckCircle2 size={18} />
                    ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                    )}
                </button>

                <button
                    onClick={() => tokenId && toggleAction(tokenId, 'triggered')}
                    className={`flex items-center justify-between p-3 rounded border transition-colors disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ${
                        turnActions.triggered
                            ? 'bg-emerald-900/40 border-emerald-600 text-emerald-400'
                            : 'bg-slate-700 border-slate-600 text-slate-300 enabled:hover:bg-slate-600'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Activity
                            size={16}
                            className={turnActions.triggered ? 'text-emerald-400' : 'text-amber-400'}
                        />
                        <span className="font-semibold">Triggered Action</span>
                    </div>
                    {turnActions.triggered ? (
                        <CheckCircle2 size={18} />
                    ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                    )}
                </button>
            </div>
        </div>
    );
}