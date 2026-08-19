import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  value: jest.fn(),
});
