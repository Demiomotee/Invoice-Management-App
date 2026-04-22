interface Props {
  status: 'paid' | 'pending' | 'draft'
}

const styles = {
  paid:    { bg: 'rgba(51,214,159,0.1)',  color: '#33D69F' },
  pending: { bg: 'rgba(255,143,0,0.1)',   color: '#FF8F00' },
  draft:   { bg: 'rgba(223,227,250,0.5)',    color: '#373B53' },
}

export default function StatusBadge({ status }: Props) {
  const s = styles[status]
  return (
    <div
      style={{ backgroundColor: s.bg, color: s.color }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs capitalize"
      role="status"
      aria-label={`Status: ${status}`}
    >
      <span style={{ backgroundColor: s.color }} className="w-2 h-2 rounded-full" aria-hidden="true" />
      {status}
    </div>
  )
}
