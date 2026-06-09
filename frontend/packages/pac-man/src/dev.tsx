import { createRoot } from 'react-dom/client'
import { PacMan } from './pac-man'

const root = document.getElementById('app')!
createRoot(root).render(<PacMan />)
