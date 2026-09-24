"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJam } from "@/hooks/use-jam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { JamMode, JamSettings, JamState } from "@/lib/jam-types";
import { endJam, joinJam, leaveJam, respondToJoinRequest, sendJamCommand, startJam } from "@/lib/jam";


const MODES: { mode: JamMode; title: string; description: string }[] = [
    { mode: "EVERYONE_PLAYS", title: "Everyone plays", description: "Every device plays the music in sync" },
    { mode: "HOST_SPEAKER", title: "One speaker", description: "Only the host plays, friends control the queue" },
];

const GUEST_SETTINGS: { key: keyof JamSettings; label: string }[] = [
    { key: "guestsCanControlPlayback", label: "Guests can play, pause and skip" },
    { key: "guestsCanAddSongs", label: "Guests can add songs" },
    { key: "guestsCanReorderAndRemove", label: "Guests can reorder and remove songs" },
    { key: "endWhenHostLeaves", label: "End the Jam when the host leaves" },
];

const ModePicker = ({ value, onChange, disabled }: { value: JamMode; onChange: (mode: JamMode) => void; disabled?: boolean }) => (
    <div className="grid sm:grid-cols-2 gap-3 w-full">
        {
            MODES.map((option) => (
                <button
                    key={option.mode}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(option.mode)}
                    className={cn(
                        "text-left rounded-2xl border p-4 transition-colors disabled:cursor-not-allowed",
                        value === option.mode ? "border-red-500 bg-red-500/10" : "border-neutral-800 bg-neutral-900 hover:bg-neutral-800/60"
                    )}
                >
                    <p className="font-semibold text-zinc-100">{option.title}</p>
                    <p className="text-sm text-zinc-400">{option.description}</p>
                </button>
            ))
        }
    </div>
);

const StartOrJoin = () => {
    const searchParams = useSearchParams();
    const pendingCode = useJam((state) => state.pendingCode);
    const setPendingCode = useJam((state) => state.setPendingCode);
    const [mode, setMode] = useState<JamMode>("EVERYONE_PLAYS");
    const [code, setCode] = useState((searchParams.get("code") ?? "").toUpperCase().slice(0, 6));
    const [busy, setBusy] = useState<"start" | "join" | null>(null);

    const run = async (kind: "start" | "join") => {
        setBusy(kind);
        if (kind === "start") await startJam(mode);
        else await joinJam(code);
        setBusy(null);
    };

    if (pendingCode) {
        return (
            <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-semibold">Waiting for the host to let you in</p>
                <p className="text-zinc-400 text-sm">Jam code {pendingCode}</p>
                <Button size="sm" variant="secondary" className="rounded-full" onClick={() => setPendingCode(null)}>Cancel</Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-10">
            <div className="space-y-3">
                <h2 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">Join a Jam</h2>
                <div className="flex gap-3">
                    <Input
                        value={code}
                        onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                        placeholder="Enter code"
                        className="tracking-widest font-bold uppercase"
                    />
                    <Button className="rounded-full" disabled={code.length < 6 || busy !== null} onClick={() => run("join")}>
                        {busy === "join" ? "Joining" : "Join"}
                    </Button>
                </div>
            </div>
            <div className="space-y-3">
                <h2 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">Start a Jam</h2>
                <ModePicker value={mode} onChange={setMode} />
                <div className="flex justify-center pt-2">
                    <Button className="rounded-full px-8" disabled={busy !== null} onClick={() => run("start")}>
                        {busy === "start" ? "Starting" : "Start Jam"}
                    </Button>
                </div>
                <p className="text-center text-sm text-zinc-500">Your current queue becomes the Jam queue.</p>
            </div>
        </div>
    );
};

const ActiveJam = ({ state }: { state: JamState }) => {
    const userId = useJam((store) => store.userId);
    const joinRequests = useJam((store) => store.joinRequests);
    const isHost = state.hostId === userId;
    const settings = state.settings;
    const current = state.queue[state.currentIndex];
    const requests = isHost
        ? [...state.pending.map((member) => ({ userId: member.userId, name: member.name })),
            ...joinRequests.filter((request) => !state.pending.some((member) => member.userId === request.userId))]
        : [];

    const updateSettings = (patch: Partial<JamSettings>) => {
        sendJamCommand({ type: "UPDATE_SETTINGS", settings: patch });
    };

    const share = async () => {
        const url = `${window.location.origin}/listen-with-friends?code=${state.code}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: "Join my Jam", url });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success("Invite link copied");
            }
        } catch {
            return;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-10">
            <div className="flex flex-col items-center gap-3">
                <p className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">Jam code</p>
                <p className="text-5xl font-extrabold tracking-[0.4em]">{state.code}</p>
                <p className="text-sm text-zinc-400">
                    {settings.mode === "HOST_SPEAKER" ? "One speaker" : "Everyone plays"} · {state.members.length} of {settings.maxMembers} listening
                </p>
                {current && (
                    <p className="text-zinc-300 text-sm">
                        {state.playback.status === "playing" ? "Now playing" : "Paused"}: <span className="font-semibold text-white">{current.song.name}</span>
                    </p>
                )}
                <div className="flex gap-3 pt-2">
                    <Button size="sm" className="rounded-full" onClick={share}>Invite friends</Button>
                    <Button size="sm" variant="secondary" className="rounded-full" onClick={() => leaveJam()}>Leave</Button>
                    {isHost && (
                        <Button size="sm" variant="secondary" className="rounded-full text-red-400" onClick={() => endJam()}>End for everyone</Button>
                    )}
                </div>
            </div>

            {requests.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">Waiting to join</h2>
                    {requests.map((request) => (
                        <div key={request.userId} className="flex items-center gap-3 rounded-xl bg-neutral-900 px-4 py-3">
                            <p className="flex-1 font-medium">{request.name}</p>
                            <Button size="sm" className="rounded-full" onClick={() => respondToJoinRequest(request.userId, true)}>Let in</Button>
                            <Button size="sm" variant="secondary" className="rounded-full" onClick={() => respondToJoinRequest(request.userId, false)}>Decline</Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">
                    {isHost ? "Settings" : "Settings (host only)"}
                </h2>
                <ModePicker value={settings.mode} disabled={!isHost} onChange={(mode) => updateSettings({ mode })} />
                <label className="flex items-center justify-between gap-4">
                    <span className="text-zinc-200">Ask me before people join</span>
                    <Switch
                        checked={settings.joinApproval === "HOST_APPROVES"}
                        disabled={!isHost}
                        onCheckedChange={(value) => updateSettings({ joinApproval: value ? "HOST_APPROVES" : "OPEN" })}
                    />
                </label>
                {GUEST_SETTINGS.map((setting) => (
                    <label key={setting.key} className="flex items-center justify-between gap-4">
                        <span className="text-zinc-200">{setting.label}</span>
                        <Switch
                            checked={Boolean(settings[setting.key])}
                            disabled={!isHost}
                            onCheckedChange={(value) => updateSettings({ [setting.key]: value })}
                        />
                    </label>
                ))}
                <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-200">Maximum people</span>
                    <div className="flex items-center gap-3">
                        <Button size="sm" variant="secondary" className="rounded-full" disabled={!isHost} onClick={() => updateSettings({ maxMembers: settings.maxMembers - 1 })}>-</Button>
                        <span className="w-6 text-center font-bold">{settings.maxMembers}</span>
                        <Button size="sm" variant="secondary" className="rounded-full" disabled={!isHost} onClick={() => updateSettings({ maxMembers: settings.maxMembers + 1 })}>+</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const JamCard = () => {
    const state = useJam((store) => store.state);

    return (
        <div className="w-full overflow-hidden relative bg-gradient-to-b from-neutral-950/80 bg-neutral-900/60 max-w-4xl mx-auto rounded-3xl">
            <div className="w-full p-6 space-y-10 z-10 relative">
                <div className="pt-10 space-y-4">
                    <h1 className="text-center text-xl font-semibold md:text-4xl select-none">Jam</h1>
                    <p className="max-w-xl w-full text-center text-zinc-300 mx-auto select-none">
                        Listen together in real time. Everyone in the Jam can add songs, and playback stays in sync across phones and the web.
                    </p>
                </div>
                {state ? <ActiveJam state={state} /> : <StartOrJoin />}
            </div>
            <div className="absolute top-0 right-0">
                <div className="p-4 flex items-center justify-center gap-x-2">
                    <div className={cn("size-3 animate-pulse bg-neutral-500 rounded-full", state && "bg-green-500")} />
                    <h4 className="text-sm font-medium text-zinc-300 select-none">{state ? "In a Jam" : "Not in a Jam"}</h4>
                </div>
            </div>
        </div>
    );
}
