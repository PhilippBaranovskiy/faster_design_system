# Faster UI: Agent Guide

## Purpose and public surface

Faster UI is a publishable ESM React component library (`@faster-ui/react`) with Vite and
Storybook development surfaces. Its public entry point, `src/index.ts`, imports
`src/styles/globals.css` and re-exports the public components, icons, and resolved design-token
objects. React and React DOM are peer dependencies and are externalized from the library bundle.

The current public API is:

- Components: `Button`, `Dialog`, and `Input`.
- Icons: `ArrowRightIcon`, `AttentionIcon`, `CloseIcon`, `MagnifierIcon`, `PlusIcon`, and the
  `IconProps` type.
- Token exports: `buttonTokens`, `colorTokens`, `dialogTokens`, `inputTokens`, `radiusTokens`,
  `shadowTokens`, `spacingTokens`, and `typographyTokens`.

The package root export provides JavaScript and declarations. Consumers can import the compiled
stylesheet with `@faster-ui/react/styles.css`. The `files` allowlist intentionally publishes only
the library artifacts and declaration directories under `dist/`, plus `README.md` and `LICENSE`.

The root Vite page is a landing page linking to the Vite playground and static Storybook build.
`dist/` is shared generated output:

- library artifacts: `index.js`, `index.d.ts`, `style.css`, and generated declaration folders;
- Vite pages: `index.html`, `playground/index.html`, and `assets/`; and
- static Storybook: `storybook/` after `npm run build` or `npm run build:storybook`.

## Repository map

- `src/components/<Component>/`: colocated public component implementation, prop types, Jest
  tests, Storybook stories, and barrel export. Add public component exports to `src/index.ts`.
  Current components are `Button`, `Dialog`, and `Input`.
- `src/icons/`: public SVG icons, their narrow `IconProps` API, barrel export, and icon tests.
  Icons use `currentColor`, set `focusable="false"`, and are decorative unless an accessible name
  is supplied through `aria-label` or `aria-labelledby`.
- `src/tokens/*.json`: source-of-truth primitive and semantic tokens. `button.json`,
  `dialog.json`, and `input.json` hold component tokens; `colors.json`, `radius.json`,
  `shadows.json`, `spacing.json`, and `typography.json` hold shared tokens.
  `src/tokens/token-definitions.mjs` aggregates those sources for CSS generation, while
  `src/tokens/index.ts` resolves `{token.path}` references for the public TypeScript API.
- `src/styles/globals.css`: Tailwind entry point, baseline styles, typography helpers, and
  Button/Input state styling. `src/styles/tokens.css` is generated CSS custom properties.
- `src/utils/cn.ts`: class composition through `tailwind-merge`. Use it for conditional or
  externally overridable Tailwind class lists.
- `src/utils/useBodyScrollLock.ts`: reference-counted body-scroll lock used by overlay components.
- `src/landing.tsx` with root `index.html`: the Vite landing page.
  `src/dev.tsx` with `playground/index.html`: the Vite component playground.
- `.storybook/`: Storybook setup. Stories match `src/**/*.stories.@(ts|tsx)` and global styles
  load through `.storybook/preview.ts`.
- `cypress/component/`: Cypress component specs for all public components and icons.
  `cypress/support/component.ts` mounts components and imports global styles.
- `src/test/setup.ts` and `jest.config.mjs`: Jest DOM/a11y setup and unit-test configuration.
- `scripts/generate-css-variables.mjs`: resolves token references and emits
  `src/styles/tokens.css`; supports `--check`.
- `tailwind.config.ts`: `faster-*` Tailwind color utilities. Its content scan covers
  `src/**/*.{ts,tsx}`.
- `vite.config.ts`: builds the root landing page and playground into `dist/`.
  `vite.library.config.ts`: builds the ESM package entry into the same directory without cleaning.
- `.github/workflows/ci.yml`: authoritative CI, npm publishing, and GitHub Pages workflow.
  `README.md` is authoritative for public installation and usage guidance.

## Setup and commands

Node must satisfy `>=20.19.0`; `.nvmrc` contains `lts/*`. Use npm and the committed lockfile:

```bash
npm ci                         # clean, reproducible install
npm run dev                    # Vite landing page at http://127.0.0.1:5173
npm run storybook              # Storybook development server at http://127.0.0.1:6006

npm run lint                   # ESLint; warnings fail
npm run lint:fix               # apply ESLint fixes
npm run format                 # Prettier writes all files
npm run format:check           # verify Prettier formatting
npm run typecheck              # main TypeScript no-emit check
npm run typecheck:component    # Cypress component-test type check
npm run test:unit              # Jest unit and accessibility tests
npm run test:component         # Cypress component tests in Electron
npm run test                   # token freshness and all quality checks except builds

npm run build:tokens           # regenerate generated token CSS
npm run check:tokens           # fail when generated token CSS is stale
npm run build:types            # declarations from src/index.ts
npm run build:library          # ESM library bundle and stylesheet
npm run build:pages            # Vite landing page and playground
npm run build:production       # clean, tokens, declarations, library, and Vite pages
npm run build:storybook        # static Storybook in dist/storybook
npm run build                  # production build plus Storybook
```

Use `npm install` for ordinary local dependency updates. Inspect affected states in the Vite
playground or Storybook in addition to automated tests. CI runs linting, both type checks, Jest,
Cypress component tests, `build:production`, and `build:storybook`; it publishes only on a
published GitHub release and deploys `dist/` to GitHub Pages after pushes to `main`.

## Component and accessibility conventions

- Use strict TypeScript, semantic native elements, explicit public prop types, colocated barrel
  exports, and `forwardRef` when exposing a DOM element. The project uses the automatic React JSX
  transform and ESM/bundler module resolution.
- Preserve native behavior and forwarded native props unless the component intentionally owns an
  attribute. Prefer the existing Testing Library/Jest and Cypress patterns for behavior and a11y
  regression coverage.
- **Button:** supports `sm`, `md`, and `lg` sizes; `button`, `danger`, and `iconButton` kinds;
  and `primary`, `outline`, `ghost`, and `link` modes. It permits at most one of `leadingIcon`
  and `trailingIcon`. Omitted visible content with an icon resolves to `iconButton`, which must have
  `aria-label` or `aria-labelledby`; `iconButton` with `mode="link"` resolves to `primary`.
  `loading` displays a spinner, disables the native button, and sets `aria-busy`.
- **Dialog:** renders a modal portal in `document.body` only when open, applies
  `role="dialog"` and `aria-modal`, and locks body scrolling while open. It offers `basic`,
  `scrollable`, and `divider` layouts; `sm`, `md`, and `lg` widths; configurable Escape/backdrop
  close behavior; a close control; and optional footer, icon, and `bodyMinHeight`. The `warning`
  preset supplies `AttentionIcon` and changes the last nested footer `Button` to `kind="danger"`.
  Keep its portal and reference-counted scroll-lock behavior intact when modifying overlays.
- **Input:** forwards its ref to the native `<input>` and supports `sm`, `md`, and `lg` sizes,
  controlled and uncontrolled values, validation text, clearing, decorative icons, and explicit
  prefix/suffix content. Prefix/suffix override icon slots. Search fields add `MagnifierIcon`;
  `currency` makes the field numeric and can add a currency code; URL fields default to an
  `https://` prefix and can add a suffix. Number inputs use custom increment/decrement controls
  and hide decorative icons. A non-empty enabled input shows its clear control unless
  `clearable={false}`; errors set `aria-invalid`, append to `aria-describedby`, and expose a
  polite error message.
- Icons must retain their deliberately narrow prop API, `currentColor`, `focusable="false"`, and
  decorative default. Do not broaden icon props to arbitrary SVG attributes without an explicit
  public-API decision.

## Styling and token conventions

- Keep visual values token-driven. Use semantic `faster-*` Tailwind utilities or
  `--faster-*` custom properties rather than introducing raw color literals in component styling.
  Add Tailwind mappings to `tailwind.config.ts` when a token needs a named utility.
- Source token changes belong in `src/tokens/*.json`. Then run `npm run build:tokens` and commit
  the regenerated `src/styles/tokens.css`. Never edit `tokens.css` directly.
- Tailwind scans only `src/**/*.ts` and `src/**/*.tsx`; keep dynamically selected classes
  statically discoverable or represent them with explicit mappings.
- `globals.css` owns shared typography and the detailed Button/Input state selectors. Coordinate
  class-name or token changes between component markup, styles, tokens, tests, stories, and
  playground examples.
- Use `cn` instead of manual string joining whenever classes are conditional or caller-supplied,
  so conflicting Tailwind utilities merge predictably.

## Generated output and completion

- Do **not** hand-edit `dist/`, `node_modules/`, or `src/styles/tokens.css`.
  `npm run build:production` recreates library and Vite output; `npm run build` also recreates
  Storybook.
- Preserve the relative `base: './'` behavior for production Vite and Storybook builds, so root
  landing-page links and static GitHub Pages hosting work. Local Vite continues to use `/`.
- When public behavior changes, update the implementation, public types and barrel/root exports,
  Jest tests, Cypress specs, Storybook stories, Vite playground, and README as applicable.
- Before completion, run focused tests while iterating and normally validate with
  `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`. Manually inspect
  relevant visual and accessibility states when the change affects UI behavior.
