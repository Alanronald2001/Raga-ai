import { useState, useCallback } from 'react'
import { Button } from '@raga/shared-ui'
import type { Patient } from '@raga/shared-types'
import clsx from 'clsx'

interface Props {
  patient: Patient
}

interface NoteEntry {
  id: string
  text: string
  timestamp: string
  author: string
}

function makeNote(text: string): NoteEntry {
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
  }
}

export default function NotesTab({ patient: p }: Props) {
  const [notes, setNotes] = useState<NoteEntry[]>(() => (p.notes ? [makeNote(p.notes)] : []))
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = useCallback(async () => {
    if (!draft.trim()) return
    setSaving(true)
    // Simulate async save
    await new Promise(r => setTimeout(r, 600))
    setNotes(prev => [makeNote(draft.trim()), ...prev])
    setDraft('')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [draft])

  const handleDelete = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <div className="space-y-5">
      {/* Compose area */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Add Note</label>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Enter clinical note, observation, or update…"
          rows={4}
          className={clsx(
            'w-full text-sm text-slate-700 placeholder:text-slate-300',
            'bg-slate-50 border border-slate-200 rounded-xl px-4 py-3',
            'resize-none outline-none',
            'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400',
            'transition-colors duration-150'
          )}
        />
        <div className="flex items-center justify-between">
          <span
            className={clsx(
              'text-xs transition-opacity duration-300',
              saved ? 'text-emerald-600 opacity-100' : 'opacity-0'
            )}
          >
            ✓ Note saved
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 tabular-nums">{draft.length} chars</span>
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              disabled={!draft.trim() || saving}
              onClick={handleSave}
            >
              Save Note
            </Button>
          </div>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center
                        py-10 gap-2 text-slate-400 select-none"
        >
          <span className="text-3xl">📝</span>
          <p className="text-sm text-slate-500 font-medium">No notes yet</p>
          <p className="text-xs">Add the first note for {p.name} above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-700">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </h3>
          {notes.map(note => (
            <div
              key={note.id}
              className="group relative bg-slate-50 hover:bg-white
                         border border-transparent hover:border-slate-100
                         hover:shadow-sm rounded-xl px-4 py-3.5
                         transition-all duration-150"
            >
              <p
                className="text-xs text-slate-700 leading-relaxed
                            whitespace-pre-wrap"
              >
                {note.text}
              </p>
              <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full bg-indigo-100
                                  flex items-center justify-center
                                  text-[8px] font-bold text-indigo-700"
                  >
                    {note.author[3]}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {note.author} · {note.timestamp}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  aria-label="Delete note"
                  className="opacity-0 group-hover:opacity-100
                             p-1 rounded text-slate-300
                             hover:text-red-500 hover:bg-red-50
                             transition-all duration-150"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815
         8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0
         001.493-1.35l.815-8.15h.3a.75.75 0
         000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25
         2.25 0 005 3.25zm2.25-.75a.75.75 0
         00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05
         6a.75.75 0 01.787.713l.275 5.5a.75.75 0
         01-1.498.075l-.275-5.5A.75.75 0 016.05
         6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75
         0 01-1.498-.075l.275-5.5A.75.75 0 019.95 6z"
    />
  </svg>
)
