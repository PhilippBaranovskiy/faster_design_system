import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonKind = 'button' | 'danger' | 'iconButton';
export type ButtonMode = 'primary' | 'outline' | 'ghost' | 'link';

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-label' | 'aria-labelledby' | 'children' | 'type'
>;

interface ButtonBaseProps extends NativeButtonProps {
  /** Accessible name, including for icon-only buttons. */
  'aria-label'?: string;
  /** References an element that names the button. */
  'aria-labelledby'?: string;
  /**
   * Visual intent. Icon-only layouts use `iconButton` automatically when this
   * prop is omitted.
   */
  kind?: ButtonKind;
  /** Visual treatment. `link` is unavailable for icon buttons and falls back to `primary`. */
  mode?: ButtonMode;
  /** Shows a busy state and prevents repeated clicks. */
  loading?: boolean;
  /** Controls the button's dimensions and typography. */
  size?: ButtonSize;
  /** Native button type. */
  type?: ButtonType;
}

type LeadingIconProps = {
  /** Optional icon displayed before the label. Cannot be combined with `trailingIcon`. */
  leadingIcon: ReactNode;
  trailingIcon?: never;
};

type TrailingIconProps = {
  leadingIcon?: never;
  /** Optional icon displayed after the label. Cannot be combined with `leadingIcon`. */
  trailingIcon: ReactNode;
};

type NoIconProps = {
  leadingIcon?: never;
  trailingIcon?: never;
};

type IconPlacementProps = LeadingIconProps | TrailingIconProps | NoIconProps;

type AccessibleNameProps =
  | {
      /** Accessible name for an icon-only button. */
      'aria-label': string;
    }
  | {
      /** References an element that names an icon-only button. */
      'aria-labelledby': string;
    };

type ButtonWithLabelProps = ButtonBaseProps &
  IconPlacementProps & {
    /** Visible button content. */
    children: ReactNode;
  };

type IconOnlyButtonProps = ButtonBaseProps &
  AccessibleNameProps &
  (
    | (LeadingIconProps & {
        /** Omit visible content when rendering an icon-only button. */
        children?: undefined;
      })
    | (TrailingIconProps & {
        /** Omit visible content when rendering an icon-only button. */
        children?: undefined;
      })
  );

/**
 * Button props include standard native `<button>` attributes such as `id`,
 * `name`, `value`, form attributes, event handlers, `data-*`, and additional
 * ARIA attributes. Icon-only buttons must provide an accessible name. A Button
 * can use one icon in either the leading or trailing slot, but not both.
 */
export type ButtonProps = ButtonWithLabelProps | IconOnlyButtonProps;
