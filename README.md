# Faster UI

Faster UI is a small, accessible React component library built as a design-system exercise. It provides a production-oriented **Button** component with semantic design tokens and GitHub Actions automation.

> The initial token values and component APIs are intentionally centralized so they can be calibrated once the final Figma inspection specifications are supplied.

## Stack

- React + TypeScript
- Tailwind CSS with CSS-variable-backed semantic tokens
- Vite library build
- GitHub Actions CI and npm release workflow

## Getting started

**Prerequisite:** Node.js 20.19+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

The development server includes a local component playground at `http://127.0.0.1:5173`.

## Commands

| Command                 | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `npm run lint`          | Runs ESLint with warnings treated as errors.                       |
| `npm run typecheck`     | Checks TypeScript without emitting files.                          |
| `npm run build`         | Rebuilds the publishable package and GitHub Pages site in `dist/`. |
| `npm run build:types`   | Emits public TypeScript declarations.                              |
| `npm run build:library` | Bundles the npm library entry and stylesheet.                      |
| `npm run build:pages`   | Builds the static component playground for GitHub Pages.           |

## Architecture

```text
src/
  components/     # Public, feature-isolated UI components
  icons/          # Shared, public SVG icon components
  tokens/         # Token definitions and their public TypeScript API
  styles/         # Generated token CSS, Tailwind entry point, and global baseline
  utils/          # Shared class-name and accessibility utilities
```

Each component folder colocates its TypeScript API, implementation, and public barrel export.

## Distribution and GitHub Pages

`npm run build` clears and recreates `dist/` in four stages:

1. emits public TypeScript declarations;
2. bundles the ESM library entry and stylesheet;
3. builds the static playground; and
4. leaves the final directory ready to deploy to GitHub Pages.

The resulting layout is:

```text
dist/
  index.js          # npm ESM entry
  index.d.ts        # npm type entry
  style.css         # npm stylesheet export
  components/       # declarations referenced by the public type entry
  tokens/           # declarations for exported design tokens
  index.html        # GitHub Pages playground entry
  assets/           # hashed JS/CSS assets used by index.html
```

The `files` allowlist in `package.json` publishes only the library files and declarations to npm; `index.html` and `assets/` are intentionally excluded from the package. The GitHub Actions workflow deploys the full `dist/` directory on pushes to `main`. In the repository's **Settings → Pages**, set the source to **GitHub Actions**.

## Design tokens

The JSON files in `src/tokens/` are the source of truth for primitive and semantic tokens. Tokens are separated by concern—such as `colors.json`, `typography.json`, and `shadows.json`—so each hierarchy can be read and maintained independently. `src/tokens/index.ts` resolves references and exposes the TypeScript API, while `npm run build:tokens` generates `src/styles/tokens.css` for browser and Tailwind consumption. Semantic roles such as `accent`, `textPrimary`, and `border` can reference primitive values without copying their literals.

Components only refer to semantic Tailwind utilities such as `bg-faster-accent` and `text-faster-text-primary`; they do not embed raw color literals. This makes a future visual refresh, theming strategy, or Figma-token synchronization localized to the token layer.

### Color

`colors.json` defines the color system in two layers:

1. **Primitive palettes** preserve the supplied values exactly: black, white, neutral, primary,
   auxiliary, danger, warning, success, and info.
2. **Semantic aliases** resolve to those primitives for component use. For example,
   `color.text.primary` resolves to `color.neutral.700`, while `color.accent` resolves to
   `color.primary.700`.

This separation lets components use intent-based roles while retaining the complete palette for
illustrations, data visualizations, and future component states. Each primitive family has steps
`50`, `100`, `200`, `300`, `400`, `500`, `600`, and `700`; black and white are standalone
tokens.

| Token family | Intended use                                                          |
| ------------ | --------------------------------------------------------------------- |
| `neutral`    | Hue-free text, borders, and surfaces that pair with every brand color |
| `primary`    | Brand and primary-action color                                        |
| `auxiliary`  | Supporting brand color                                                |
| `danger`     | Dangerous, erroneous, or rejected states                              |
| `warning`    | Warning and in-progress states                                        |
| `success`    | Successful, correct, or passed states                                 |
| `info`       | Informational, emotionally neutral states                             |

The generated stylesheet exposes primitives as CSS custom properties—for example,
`--faster-color-primary-700` and `--faster-color-success-50`—and semantic aliases such as
`--faster-color-text-primary`, `--faster-color-accent`, and `--faster-color-focus-ring`.
Tailwind mirrors both layers:

```tsx
<div className="border border-faster-border bg-faster-primary-50 text-faster-text-primary" />
<p className="text-faster-danger">Unable to save changes.</p>
```

### Typography

Typography is tokenized in `typography` with the prescribed system font stack, a dedicated
`Consolas`-first monospace stack, and regular (`400`) and medium (`500`) weights. The seven
named text styles are available as CSS utilities:

| Utility                | Size / line height | Default weight |
| ---------------------- | ------------------ | -------------- |
| `faster-type-h1`       | 30px / 38px        | Medium         |
| `faster-type-h2`       | 24px / 32px        | Medium         |
| `faster-type-h3`       | 20px / 28px        | Medium         |
| `faster-type-title`    | 18px / 26px        | Medium         |
| `faster-type-subtitle` | 16px / 24px        | Medium         |
| `faster-type-body`     | 14px / 22px        | Regular        |
| `faster-type-caption`  | 12px / 18px        | Regular        |

The base `body` uses the Body style; `code`, `kbd`, `pre`, and `samp` use the monospace stack.
Button labels use the relevant scale size with the Medium weight to preserve action emphasis.
The system font stack intentionally does not load web fonts: it resolves to the platform’s
available SF/PingFang, Segoe UI, Roboto, Helvetica, and CJK fallbacks.

### Shadows and elevation

Elevation is expressed as four semantic, layered shadow tokens. Use the lowest elevation that
communicates the element’s surface hierarchy; elevation is not a substitute for a focus
indicator, selected state, or disabled state. The values use black (`#000000`) with the
specified opacity per layer, and each token is ready to apply directly with `box-shadow`.

| Token               | Intended hierarchy                       | Layer 1: x / y / blur / spread / opacity | Layer 2: x / y / blur / spread / opacity |
| ------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| `shadow.elevation1` | Slightly raised, persistent surfaces     | 0 / 1px / 1px / 0 / 2%                   | 0 / 2px / 4px / 0 / 4%                   |
| `shadow.elevation2` | Raised controls and contained surfaces   | 0 / 1px / 4px / 0 / 4%                   | 0 / 4px / 10px / 0 / 8%                  |
| `shadow.elevation3` | Temporary or prominently raised surfaces | 0 / 2px / 20px / 0 / 4%                  | 0 / 8px / 32px / 0 / 8%                  |
| `shadow.elevation4` | Highest-priority overlays                | 0 / 8px / 20px / 0 / 6%                  | 0 / 24px / 60px / 0 / 12%                |

Use the generated CSS variables directly when styling a component:

```css
.popover {
  box-shadow: var(--faster-shadow-elevation3);
}
```

The equivalent resolved values are exported as `shadowTokens` from the package token API.

## Component decisions

### Button

- Three sizes: `sm` (24px), `md` (36px), and `lg` (40px)
- Four modes: `primary`, `outline`, `ghost`, and `link`
- Three visual kinds: `button`, `danger`, and `iconButton`
- Text-only, leading- or trailing-icon-with-label, and icon-only layouts (both icon slots cannot
  be used together)
- Native button behavior plus disabled and loading states
- `aria-busy` conveys loading state and loading disables repeat activation
- Either icon slot becomes an `iconButton` automatically when no label is supplied
- All visual state values are semantic Button tokens. Native `:hover`, `:active`, and
  `:disabled` selectors apply the corresponding Hover, Pressed, and Disabled token set.
- Button icon slots inherit the button text color through `currentColor`.

```tsx
<Button mode="outline">Edit profile</Button>
<Button kind="danger" mode="ghost">Remove member</Button>
<Button mode="link">Learn more</Button>
<Button leadingIcon={<ArrowRightIcon />} aria-label="Continue" />
```

`link` is intentionally not available for `iconButton`; if requested for an icon-only layout, the
component uses the `primary` icon-button treatment.

### Icons

`PlusIcon` and `ArrowRightIcon` are exported from the library and used by the playground. Icons
use `currentColor`, accept only their documented `className`, `aria-label`, and
`aria-labelledby` props, and default to decorative (`aria-hidden`) unless an accessible SVG label is supplied. Button-provided icons are sized by the Button size tokens.

Run all required local gates before submitting:

```bash
npm run lint
npm run typecheck
npm run build
```

## CI/CD

`.github/workflows/ci.yml` runs on pushes and pull requests:

1. Install dependencies
2. Lint
3. Type check
4. Production package build

When a GitHub Release is published, the `publish` job rebuilds the package and publishes it to npm with provenance. Configure npm Trusted Publishing for the GitHub repository/package pair before enabling release publishing.

## Publishing and consuming

Update `name` and `version` in `package.json` for the intended npm scope, then create a GitHub Release after CI is green.

```tsx
import { Button } from '@faster-ui/react';
import '@faster-ui/react/styles.css';
```

## Next calibration pass

When final Figma component specifications are available, use the Inspect panel to map exact typography, dimensions, radii, elevation, color/state tokens, and responsive behavior into the token files.
