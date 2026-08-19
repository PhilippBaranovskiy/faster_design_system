import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { ButtonKind, ButtonMode, ButtonProps } from './Button.types';

const sizeClasses = {
  sm: {
    height: 'h-[var(--faster-button-small-height)]',
    icon: 'size-[var(--faster-button-small-icon-size)]',
    iconOnly: 'size-[var(--faster-button-small-height)]',
    minTextWidth: 'min-w-[var(--faster-button-small-min-text-width)]',
    padding: 'px-[var(--faster-button-small-padding-inline)]',
    typography:
      'text-[length:var(--faster-typography-styles-caption-font-size)] leading-[var(--faster-typography-styles-caption-line-height)] [font-weight:var(--faster-typography-font-weight-medium)]',
  },
  md: {
    height: 'h-[var(--faster-button-medium-height)]',
    icon: 'size-[var(--faster-button-medium-icon-size)]',
    iconOnly: 'size-[var(--faster-button-medium-height)]',
    minTextWidth: 'min-w-[var(--faster-button-medium-min-text-width)]',
    padding: 'px-[var(--faster-button-medium-padding-inline)]',
    typography:
      'text-[length:var(--faster-typography-styles-body-font-size)] leading-[var(--faster-typography-styles-body-line-height)] [font-weight:var(--faster-typography-font-weight-medium)]',
  },
  lg: {
    height: 'h-[var(--faster-button-large-height)]',
    icon: 'size-[var(--faster-button-large-icon-size)]',
    iconOnly: 'size-[var(--faster-button-large-height)]',
    minTextWidth: 'min-w-[var(--faster-button-large-min-text-width)]',
    padding: 'px-[var(--faster-button-large-padding-inline)]',
    typography:
      'text-[length:var(--faster-typography-styles-subtitle-font-size)] leading-[var(--faster-typography-styles-subtitle-line-height)] [font-weight:var(--faster-typography-font-weight-medium)]',
  },
} as const;

const visualClasses: Record<ButtonKind, Record<ButtonMode, string>> = {
  button: {
    primary: 'faster-button--button-primary',
    outline: 'faster-button--button-outline',
    ghost: 'faster-button--button-ghost',
    link: 'faster-button--button-link',
  },
  danger: {
    primary: 'faster-button--danger-primary',
    outline: 'faster-button--danger-outline',
    ghost: 'faster-button--danger-ghost',
    link: 'faster-button--danger-link',
  },
  iconButton: {
    primary: 'faster-button--icon-button-primary',
    outline: 'faster-button--icon-button-outline',
    ghost: 'faster-button--icon-button-ghost',
    // Link is not a specified IconButton mode. The component resolves it to primary.
    link: 'faster-button--icon-button-primary',
  },
};

/**
 * A native button with token-driven visual treatments.
 *
 * Props:
 * - `kind` selects the visual intent: standard `button`, destructive `danger`,
 *   or `iconButton`. Icon-only content uses `iconButton` automatically.
 * - `mode` selects the treatment: `primary`, `outline`, `ghost`, or `link`.
 * - `size` controls the component dimensions and label typography.
 * - One of `leadingIcon` or `trailingIcon` renders a decorative icon slot;
 *   the slots cannot be used together. Provide `aria-label` or
 *   `aria-labelledby` when rendering an icon-only button.
 * - `loading` shows a spinner and disables the native button to prevent
 *   repeated activation; `disabled`, `type`, and `onClick` retain their native
 *   button behavior.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled = false,
    kind,
    leadingIcon,
    loading = false,
    mode = 'primary',
    size = 'md',
    trailingIcon,
    type = 'button',
    ...buttonProps
  },
  ref,
) {
  const ariaLabel = buttonProps['aria-label'];
  const ariaLabelledBy = buttonProps['aria-labelledby'];
  const isDisabled = disabled || loading;
  const hasLabel =
    typeof children === 'string'
      ? children.trim().length > 0
      : children !== null && children !== undefined && typeof children !== 'boolean';
  const hasLeadingIcon = leadingIcon !== null && leadingIcon !== undefined;
  const hasTrailingIcon = trailingIcon !== null && trailingIcon !== undefined;
  const isIconOnly = !hasLabel && (hasLeadingIcon || hasTrailingIcon);

  if (hasLeadingIcon && hasTrailingIcon) {
    throw new Error('Button: leadingIcon and trailingIcon cannot be used together.');
  }

  if (isIconOnly && !ariaLabel && !ariaLabelledBy) {
    throw new Error(
      'Button: icon-only buttons require either an aria-label or aria-labelledby prop.',
    );
  }

  const buttonKind = kind ?? (isIconOnly ? 'iconButton' : 'button');
  const buttonMode = buttonKind === 'iconButton' && mode === 'link' ? 'primary' : mode;
  const currentSize = sizeClasses[size];
  const currentVisualClass = visualClasses[buttonKind][buttonMode];
  const icon = loading ? (
    <span className="size-full animate-spin rounded-full border-2 border-current border-t-transparent" />
  ) : (
    (leadingIcon ?? trailingIcon)
  );

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-kind={buttonKind}
      data-mode={buttonMode}
      className={cn(
        'faster-button inline-flex shrink-0 items-center justify-center whitespace-nowrap',
        'disabled:cursor-not-allowed',
        currentVisualClass,
        currentSize.height,
        currentSize.typography,
        isIconOnly
          ? cn(currentSize.iconOnly, 'rounded-[var(--faster-radius-full)]')
          : cn(
              'rounded-[var(--faster-radius-button)]',
              currentSize.minTextWidth,
              currentSize.padding,
              hasLeadingIcon || hasTrailingIcon
                ? 'gap-[var(--faster-spacing-button-icon-label-gap)]'
                : undefined,
            ),
        className,
      )}
    >
      {hasLeadingIcon || loading ? (
        <span
          aria-hidden="true"
          className={cn(
            'faster-button__icon inline-flex shrink-0 [&>svg]:block [&>svg]:size-full',
            currentSize.icon,
          )}
        >
          {icon}
        </span>
      ) : null}
      {hasLabel ? <span>{children}</span> : null}
      {hasLabel && hasTrailingIcon && !loading ? (
        <span
          aria-hidden="true"
          className={cn(
            'faster-button__icon inline-flex shrink-0 [&>svg]:block [&>svg]:size-full',
            currentSize.icon,
          )}
        >
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});

Button.displayName = 'Button';
