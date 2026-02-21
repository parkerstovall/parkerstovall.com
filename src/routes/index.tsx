import { createFileRoute, Link } from '@tanstack/react-router'
import '../App.css'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Parker Stovall</h1>
        <p>Welcome! Check out my games below.</p>
        <nav
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Link className="App-link" to="/games/mustachio">
            Mustachio
          </Link>
          <Link className="App-link" to="/games/pac-man">
            Pac-Man
          </Link>
        </nav>
      </header>
    </div>
  )
}
