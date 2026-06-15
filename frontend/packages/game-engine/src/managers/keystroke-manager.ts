export class KeystrokeManager {
  public readonly pressedKeys = new Set<string>()

  constructor() {
    document.addEventListener('keypress', (e) => {
      if (e.repeat) {
        return
      }

      this.pressedKeys.add(e.key.toLowerCase())
    })

    document.addEventListener('keyup', (e) => {
      this.pressedKeys.delete(e.key.toLowerCase())
    })
  }
}
