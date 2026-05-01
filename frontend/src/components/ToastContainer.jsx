export default function ToastContainer({ toasts }) {
  const colors = { info:'#4f8cff', success:'#00e5c3', error:'#ff5f6d', warning:'#fbbf24' }
  const icons  = { info:'ℹ️', success:'✅', error:'❌', warning:'⚠️' }

  return (
    <div id="toast-container">
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--surface)',
          border: `1px solid ${colors[t.type]}33`,
          borderLeft: `3px solid ${colors[t.type]}`,
          padding: '0.8rem 1.2rem', borderRadius: '10px',
          fontSize: '0.88rem', color: 'var(--text)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'fadeUp 0.3s ease',
          minWidth: '240px', maxWidth: '340px',
        }}>
          <span>{icons[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}
