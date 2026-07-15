import { vi, describe, it, expect, afterEach } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
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

vi.mock('@parkerstovall.com/maze-game', () => ({
  MazeGameScene: vi.fn(),
}))

import { startMustachio } from '@parkerstovall.com/mustachio'
import { MazeGameScene } from '@parkerstovall.com/maze-game'
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
    cleanup()
  })

  it('renders the home route links', async () => {
    renderAt('/')

    expect(await screen.findByText('Parker Stovall')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Mustachio' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Pac-Man' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Maze Game' })).toBeTruthy()
  })

  it('renders pac-man route with pac-man wrapper component', async () => {
    renderAt('/games/pac-man')

    expect(await screen.findByTestId('pac-man-component')).toBeTruthy()
  })

  it('renders mustachio route and calls startMustachio', async () => {
    renderAt('/games/mustachio')

    expect(await screen.findByText('Mustachio')).toBeTruthy()
    await waitFor(() => {
      expect(startMustachio).toHaveBeenCalledWith('game-container')
    })
  })

  it('renders maze-game route and calls MazeGameScene', async () => {
    renderAt('/games/maze-game')

    expect(await screen.findByText('Maze Game')).toBeTruthy()
    await waitFor(() => {
      expect(MazeGameScene).toHaveBeenCalled()
    })
  })

  it('opens and closes the utilities menu from the root layout', async () => {
    renderAt('/')

    const utilitiesButton = await screen.findByRole('button', {
      name: 'Utilities',
    })

    expect(utilitiesButton.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(utilitiesButton)
    expect(utilitiesButton.getAttribute('aria-expanded')).toBe('true')

    fireEvent.mouseDown(document.body)
    expect(utilitiesButton.getAttribute('aria-expanded')).toBe('false')
  })

  it('renders the QR code generator route', async () => {
    renderAt('/utilities/qr-code-generator')

    expect(
      await screen.findByRole('heading', { name: 'QR Code Generator' }),
    ).toBeTruthy()
    expect(screen.getByLabelText('URL or text')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Generate QR Code' }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Save QR Code' })).toBeTruthy()
  })
})
