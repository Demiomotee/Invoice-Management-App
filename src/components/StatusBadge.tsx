interface Props {
  status: 'paid' | 'pending' | 'draft'
}

const config = {
  paid: {
    dot: 'bg-[#33D69F]',
    text: 'text-[#33D69F]',
    bg: 'bg-[#33D69F]/10',
  },
  pending: {
    dot: 'bg-[#FF8F00]',
    text: 'text-[#FF8F00]',
    bg: 'bg-[#FF8F00]/10',
  },
  draft: {
    dot: 'bg-[#373B53] dark:bg-gray-1',
    text: 'text-[#373B53] dark:text-gray-1',
    bg: 'bg-[#373B53]/10 dark:bg-gray-1/10',
  },
}

export default function StatusBadge({ status }: Props) {
  const c = config[status]
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs capitalize ${c.bg} ${c.text}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot}`} aria-hidden="true" />
      {status}
    </div>
  )
}
