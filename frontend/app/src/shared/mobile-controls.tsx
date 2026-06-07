export function MobileControls() {
  // The buttons just translate to keydowns
  const onTouchStart = (key: string) => {
    const event = new KeyboardEvent('keydown', { key })
    window.dispatchEvent(event)
  }

  const onTouchEnd = (key: string) => {
    const event = new KeyboardEvent('keyup', { key })
    window.dispatchEvent(event)
  }

  return (
    <div className="mobile-controls">
      <button
        onTouchStart={() => onTouchStart('ArrowLeft')}
        onTouchEnd={() => onTouchEnd('ArrowLeft')}
        className="left"
      ></button>
      <button
        onTouchStart={() => onTouchStart('ArrowRight')}
        onTouchEnd={() => onTouchEnd('ArrowRight')}
        className="right"
      ></button>
      <button
        onTouchStart={() => onTouchStart('ArrowUp')}
        onTouchEnd={() => onTouchEnd('ArrowUp')}
        className="jump"
      ></button>
      <button
        onTouchStart={() => {
          onTouchStart(' ')
          onTouchStart('ArrowDown')
        }}
        onTouchEnd={() => {
          onTouchEnd(' ')
          onTouchEnd('ArrowDown')
        }}
        className="fire"
      ></button>
    </div>
  )
}
