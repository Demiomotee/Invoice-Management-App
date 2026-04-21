interface Props {
  status: 'paid' | 'pending' | 'draft'
}

export default function StatusBadge({ status }: Props) {
  const styles = {
    paid: {
      bg: 'rgba(51, 214, 159, 0.1)',
      color: '#33D69F',
    },
    pending: {
      bg: 'rgba(255, 143, 0, 0.1)',
      color: '#FF8F00',
    },
    draft: {
      bg: 'rgba(55, 59, 83, 0.1)',
      color: '#373B53',
    },
  }

  const s = styles[status]

  return (
    <div
      style={{ backgroundColor: s.bg, color: s.color }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs capitalize"
      role="status"
      aria-label={`Status: ${status}`}
    >
      <span
        style={{ backgroundColor: s.color }}
        className="w-2 h-2 rounded-full"
        aria-hidden="true"
      />
      {status}
    </div>
  )
}
