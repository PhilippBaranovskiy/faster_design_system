import type { MouseEventHandler, ReactNode } from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonKind = 'button' | 'danger' | 'iconButton';
export type ButtonMode = 'primary' | 'outline' | 'ghost' | 'link';

export interface ButtonProps {
  /** Button content. Omit this when rendering an icon-only button. */
  children?: ReactNode;
  /** Additional classes applied to the button element. */
  className?: string;
  /**
   * Visual intent. Icon-only layouts use `iconButton` automatically when this
   * prop is omitted.
   */
  kind?: ButtonKind;
  /** Visual treatment. `link` is unavailable for icon buttons and falls back to `primary`. */
  mode?: ButtonMode;
  /** Prevents user interaction. */
  disabled?: boolean;
  /** Accessible label for an icon-only button. */
  'aria-label'?: string;
  /** References the element that labels the button. */
  'aria-labelledby'?: string;
  /** References the element that describes the button. */
  'aria-describedby'?: string;
  /** Shows a busy state and prevents repeated clicks. */
  loading?: boolean;
  /** Optional icon displayed before the label. */
  leadingIcon?: ReactNode;
  /** Click handler for the button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Controls the button's dimensions and typography. */
  size?: ButtonSize;
  /** Optional icon displayed after the label. */
  trailingIcon?: ReactNode;
  /** Native button type. */
  type?: ButtonType;
}
