type GameOverData = {
  score: number
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' })
  }

  create({ score }: GameOverData) {
    const { width, height } = this.scale

    this.add
      .text(width / 2, height / 2 - 40, 'Game Over!', {
        fontSize: '32px',
        color: '#fff',
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000',
          blur: 10,
          fill: true,
        },
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, height / 2, `Final Score: ${score}`, {
        fontSize: '32px',
        color: '#fff',
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000',
          blur: 10,
          fill: true,
        },
      })
      .setOrigin(0.5)

    const restart = () => {
      this.scene.stop() // Stop GameOverScene

      // Get reference to PacManScene and restart it
      const pacManScene = this.scene.get('PacManScene')
      if (pacManScene) {
        pacManScene.scene.restart() // This creates a fresh instance
      }
    }

    this.add
      .text(width / 2, height / 2 + 40, 'Restart', {
        fontSize: '24px',
        color: '#fff',
        padding: { x: 10, y: 5 },
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000',
          blur: 10,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', restart)
  }
}
