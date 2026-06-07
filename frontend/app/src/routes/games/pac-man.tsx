import { createFileRoute } from '@tanstack/react-router'
import { PacMan } from '@parkerstovall.com/pac-man'

export const Route = createFileRoute('/games/pac-man')({
  component: PacManGame,
})

function PacManGame() {
  return <PacMan />
}
