import { Link, createFileRoute } from '@tanstack/react-router'
import { startMustachio } from '@parkerstovall.com/mustachio'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/games/mustachio')({
  component: MustachioGame,
})

function MustachioGame() {
  const hasStarted = useRef(false)
  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    startMustachio('game-container')
  }, [])

  return (
    <main className="site-page">
      <section className="surface-card" style={{ padding: '1.2rem 1.2rem 1.5rem' }}>
        <Link className="inline-link" to="/">
          Back to home
        </Link>
        <h1 className="section-title" style={{ marginTop: '0.75rem' }}>
          Mustachio
        </h1>
        <p className="section-text" style={{ marginBottom: '1rem' }}>
          Welcome to the Mustachio game.
        </p>
        <div
          style={{
            width: 'min(64vw, 1100px)',
            minHeight: '320px',
            height: 'min(36vw, 620px)',
            margin: '0 auto',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(16, 32, 54, 0.15)',
            background: '#f3f5f9',
          }}
          id="game-container"
        ></div>
      </section>
    </main>
  )
}
