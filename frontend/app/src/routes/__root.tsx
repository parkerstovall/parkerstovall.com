import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="site-shell">
      <header className="site-nav-wrap">
        <nav className="site-nav" aria-label="Primary">
          <Link to="/" className="site-nav-link">
            Home
          </Link>
          <Link
            href="https://github.com/parkerstovall"
            to="/"
            className="site-nav-link"
          >
            GitHub
          </Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
})
