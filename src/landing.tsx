import { createRoot } from 'react-dom/client';
import { ArrowRightIcon } from './icons';
import './styles/globals.css';

const destinations = [
  {
    href: './playground/',
    title: 'Vite Playground',
    description: 'Explore component states and implementation examples in the local playground.',
  },
  {
    href: './storybook/',
    title: 'Storybook',
    description: 'Browse documented component stories and inspect their accessible variants.',
  },
] as const;

function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center p-6 sm:p-12">
      <section aria-labelledby="page-title" className="w-full space-y-10">
        <header className="max-w-2xl space-y-3">
          <p className="faster-type-caption m-0 uppercase tracking-[0.16em] text-faster-accent [font-weight:var(--faster-typography-font-weight-medium)]">
            Faster UI
          </p>
          <h1 id="page-title" className="faster-type-h1 m-0">
            Development surfaces
          </h1>
          <p className="faster-type-body m-0 text-faster-text-secondary">
            Choose a workspace for exploring the Faster design system.
          </p>
        </header>

        <nav aria-label="Development surfaces" className="grid gap-4 sm:grid-cols-2">
          {destinations.map(({ href, title, description }) => (
            <a
              key={href}
              href={href}
              className="group flex min-h-48 flex-col justify-between rounded-[var(--faster-radius-button)] border border-faster-border p-6 no-underline transition-colors hover:bg-faster-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-faster-focus-ring"
            >
              <div className="space-y-2">
                <h2 className="faster-type-title m-0 text-faster-text-primary">{title}</h2>
                <p className="faster-type-body m-0 text-faster-text-secondary">{description}</p>
              </div>
              <span className="faster-type-body mt-6 inline-flex items-center gap-2 [font-weight:var(--faster-typography-font-weight-medium)]">
                Open {title}
                <ArrowRightIcon aria-hidden="true" />
              </span>
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<LandingPage />);
