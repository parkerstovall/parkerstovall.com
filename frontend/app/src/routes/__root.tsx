import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect, useRef, useState } from 'react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) {
        return
      }

      const target = event.target
      if (!(target instanceof Node)) {
        return
      }

      if (!menuRef.current.contains(target)) {
        setIsUtilitiesOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [])

  return (
    <div className="site-shell">
      <header className="site-nav-wrap">
        <nav className="site-nav" aria-label="Primary">
          <Link to="/" className="site-nav-link">
            Home
          </Link>
          <div
            ref={menuRef}
            className={`site-nav-menu${isUtilitiesOpen ? ' is-open' : ''}`}
          >
            <button
              type="button"
              className="site-nav-link site-nav-summary"
              aria-haspopup="menu"
              aria-expanded={isUtilitiesOpen}
              aria-controls="utilities-menu"
              onClick={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
            >
              Utilities
            </button>
            <div id="utilities-menu" className="site-nav-dropdown" role="menu">
              <Link
                to="/utilities/qr-code-generator"
                className="site-nav-dropdown-link"
                role="menuitem"
                onClick={() => setIsUtilitiesOpen(false)}
              >
                QR Code Generator
              </Link>
            </div>
          </div>
          <a
            href="https://github.com/parkerstovall"
            target="_blank"
            rel="noreferrer"
            className="site-nav-link"
          >
            GitHub
          </a>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
}
