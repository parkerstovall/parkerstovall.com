import type { Engine } from '../engine'
import type { Color } from '../rendering'
import type { Transform } from '../types'
import { TextObject } from './text-object'

export class TimerObject extends TextObject {
  private time: number
  private remaining: number
  private prefix: string
  private isDone: boolean = false
  private readonly onComplete?: () => void

  constructor(
    engine: Engine,
    transform: Transform,
    time: number,
    onComplete?: () => void,
    prefix: string = 'Time: ',
    color: Color = { r: 255, g: 255, b: 255 },
    alignment: 'center' | 'left' | 'right' = 'left',
    font: string = '24px serif',
  ) {
    super(engine, transform, prefix, color, alignment, font)
    this.time = time
    this.remaining = time
    this.prefix = prefix
    this.onComplete = onComplete
    this.formatTime()
  }

  update(): void {
    if (this.isDone || !this.isActive) {
      return
    }

    this.remaining -= this.engine.deltaTime
    this.formatTime()

    if (Math.floor(this.remaining) <= 0) {
      this.isDone = true
      this.onComplete?.()
      return
    }
  }

  resetTimer() {
    this.remaining = this.time
  }

  setTime(time: number) {
    this.time = time
    this.remaining = time
  }

  pause() {
    this.isActive = false
  }

  start() {
    this.isActive = true
  }

  private formatTime() {
    const minutes = Math.floor(this.remaining / 60)
    const minStr = minutes < 10 ? `0${minutes}` : minutes.toLocaleString()

    const seconds = Math.floor(this.remaining % 60)
    const secStr = seconds < 10 ? `0${seconds}` : seconds.toLocaleString()
    this.texture.setText(`${this.prefix}${minStr}:${secStr}`)
  }
}
