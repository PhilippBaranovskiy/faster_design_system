import { createRoot } from 'react-dom/client';
import { ArrowRightIcon, Button, PlusIcon, buttonTokens } from './index';
import './styles/globals.css';

const buttonModes = ['primary', 'outline', 'ghost', 'link'] as const;
const iconButtonModes = ['primary', 'outline', 'ghost'] as const;
const layoutTreatments = [
  { kind: 'button', label: 'Primary' },
  { kind: 'danger', label: 'Danger' },
] as const;

const sizes = [
  { value: 'lg', label: 'Large', height: '40px' },
  { value: 'md', label: 'Medium', height: '36px' },
  { value: 'sm', label: 'Small', height: '24px' },
] as const;

function Playground() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 p-8 sm:p-12">
      <header className="space-y-3">
        <p className="faster-type-caption m-0 uppercase tracking-[0.16em] text-faster-accent [font-weight:var(--faster-typography-font-weight-medium)]">
          Faster UI
        </p>
        <h1 className="faster-type-h1 m-0">Component playground</h1>
        <p className="faster-type-body m-0 max-w-2xl text-faster-text-secondary">
          A local development surface for the published Button component.
        </p>
      </header>

      <section aria-labelledby="buttons-heading" className="space-y-4">
        <h2 id="buttons-heading" className="faster-type-title m-0">
          Button treatments
        </h2>
        <p className="faster-type-body m-0 max-w-2xl text-faster-text-secondary">
          Each treatment is shown in its default and disabled state. Hover and press a control to
          inspect its Hover and Pressed token states. Every button reserves a{' '}
          <code className="rounded bg-faster-neutral-100 px-1 py-0.5 text-faster-text-primary">
            {buttonTokens.borderWidth}
          </code>{' '}
          border; it is transparent by default, while outline treatments supply their
          <code className="ml-1 rounded bg-faster-neutral-100 px-1 py-0.5 text-faster-text-primary">
            borderColor
          </code>{' '}
          token.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {(['button', 'danger'] as const).map((kind) => (
            <section
              key={kind}
              aria-labelledby={`${kind}-buttons-heading`}
              className="space-y-3 rounded-[var(--faster-radius-button)] border border-faster-border p-4"
            >
              <h3 id={`${kind}-buttons-heading`} className="faster-type-subtitle m-0 capitalize">
                {kind === 'button' ? 'Button' : 'Danger'}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {buttonModes.map((mode) => (
                  <div key={mode} className="space-y-2">
                    <p className="faster-type-caption m-0 capitalize text-faster-text-secondary">
                      {mode}
                    </p>
                    <Button kind={kind} mode={mode} className="w-full">
                      Continue
                    </Button>
                    <Button kind={kind} mode={mode} disabled className="w-full">
                      Disabled
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section
          aria-labelledby="icon-buttons-heading"
          className="space-y-3 rounded-[var(--faster-radius-button)] border border-faster-border p-4"
        >
          <h3 id="icon-buttons-heading" className="faster-type-subtitle m-0">
            IconButton
          </h3>
          <div className="flex flex-wrap gap-4">
            {iconButtonModes.map((mode) => (
              <div key={mode} className="space-y-2">
                <p className="faster-type-caption m-0 capitalize text-faster-text-secondary">
                  {mode}
                </p>
                <div className="flex gap-2">
                  <Button
                    kind="iconButton"
                    mode={mode}
                    leadingIcon={<PlusIcon />}
                    aria-label={`Add item (${mode})`}
                  />
                  <Button
                    kind="iconButton"
                    mode={mode}
                    leadingIcon={<PlusIcon />}
                    aria-label={`Add item (${mode}, disabled)`}
                    disabled
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section aria-labelledby="layouts-heading" className="space-y-4">
        <h2 id="layouts-heading" className="faster-type-title m-0">
          Sizes and layouts
        </h2>
        {layoutTreatments.map(({ kind, label }) => (
          <section key={kind} aria-labelledby={`${kind}-layouts-heading`} className="space-y-2">
            <h3 id={`${kind}-layouts-heading`} className="faster-type-subtitle m-0">
              {label}
            </h3>
            <div className="overflow-x-auto">
              <table className="faster-type-body w-full border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="faster-type-caption uppercase tracking-[0.12em] text-faster-text-secondary [font-weight:var(--faster-typography-font-weight-medium)]">
                    <th className="px-3 py-2">Size</th>
                    <th className="px-3 py-2">Text label</th>
                    <th className="px-3 py-2">Leading icon + label</th>
                    <th className="px-3 py-2">Label + trailing icon</th>
                    <th className="px-3 py-2">Icon only</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map(({ value, label: sizeLabel, height }) => (
                    <tr key={value}>
                      <th
                        scope="row"
                        className="whitespace-nowrap px-3 py-2 [font-weight:var(--faster-typography-font-weight-medium)]"
                      >
                        {sizeLabel}
                        <span className="faster-type-caption ml-2 text-faster-text-secondary">
                          {height}
                        </span>
                      </th>
                      <td className="px-3 py-2">
                        <Button kind={kind} size={value}>
                          Continue
                        </Button>
                      </td>
                      <td className="px-3 py-2">
                        <Button kind={kind} size={value} leadingIcon={<PlusIcon />}>
                          Add item
                        </Button>
                      </td>
                      <td className="px-3 py-2">
                        <Button kind={kind} size={value} trailingIcon={<ArrowRightIcon />}>
                          Continue
                        </Button>
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          kind={kind}
                          size={value}
                          leadingIcon={<ArrowRightIcon />}
                          aria-label="Continue"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Playground />);
