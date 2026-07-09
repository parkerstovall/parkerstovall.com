import { Link, createFileRoute } from '@tanstack/react-router'
import { MazeGameScene } from '@parkerstovall.com/maze-game'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/games/maze-game')({
  component: MazeGame,
})

function MazeGame() {
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    MazeGameScene()
  }, [])

  return (
    <main className="site-page">
      <section
        className="surface-card"
        style={{ padding: '1.2rem 1.2rem 1rem' }}
      >
        <Link className="inline-link" to="/">
          Back to home
        </Link>
        <h1 className="section-title" style={{ marginTop: '0.75rem' }}>
          Maze Game
        </h1>
        <p className="section-text" style={{ marginBottom: '1rem' }}>
          Reach the target before the timer runs out. WASD to move, 'Q' to turn
          left, 'E' to turn right
        </p>
        <div
          id="game"
          style={{
            margin: '0 auto',
            width: '100%',
            paddingTop: '62.5%',
            border: '1px solid rgba(16, 32, 54, 0.15)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#f8fafc',
          }}
        ></div>
      </section>
    </main>
  )
}
