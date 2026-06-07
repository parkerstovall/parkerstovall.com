export class ScoreDisplay extends Phaser.GameObjects.Text {
    score = 0;
    constructor(scene, x, y) {
        super(scene, x, y, 'Score: 0', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
        });
        scene.add.existing(this);
    }
    addPoints(points) {
        this.score += points;
        this.setText(`Score: ${this.score}`);
    }
    getScore() {
        return this.score;
    }
}
