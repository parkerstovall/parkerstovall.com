import { MobileControls } from './MobileControls'

describe('MobileControls', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('creates overlay controls and toggles directional state on pointer events', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const controls = new MobileControls(container)

    const left = document.querySelector('[aria-label="◀"]') as HTMLElement
    expect(left).toBeTruthy()

    left.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(controls.left).toBe(true)

    left.dispatchEvent(new Event('pointerup', { bubbles: true }))
    expect(controls.left).toBe(false)

    controls.destroy()
  })

  it('consumeFlag reads and clears one-shot flags', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const controls = new MobileControls(container)
    const jump = document.querySelector('[aria-label="▲"]') as HTMLElement

    jump.dispatchEvent(new Event('pointerdown', { bubbles: true }))

    expect(controls.consumeFlag('jumpPending')).toBe(true)
    expect(controls.consumeFlag('jumpPending')).toBe(false)

    controls.destroy()
  })

  it('sets container position to relative when initially static', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const controls = new MobileControls(container)

    expect(container.style.position).toBe('relative')

    controls.destroy()
  })
})
