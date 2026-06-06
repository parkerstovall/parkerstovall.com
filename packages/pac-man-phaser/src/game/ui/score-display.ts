export class ScoreDisplay extends Phaser.GameObjects.Text {
  private score: number = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'Score: 0', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
    })
    scene.add.existing(this)
  }

  public addPoints(points: number) {
    this.score += points
    this.setText(`Score: ${this.score}`)
  }

  public getScore() {
    return this.score
  }
}
