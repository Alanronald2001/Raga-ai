import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Button } from '@raga/shared-ui';
import clsx from 'clsx';
function makeNote(text) {
    return {
        id: `note_${Date.now()}`,
        text,
        timestamp: new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        author: 'Dr. Current User',
    };
}
export default function NotesTab({ patient: p }) {
    const [notes, setNotes] = useState(() => (p.notes ? [makeNote(p.notes)] : []));
    const [draft, setDraft] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const handleSave = useCallback(async () => {
        if (!draft.trim())
            return;
        setSaving(true);
        // Simulate async save
        await new Promise(r => setTimeout(r, 600));
        setNotes(prev => [makeNote(draft.trim()), ...prev]);
        setDraft('');
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }, [draft]);
    const handleDelete = useCallback((id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    }, []);
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Add Note" }), _jsx("textarea", { value: draft, onChange: e => setDraft(e.target.value), placeholder: "Enter clinical note, observation, or update\u2026", rows: 4, className: clsx('w-full text-sm text-slate-700 placeholder:text-slate-300', 'bg-slate-50 border border-slate-200 rounded-xl px-4 py-3', 'resize-none outline-none', 'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400', 'transition-colors duration-150') }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: clsx('text-xs transition-opacity duration-300', saved ? 'text-emerald-600 opacity-100' : 'opacity-0'), children: "\u2713 Note saved" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-xs text-slate-400 tabular-nums", children: [draft.length, " chars"] }), _jsx(Button, { variant: "primary", size: "sm", loading: saving, disabled: !draft.trim() || saving, onClick: handleSave, children: "Save Note" })] })] })] }), notes.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center\n                        py-10 gap-2 text-slate-400 select-none", children: [_jsx("span", { className: "text-3xl", children: "\uD83D\uDCDD" }), _jsx("p", { className: "text-sm text-slate-500 font-medium", children: "No notes yet" }), _jsxs("p", { className: "text-xs", children: ["Add the first note for ", p.name, " above."] })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsxs("h3", { className: "text-xs font-semibold text-slate-700", children: [notes.length, " note", notes.length !== 1 ? 's' : ''] }), notes.map(note => (_jsxs("div", { className: "group relative bg-slate-50 hover:bg-white\n                         border border-transparent hover:border-slate-100\n                         hover:shadow-sm rounded-xl px-4 py-3.5\n                         transition-all duration-150", children: [_jsx("p", { className: "text-xs text-slate-700 leading-relaxed\n                            whitespace-pre-wrap", children: note.text }), _jsxs("div", { className: "flex items-center justify-between mt-2.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-4 w-4 rounded-full bg-indigo-100\n                                  flex items-center justify-center\n                                  text-[8px] font-bold text-indigo-700", children: note.author[3] }), _jsxs("span", { className: "text-[10px] text-slate-400", children: [note.author, " \u00B7 ", note.timestamp] })] }), _jsx("button", { onClick: () => handleDelete(note.id), "aria-label": "Delete note", className: "opacity-0 group-hover:opacity-100\n                             p-1 rounded text-slate-300\n                             hover:text-red-500 hover:bg-red-50\n                             transition-all duration-150", children: _jsx(TrashIcon, {}) })] })] }, note.id)))] }))] }));
}
const TrashIcon = () => (_jsx("svg", { viewBox: "0 0 16 16", fill: "currentColor", className: "w-3.5 h-3.5", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815\n         8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0\n         001.493-1.35l.815-8.15h.3a.75.75 0\n         000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25\n         2.25 0 005 3.25zm2.25-.75a.75.75 0\n         00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05\n         6a.75.75 0 01.787.713l.275 5.5a.75.75 0\n         01-1.498.075l-.275-5.5A.75.75 0 016.05\n         6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75\n         0 01-1.498-.075l.275-5.5A.75.75 0 019.95 6z" }) }));
