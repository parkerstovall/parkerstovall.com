import { createFileRoute, Link } from '@tanstack/react-router'
import '../App.css'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="site-page">
      <section className="home-hero">
        <article className="surface-card home-hero-card">
          <span className="eyebrow">Software Developer</span>
          <h1 className="home-title">Parker Stovall</h1>
          <p className="home-subtitle">
            Come see the place where I put whatever I find fun or interesting.
            Currently, that means a few silly games.
          </p>
        </article>

        <aside className="surface-card home-hero-card">
          <span className="eyebrow">Featured Games</span>
          <nav className="home-game-grid" aria-label="Featured game links">
            <Link
              className="home-game-card"
              to="/games/mustachio"
              aria-label="Mustachio"
            >
              <h3>Mustachio</h3>
              <p>
                Retro-inspired side-scroller with precision platforming and
                arcade-style challenge.
              </p>
            </Link>
            <Link
              className="home-game-card"
              to="/games/pac-man"
              aria-label="Pac-Man"
            >
              <h3>Pac-Man</h3>
              <p>
                A modern browser take on the classic maze chase with responsive
                controls.
              </p>
            </Link>
          </nav>
          <span className="home-pill">New builds land here first</span>
        </aside>
      </section>

      <section className="home-content">
        <article className="surface-card home-content-card">
          <h2 className="section-title">About Me</h2>
          <p className="section-text">
            I'm a software developer with 5 years of experience working at an
            awesome data-forward digital marketing company based out of Kansas
            City, Missouri. I have three dogs, a loving wife, and a desire to
            see as much of the world as possible!
          </p>
          <p className="section-text">
            As a developer, my passion will always be performance, even if that
            doesn't come through as much in my personal projects. My free time
            is devoted to fun, so thats where my focus is on this site.
          </p>
        </article>
      </section>

      <section className="home-content">
        <article className="surface-card home-content-card">
          <h2 className="section-title">
            My Thoughts on AI (Not that you asked!)
          </h2>
          <p className="section-text">
            The way I use AI differs based on whether or not I'm using it for
            work or for fun. At work, I use AI as the primary tool for
            development, and I utilize my expertise to check and proofread
            everything it outputs. I consider myself the peer-reviewer and
            orchestrator of the AI, and I consider it the ultimate test of my
            skill to ensure I don't get lazy about the output and code I
            generate.
          </p>

          <p className="section-text">
            For fun, I try to use AI as little as possible. This is because I{' '}
            <i>enjoy</i> coding. I've loved it ever since I made my first
            minesweeper game when I was 14. If there's some aspect of a personal
            project that just really doesn't sound fun (like the general design
            of this website, for instance), I'll have an AI tool run through the
            first draft. But for any of the actual build work, thats the part I
            love, and it makes no sense to me to outsource it to something else.
            If I didn't enjoy the process, I wouldn't have made this website!
          </p>
        </article>
      </section>
    </main>
  )
}
