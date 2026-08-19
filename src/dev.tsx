import { createRoot } from 'react-dom/client';
import { ArrowRightIcon, Button, Input, MagnifierIcon, PlusIcon, buttonTokens } from './index';
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
    <main className="mx-auto flex min-h-screen w-full min-w-[56rem] flex-col gap-10 p-8 sm:p-12">
      <header className="mx-auto w-full max-w-4xl space-y-3">
        <p className="faster-type-caption m-0 uppercase tracking-[0.16em] text-faster-accent [font-weight:var(--faster-typography-font-weight-medium)]">
          Faster UI
        </p>
        <h1 className="faster-type-h1 m-0">Component playground</h1>
        <p className="faster-type-body m-0 max-w-2xl text-faster-text-secondary">
          A local development surface for the published Button and Input components.
        </p>
      </header>

      <section aria-labelledby="buttons-heading" className="mx-auto w-full max-w-4xl space-y-4">
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

      <section aria-labelledby="inputs-heading" className="mx-auto w-full max-w-4xl space-y-4">
        <h2 id="inputs-heading" className="faster-type-title m-0">
          Input
        </h2>
        <p className="faster-type-body m-0 max-w-2xl text-faster-text-secondary">
          Search inputs add a magnifier icon automatically. Currency inputs use a native number
          field with optional currency notation, while URL inputs display a protocol and optional
          domain suffix. Every input type supports clearing a non-empty value. Explicit prefixes and
          suffixes take precedence over automatic adornments.
        </p>
        <div className="grid gap-4 rounded-[var(--faster-radius-button)] border border-faster-border p-4 sm:grid-cols-2">
          <Input aria-label="Search Faster UI" type="search" placeholder="Search" />
          <Input
            aria-label="Search Faster UI with clear action"
            type="search"
            defaultValue="Faster UI"
            placeholder="Search"
          />
          <Input
            aria-label="Price in dollars"
            currency="$"
            defaultValue="10"
            min="0"
            placeholder="0.00"
            currencyCode="USD"
          />
          <Input
            aria-label="Company website"
            type="url"
            defaultValue="faster-ui"
            urlProtocol="https://"
            urlSuffix=".com"
          />
          <Input
            aria-label="Email address"
            placeholder="name@example.com"
            errorMessage="Enter a valid email address."
          />
          <Input aria-label="Quantity" type="number" defaultValue="1" min="0" max="10" />
          <Input aria-label="Disabled input" disabled defaultValue="Unavailable" type="search" />
        </div>

        <section
          aria-labelledby="automatic-inputs-heading"
          className="space-y-3 rounded-[var(--faster-radius-button)] border border-faster-border p-4"
        >
          <h3 id="automatic-inputs-heading" className="faster-type-subtitle m-0">
            Automatic input adornments
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input aria-label="Empty search" type="search" placeholder="Search" />
            <Input aria-label="Filled search" type="search" defaultValue="Faster UI" />
            <Input aria-label="Currency symbol" currency="$" defaultValue="10" min="0" />
            <Input
              aria-label="Currency symbol and code"
              currency="€"
              currencyCode="EUR"
              defaultValue="10"
              min="0"
            />
            <Input aria-label="URL protocol" type="url" defaultValue="faster-ui" />
            <Input
              aria-label="URL protocol and suffix"
              type="url"
              urlProtocol="http://"
              urlSuffix=".dev"
              defaultValue="faster-ui"
            />
          </div>
        </section>
      </section>

      <section aria-labelledby="layouts-heading" className="space-y-4">
        <h2 id="layouts-heading" className="faster-type-title mx-auto w-full max-w-4xl">
          Sizes and layouts
        </h2>

        <section
          aria-labelledby="button-layouts-heading"
          className="mx-auto w-full max-w-4xl space-y-4"
        >
          <h3 id="button-layouts-heading" className="faster-type-subtitle m-0">
            Button
          </h3>
          {layoutTreatments.map(({ kind, label }) => (
            <section key={kind} aria-labelledby={`${kind}-layouts-heading`} className="space-y-2">
              <h4 id={`${kind}-layouts-heading`} className="faster-type-body m-0">
                {label}
              </h4>
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

        <section
          aria-labelledby="input-layouts-heading"
          className="mx-auto w-full max-w-7xl space-y-2"
        >
          <h3 id="input-layouts-heading" className="faster-type-subtitle m-0">
            Input
          </h3>
          <div className="overflow-x-auto">
            <table className="faster-type-body w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="faster-type-caption uppercase tracking-[0.12em] text-faster-text-secondary [font-weight:var(--faster-typography-font-weight-medium)]">
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Empty</th>
                  <th className="px-3 py-2">Leading icon</th>
                  <th className="px-3 py-2">Clear + trailing icon</th>
                  <th className="px-3 py-2">Number + affixes</th>
                  <th className="px-3 py-2">Number</th>
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
                    <td className="min-w-48 px-3 py-2">
                      <Input
                        aria-label={`${sizeLabel} empty input`}
                        size={value}
                        placeholder="Search"
                      />
                    </td>
                    <td className="min-w-48 px-3 py-2">
                      <Input
                        aria-label={`${sizeLabel} input with leading icon`}
                        size={value}
                        leftIcon={<MagnifierIcon />}
                        placeholder="Search"
                      />
                    </td>
                    <td className="min-w-48 px-3 py-2">
                      <Input
                        aria-label={`${sizeLabel} input with clear and trailing icon`}
                        size={value}
                        defaultValue="Faster UI"
                        rightIcon={<MagnifierIcon />}
                      />
                    </td>
                    <td className="min-w-48 px-3 py-2">
                      <Input
                        aria-label={`${sizeLabel} input with affixes`}
                        size={value}
                        type="number"
                        defaultValue="10"
                        min="0"
                        prefix="$"
                        suffix="USD"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="min-w-40 px-3 py-2">
                      <Input
                        aria-label={`${sizeLabel} number input`}
                        size={value}
                        type="number"
                        defaultValue="1"
                        min="0"
                        max="10"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Playground />);
