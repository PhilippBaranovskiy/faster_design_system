import process from 'node:process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { tokenDefinitions } from '../src/tokens/token-definitions.mjs';

const outputPath = resolve('src/styles/tokens.css');
const check = process.argv.includes('--check');
const referencePattern = /^\{(.+)\}$/;

function getByPath(source, path) {
  return path.split('.').reduce((value, key) => {
    if (value === null || typeof value !== 'object' || !(key in value)) {
      throw new Error(`Token reference "${path}" does not exist.`);
    }

    return value[key];
  }, source);
}

function resolveValue(value) {
  if (typeof value !== 'string') {
    return value;
  }

  const reference = value.match(referencePattern)?.[1];

  return reference ? resolveValue(getByPath(tokenDefinitions, reference)) : value;
}

const toKebabCase = (value) => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const normalizeCssValue = (value) =>
  typeof value === 'string' && value.startsWith('#') ? value.toLowerCase() : value;

function toCustomProperties(group, prefix) {
  return Object.entries(group).flatMap(([key, value]) => {
    const name = `${prefix}-${toKebabCase(key)}`;

    if (value !== null && typeof value === 'object') {
      return toCustomProperties(value, name);
    }

    return [`  ${name}: ${normalizeCssValue(resolveValue(value))};`];
  });
}

const properties = [...toCustomProperties(tokenDefinitions, '--faster')];

const prettierConfig = await resolveConfig(outputPath);
const css = await format(
  `/* Generated from src/tokens/*.json. Do not edit directly. */\n:root {\n${properties.join(
    '\n',
  )}\n}\n`,
  { ...prettierConfig, filepath: outputPath },
);

if (check) {
  const existingCss = await readFile(outputPath, 'utf8');

  if (existingCss !== css) {
    throw new Error(
      'src/styles/tokens.css is out of date. Run "npm run build:tokens" and commit the result.',
    );
  }
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, css);
}
