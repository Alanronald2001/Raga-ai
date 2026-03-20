interface DateRange {
  from: string
  to: string
}
interface Props {
  value: DateRange
  onChange: (r: DateRange) => void
}

export default function DateRangePicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-xs text-slate-500 font-medium">From</label>
      <input
        type="date"
        value={value.from}
        max={value.to}
        onChange={e => onChange({ ...value, from: e.target.value })}
        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5
                   text-slate-700 bg-white focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      />
      <label className="text-xs text-slate-500 font-medium">To</label>
      <input
        type="date"
        value={value.to}
        min={value.from}
        onChange={e => onChange({ ...value, to: e.target.value })}
        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5
                   text-slate-700 bg-white focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      />
    </div>
  )
}
