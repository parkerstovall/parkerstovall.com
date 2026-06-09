import { Link, createFileRoute } from '@tanstack/react-router'
import { PacMan } from '@parkerstovall.com/pac-man'

export const Route = createFileRoute('/games/pac-man')({
  component: PacManGame,
})

function PacManGame() {
  return (
    <main className="site-page">
      <section className="surface-card" style={{ padding: '1.2rem 1.2rem 1rem' }}>
        <Link className="inline-link" to="/">
          Back to home
        </Link>
        <h1 className="section-title" style={{ marginTop: '0.75rem' }}>
          Pac-Man
        </h1>
        <p className="section-text">Classic maze gameplay, playable in-browser.</p>
      </section>
      <section
        className="surface-card"
        style={{
          marginTop: '1rem',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            border: '1px solid rgba(16, 32, 54, 0.15)',
            borderRadius: '12px',
            background: '#f8fafc',
            padding: '0.5rem',
          }}
        >
          <PacMan />
        </div>
      </section>
    </main>
  )
}
