import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/games/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Link to="/games/mustachio">Mustachio</Link>
      <br />
      <Link to="/games/pac-man">Pac-Man</Link>
    </div>
  )
}
