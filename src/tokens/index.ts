import button from './button.json';
import colors from './colors.json';
import dialog from './dialog.json';
import input from './input.json';
import radius from './radius.json';
import shadow from './shadows.json';
import spacing from './spacing.json';
import typography from './typography.json';

const tokenDefinitions = {
  color: colors,
  dialog,
  input,
  radius,
  shadow,
  spacing,
  typography,
  button,
} as const;

type TokenValue = string | number | TokenGroup;
type TokenGroup = { readonly [key: string]: TokenValue };

const referencePattern = /^\{(.+)\}$/;

function getByPath(source: TokenGroup, path: string): TokenValue {
  return path.split('.').reduce<TokenValue>((value, key) => {
    if (typeof value === 'string' || typeof value === 'number') {
      throw new Error(`Token reference "${path}" does not resolve to a value.`);
    }

    const nextValue = value[key];

    if (nextValue === undefined) {
      throw new Error(`Token reference "${path}" does not exist.`);
    }

    return nextValue;
  }, source);
}

function resolveValue(value: TokenValue, source: TokenGroup): TokenValue {
  if (typeof value !== 'string') {
    return value;
  }

  const reference = value.match(referencePattern)?.[1];

  return reference ? resolveValue(getByPath(source, reference), source) : value;
}

function resolveGroup(group: TokenGroup, source: TokenGroup): TokenGroup {
  return Object.fromEntries(
    Object.entries(group).map(([key, value]) => [
      key,
      typeof value === 'object' ? resolveGroup(value, source) : resolveValue(value, source),
    ]),
  );
}

const resolvedTokenDefinitions = resolveGroup(
  tokenDefinitions as TokenGroup,
  tokenDefinitions as TokenGroup,
) as typeof tokenDefinitions;

export const colorTokens = resolvedTokenDefinitions.color;
export const dialogTokens = resolvedTokenDefinitions.dialog;
export const inputTokens = resolvedTokenDefinitions.input;
export const radiusTokens = resolvedTokenDefinitions.radius;
export const shadowTokens = resolvedTokenDefinitions.shadow;
export const spacingTokens = resolvedTokenDefinitions.spacing;
export const typographyTokens = resolvedTokenDefinitions.typography;
export const buttonTokens = resolvedTokenDefinitions.button;
