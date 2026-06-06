export class PauseMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseMenu' })
  }

  create() {
    const { width, height } = this.scale

    this.add
      .text(width / 2, height / 2 - 40, 'Game Paused', {
        fontSize: '32px',
        color: '#fff',
      })
      .setOrigin(0.5)

    const resumeButton = this.add
      .text(width / 2, height / 2, 'Resume', {
        fontSize: '24px',
        color: '#0f0',
      })
      .setOrigin(0.5)
      .setInteractive()

    const resume = () => {
      this.scene.stop() // close pause menu
      this.scene.resume('PacManScene') // resume game
    }

    resumeButton.on('pointerdown', resume)
    this.input.keyboard?.on('keydown-P', resume)
  }
}
