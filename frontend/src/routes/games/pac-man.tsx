import { createFileRoute } from '@tanstack/react-router'
import { PacMan } from 'pac-man-phaser'

export const Route = createFileRoute('/games/pac-man')({
  component: PacManGame,
})

function PacManGame() {
  return <PacMan />
}
