import { Item } from './abstracts/item';
export class Pellet extends Item {
    points = 10;
    constructor(scene, x, y) {
        super(scene, x, y, 12, 'pellet');
    }
    static addPelletGraphics(scene) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(0xffffff, 1); // white pellet
        graphics.fillCircle(4, 4, 4); // 4 radius
        graphics.generateTexture('pellet', 8, 8);
        graphics.destroy();
    }
}
