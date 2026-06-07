import { createFileRoute } from '@tanstack/react-router'
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
    <div>
      <h1>Mustachio</h1>
      <p>Welcome to the Mustachio game!</p>
      <div
        style={{ height: '36vw', width: '64vw', margin: 'auto' }}
        id="game-container"
      ></div>
    </div>
  )
}
