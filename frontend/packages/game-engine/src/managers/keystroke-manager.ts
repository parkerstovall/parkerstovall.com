export class KeystrokeManager {
  private readonly pressedKeys = new Set<string>()

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

  has(...keys: string[]) {
    return keys.some((k) => this.pressedKeys.has(k.toLowerCase()))
  }
}
