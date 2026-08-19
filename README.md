# Faster UI

Faster UI is an accessible, ESM React component library published as
`@faster-ui/react`. It currently provides token-driven **Button**, **Dialog**, and **Input** components, the
`PlusIcon`, `ArrowRightIcon`, `AttentionIcon`, `CloseIcon`, and `MagnifierIcon` SVG icons, and a public TypeScript API for the
design tokens that underpin them.

## Quick start

Faster UI requires a React application using **React 18.3+ or React 19** and React DOM.

1. Install the package:

   ```bash
   npm install @faster-ui/react
   ```

2. Import the stylesheet once in your application entry point (for example, `main.tsx`):

   ```tsx
   import '@faster-ui/react/styles.css';
   ```

3. Import and render components:

   ```tsx
   import { Button } from '@faster-ui/react';

   export function App() {
     return <Button>Get started</Button>;
   }
   ```

See [Usage](#usage) for a complete example and component-specific guidance.

The repository also ships three development and documentation surfaces:

- a Vite landing page that links to the available previews;
- a Vite component playground with implementation examples; and
- Storybook with interactive, accessibility-enabled component stories.

## Requirements and local development

Use Node.js `>=20.19.0` (see `.nvmrc`) and npm.

```bash
npm ci
npm run dev
```

The Vite server starts at `http://127.0.0.1:5173`. Its root page links to:

- `/playground/` — the Vite component playground; and
- `/storybook/` — the static Storybook build after `npm run build`.

For Storybook’s development server instead, run:

```bash
npm run storybook
```

It runs on `http://127.0.0.1:6006`.

## Usage

After completing the quick-start steps, import the component API where it is needed:

```tsx
import { useState } from 'react';
import { ArrowRightIcon, Button, Dialog, Input, MagnifierIcon } from '@faster-ui/react';
import '@faster-ui/react/styles.css';

export function SaveButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Input leftIcon={<MagnifierIcon />} placeholder="Search" aria-label="Search" />
      <Button trailingIcon={<ArrowRightIcon />} type="button" onClick={() => setIsDialogOpen(true)}>
        Save changes
      </Button>
      <Dialog title="Changes saved" onClose={() => setIsDialogOpen(false)} open={isDialogOpen}>
        Your changes are now available to collaborators.
      </Dialog>
    </>
  );
}
```

### Button

`Button` renders a native `<button>` and forwards its ref. In addition to standard native button
attributes, it accepts:

| Prop                           | Values                                | Default   | Notes                                                   |
| ------------------------------ | ------------------------------------- | --------- | ------------------------------------------------------- |
| `kind`                         | `button`, `danger`, `iconButton`      | inferred  | Icon-only content infers `iconButton` when omitted.     |
| `mode`                         | `primary`, `outline`, `ghost`, `link` | `primary` | `link` resolves to `primary` for icon buttons.          |
| `size`                         | `sm`, `md`, `lg`                      | `md`      | Button heights are 24px, 36px, and 40px.                |
| `leadingIcon` / `trailingIcon` | `ReactNode`                           | —         | Provide at most one icon slot.                          |
| `loading`                      | `boolean`                             | `false`   | Disables the native button and sets `aria-busy="true"`. |

Text buttons can have no icon, a leading icon, or a trailing icon:

```tsx
<Button mode="outline">Edit profile</Button>
<Button kind="danger" mode="ghost">Remove member</Button>
<Button trailingIcon={<ArrowRightIcon />}>Continue</Button>
```

For an icon-only button, omit visible content and provide an accessible name with `aria-label` or
`aria-labelledby`. The component throws if an icon-only button has no accessible name.

```tsx
import { Button, PlusIcon } from '@faster-ui/react';

<Button leadingIcon={<PlusIcon />} aria-label="Add item" />;
```

### Dialog

`Dialog` renders an accessible modal dialog with a visible title, a close control, optional icon,
and optional right-aligned footer actions. It forwards its ref to the dialog element. Render it
with `open={false}` to remove it from the page; call the supplied `onClose` handler to update the
owning state when a user presses the close button, Escape, or an enabled backdrop.

| Prop                   | Values / type                    | Default  | Notes                                                                            |
| ---------------------- | -------------------------------- | -------- | -------------------------------------------------------------------------------- |
| `title`                | `ReactNode`                      | required | Visible title that labels the dialog.                                            |
| `onClose`              | `() => void`                     | required | Called when the component requests that its owner close it.                      |
| `open`                 | `boolean`                        | `true`   | When `false`, the dialog is not rendered.                                        |
| `size`                 | `sm`, `md`, `lg`                 | `md`     | Maximum widths are 400px, 600px, and 900px.                                      |
| `variant`              | `basic`, `scrollable`, `divider` | `basic`  | Scrollable fixes the title/footer while the body scrolls; divider adds rules.    |
| `preset`               | `warning`                        | —        | Shows the Warning/600 attention icon and makes the primary footer Button danger. |
| `icon` / `footer`      | `ReactNode`                      | —        | Icon precedes body content; footer actions are right-aligned with an 8px gap.    |
| `bodyMinHeight`        | CSS `min-height` value           | —        | Reserves a body area for short content without affecting compact dialogs.        |
| `closeOnEscape`        | `boolean`                        | `true`   | Enables Escape-key close requests.                                               |
| `closeOnBackdropClick` | `boolean`                        | `false`  | Enables backdrop click close requests.                                           |

```tsx
import { Button, Dialog } from '@faster-ui/react';

<Dialog
  title="Delete project"
  preset="warning"
  onClose={() => setIsDeleteDialogOpen(false)}
  footer={
    <>
      <Button mode="link">Cancel</Button>
      <Button kind="danger">Delete</Button>
    </>
  }
>
  Deleting this project permanently removes its data.
</Dialog>;
```

### Input

`Input` forwards its ref to a native `<input>`. It supports regular native input attributes,
controlled and uncontrolled values, token-driven error and disabled states, clearable values, and
optional leading/trailing content. Search, currency, and URL inputs receive helpful automatic
adornments.

| Prop                     | Values / type    | Default    | Notes                                                                     |
| ------------------------ | ---------------- | ---------- | ------------------------------------------------------------------------- |
| `size`                   | `sm`, `md`, `lg` | `md`       | Input heights are 24px, 36px, and 40px.                                   |
| `leftIcon` / `rightIcon` | `ReactNode`      | —          | Decorative slots before or after the input.                               |
| `prefix` / `suffix`      | `ReactNode`      | —          | Takes precedence over the matching automatic or manual adornment.         |
| `currency`               | `string`         | —          | Displays a currency symbol and renders the native input as `type=number`. |
| `currencyCode`           | `string`         | —          | Optional notation after a currency input, such as `USD` or `EUR`.         |
| `urlProtocol`            | `string`         | `https://` | Protocol before an input with `type="url"`.                               |
| `urlSuffix`              | `string`         | —          | Optional suffix after an input with `type="url"`, such as `.com`.         |
| `clearable`              | `boolean`        | `true`     | Shows a real clear button when the input has a value.                     |
| `onClear`                | `() => void`     | —          | Called after the clear action requests an empty value.                    |
| `errorMessage`           | `ReactNode`      | —          | Displays reserved-space feedback and sets `aria-invalid="true"`.          |

```tsx
import { Input } from '@faster-ui/react';

<Input aria-label="Search documentation" type="search" placeholder="Search" />;

<Input aria-label="Price" currency="$" currencyCode="USD" min="0" placeholder="0.00" />;

<Input
  aria-label="Website"
  type="url"
  urlProtocol="https://"
  urlSuffix=".com"
  placeholder="faster-ui"
/>;

<Input
  aria-label="Email address"
  errorMessage="Enter a valid email address."
  placeholder="name@example.com"
/>;

<Input aria-label="Quantity" type="number" defaultValue="1" min="0" max="10" />;
```

`type="search"` adds a decorative magnifier icon. Passing `currency` makes the native control a
number input and adds native increment/decrement controls; `currencyCode` supplies optional
notation after it. `type="url"` displays `urlProtocol` and an optional `urlSuffix`. All variants
can show a clear action. Number inputs omit decorative icon slots. For custom composition,
`prefix` and `suffix` use nullish precedence over automatic adornments and `leftIcon`/`rightIcon`,
so even an empty-string affix remains intentional.

### Icons

`PlusIcon`, `ArrowRightIcon`, `AttentionIcon`, `CloseIcon`, and `MagnifierIcon` use `currentColor`, so they inherit their
surrounding text color. Their public props intentionally include only `className`, `aria-label`,
and `aria-labelledby`. Icons are decorative (`aria-hidden="true"`) by default; supplying either
accessible-label prop makes the SVG available to assistive technology.

## Design tokens and styling

The JSON files in `src/tokens/` are the source of truth. They define:

- primitive and semantic colors;
- typography families, weights, and named text styles;
- radii, shadows, and spacing; and
- Button, Dialog, and Input dimensions and visual states.

`src/tokens/index.ts` resolves token references and exports the TypeScript token API:
`colorTokens`, `radiusTokens`, `shadowTokens`, `spacingTokens`, `typographyTokens`, and
`buttonTokens`, `dialogTokens`, and `inputTokens`. `npm run build:tokens` generates `src/styles/tokens.css`,
which exposes the same values as `--faster-*` custom properties.

Components use token-backed Tailwind utilities and custom properties rather than raw color
literals. For example:

```tsx
<div className="border border-faster-border bg-faster-primary-50 text-faster-text-primary" />
```

The named typography utilities are `faster-type-h1`, `faster-type-h2`, `faster-type-h3`,
`faster-type-title`, `faster-type-subtitle`, `faster-type-body`, and `faster-type-caption`.
All currently use the regular (`400`) token weight; controls and selected interface text apply the
medium (`500`) token weight where needed.

Do not edit `src/styles/tokens.css` directly. Update the source JSON and regenerate it:

```bash
npm run build:tokens
```

## Commands

| Command                                         | Purpose                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`                                   | Starts Vite on `127.0.0.1:5173`; the root page links to the playground and built Storybook. |
| `npm run storybook`                             | Starts Storybook on port 6006.                                                              |
| `npm run lint` / `npm run lint:fix`             | Checks the repository with ESLint, or applies ESLint fixes. Warnings fail the check.        |
| `npm run format` / `npm run format:check`       | Writes or checks Prettier formatting.                                                       |
| `npm run typecheck`                             | Runs the main TypeScript no-emit check.                                                     |
| `npm run typecheck:component`                   | Type-checks Cypress component-test files.                                                   |
| `npm run test:unit`                             | Runs Jest unit and accessibility tests.                                                     |
| `npm run test:component`                        | Runs Cypress component tests in Electron.                                                   |
| `npm run test`                                  | Runs token freshness, lint, formatting, both type checks, Jest, and Cypress.                |
| `npm run build:tokens` / `npm run check:tokens` | Regenerates token CSS or verifies that it is current.                                       |
| `npm run build:types`                           | Emits declarations from the public `src/index.ts` entry.                                    |
| `npm run build:library`                         | Bundles the ESM library entry and extracted stylesheet.                                     |
| `npm run build:pages`                           | Builds the Vite landing page and playground.                                                |
| `npm run build:production`                      | Cleans `dist/`, then generates tokens, declarations, library assets, and Vite pages.        |
| `npm run build:storybook`                       | Builds Storybook into `dist/storybook`.                                                     |
| `npm run build`                                 | Runs the production build followed by the Storybook build.                                  |

## Repository structure

```text
src/
  components/Button/  # Button implementation, types, tests, stories, and barrel export
  components/Dialog/  # Dialog implementation, types, tests, stories, and barrel export
  components/Input/   # Input implementation, types, tests, stories, and barrel export
  icons/              # Public SVG icons, narrow prop types, and tests
  tokens/             # JSON token sources, reference definitions, and public token exports
  styles/             # Tailwind entry point and generated token CSS
  dev.tsx             # Vite playground entry
  landing.tsx         # Vite root landing-page entry
cypress/              # Cypress component specs and support files
.storybook/           # Storybook configuration and global style import
scripts/              # Token-CSS generator
```

`src/index.ts` is the library entry point: it imports the library stylesheet and re-exports the
public components, icons, and token API. React and React DOM are peer dependencies and external to
the library bundle.

## Builds, distribution, and deployment

`npm run build:production` recreates the publishable and Vite-page portion of `dist/` in this
order:

1. cleans `dist/`;
2. regenerates `src/styles/tokens.css`;
3. emits public declarations;
4. bundles the ESM library and stylesheet; and
5. builds the root landing page and `/playground/` page.

`npm run build` then adds Storybook at `dist/storybook`. The deployed directory therefore includes
the landing page at `dist/index.html`, the Vite playground at `dist/playground/index.html`, and
the Storybook site at `dist/storybook/index.html`.

The `files` allowlist in `package.json` publishes the library JS, CSS, declarations, README, and
license; it excludes the Vite pages, their hashed assets, and Storybook. GitHub Actions deploys
the full `dist/` directory to GitHub Pages after successful quality checks on pushes to `main`.
Configure the repository’s Pages source as **GitHub Actions**.

### npm library packaging

Faster UI is an npm-publishable ESM React library named `@faster-ui/react`. Its package exports
the component and token API from `@faster-ui/react`, TypeScript declarations, and the compiled
stylesheet from `@faster-ui/react/styles.css`.

Build and inspect the exact package contents locally before publishing:

```bash
npm run build:production
npm pack --dry-run
```

To create the distributable tarball without uploading it to the npm registry, run:

```bash
npm pack
```

This produces a versioned `.tgz` archive containing only the files permitted by the
`package.json` `files` allowlist. Consumers install the published package with:

```bash
npm install @faster-ui/react
```

## Quality and release workflow

On pull requests, pushes to `main`, and published GitHub Releases, CI installs with `npm ci` and
runs linting, the main and Cypress TypeScript checks, Jest, Cypress component tests, the
production build, and the Storybook build.

When a GitHub Release is published and those checks pass, the `publish` job rebuilds the
production package and runs `npm publish --provenance`. Configure npm Trusted Publishing for the
repository/package pair; the workflow uses OIDC and does not require a long-lived `NPM_TOKEN`.
