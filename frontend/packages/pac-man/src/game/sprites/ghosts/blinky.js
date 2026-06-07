import {} from '@parkerstovall.com/pac-man-map-generator';
import { Ghost } from './ghost';
import { Character } from '../characters/character';
import { directions } from '../../constants';
export class Blinky extends Ghost {
    pelletCountToLeaveHouse = 0;
    timerToLeaveHouse = 0; // milliseconds
    randomId = Math.random().toString(36).substring(2, 15);
    constructor(scene, gameMap, pacman, scatterTarget) {
        const x = 14 * 32;
        const y = 11 * 32 + 16;
        super(scene, gameMap, x, y, scatterTarget, pacman, 'blinky', [
            directions.UP,
            directions.RIGHT,
            directions.DOWN,
            directions.LEFT,
        ]);
        this.setStartTimer();
        this.setFrame('blinky-left');
    }
    // Blinky always chases Pac-Man directly
    onCenter() {
        this.target = this.pacman.gridPosition;
        super.onCenter();
    }
}
