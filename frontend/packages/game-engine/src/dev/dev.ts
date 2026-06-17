import { Engine } from '../engine'
import { devScene } from './dev-scene'

document.addEventListener('DOMContentLoaded', () => {
  const engine = new Engine()
  engine.setScene(devScene)
})
