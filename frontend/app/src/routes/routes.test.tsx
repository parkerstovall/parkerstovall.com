import { render, screen } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'

vi.mock('@parkerstovall.com/mustachio', () => ({
  startMustachio: vi.fn(),
}))

vi.mock('@parkerstovall.com/pac-man', () => ({
  PacMan: () => <div data-testid="pac-man-component">Pac-Man Component</div>,
}))

import { startMustachio } from '@parkerstovall.com/mustachio'
import { routeTree } from '../routeTree.gen'

function renderAt(pathname: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [pathname],
    }),
  })

  return render(<RouterProvider router={router} />)
}

describe('app routes', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the home route links', async () => {
    renderAt('/')

    expect(await screen.findByText('Parker Stovall')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Mustachio' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Pac-Man' })).toBeTruthy()
  })

  it('renders pac-man route with pac-man wrapper component', async () => {
    renderAt('/games/pac-man')

    expect(await screen.findByTestId('pac-man-component')).toBeTruthy()
  })

  it('renders mustachio route and calls startMustachio', async () => {
    renderAt('/games/mustachio')

    expect(await screen.findByText('Mustachio')).toBeTruthy()
    expect(startMustachio).toHaveBeenCalledWith('game-container')
  })
})
