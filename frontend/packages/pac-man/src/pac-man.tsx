import { useEffect, useRef } from 'react'
import { createPacManScene } from './game/_scenes/pac-man-scene'

export function PacMan() {
  const container = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (gameRef.current || !container.current) {
      return
    }

    gameRef.current = createPacManScene(container.current)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div style={{ width: '448px', height: '496px' }} ref={container}></div>
}
