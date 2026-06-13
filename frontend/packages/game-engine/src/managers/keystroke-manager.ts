export class KeystrokeManager {
  private readonly keyDownEvents: Map<string, (() => void)[]> = new Map()
  private readonly keyUpEvents: Map<string, (() => void)[]> = new Map()

  constructor() {
    document.addEventListener('keypress', (e) => {
      if (e.repeat) {
        return
      }

      const events = this.keyDownEvents.get(e.key.toLowerCase())
      if (!events?.length) {
        return
      }

      for (const event of events) {
        event()
      }
    })

    document.addEventListener('keyup', (e) => {
      if (e.repeat) {
        return
      }

      const events = this.keyUpEvents.get(e.key.toLowerCase())
      if (!events?.length) {
        return
      }

      for (const event of events) {
        event()
      }
    })
  }

  public addKeyEvent(type: 'down' | 'up', key: string, action: () => void) {
    const normalizedKey = key.toLowerCase()
    const eventMap = type === 'down' ? this.keyDownEvents : this.keyUpEvents
    const events = eventMap.get(normalizedKey) ?? []
    events.push(action)
    eventMap.set(normalizedKey, events)
  }

  public removeKeyEvent(type: 'down' | 'up', key: string, action: () => void) {
    const normalizedKey = key.toLowerCase()
    const eventMap = type === 'down' ? this.keyDownEvents : this.keyUpEvents
    const events = eventMap.get(normalizedKey) ?? []
    const index = events.indexOf(action)
    if (index > -1) {
      events.splice(index, 1)
    }

    eventMap.set(normalizedKey, events)
  }
}
