import { createFileRoute } from '@tanstack/react-router'
import { startMustachio } from 'mustachio-game'
import { useEffect } from 'react'

export const Route = createFileRoute('/games/mustachio')({
  component: MustachioGame,
})

let gameStarted = false
function MustachioGame() {
  useEffect(() => {
    if (gameStarted) return
    gameStarted = true
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
