import './StatusBadge.css'

export default function StatusBadge({ status }) {
  return (
    <div className={`status-badge status-badge--${status}`} role="status" aria-label={`Status: ${status}`}>
      <span className="status-dot" aria-hidden="true" />
      <span>{status}</span>
    </div>
  )
}
