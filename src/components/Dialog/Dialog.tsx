import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { AttentionIcon, CloseIcon } from '../../icons';
import { cn } from '../../utils/cn';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { Button } from '../Button';
import type { DialogProps, DialogSize } from './Dialog.types';

const widthClasses: Record<DialogSize, string> = {
  sm: 'max-w-[var(--faster-dialog-small-width)]',
  md: 'max-w-[var(--faster-dialog-medium-width)]',
  lg: 'max-w-[var(--faster-dialog-large-width)]',
};

type DialogChild = ReturnType<typeof Children.toArray>[number];

function applyWarningPrimaryButton(footer: ReactNode): ReactNode {
  const footerChildren = Children.toArray(footer);

  for (let index = footerChildren.length - 1; index >= 0; index -= 1) {
    const [updatedChild, didUpdate] = updateLastButton(footerChildren[index]);

    if (didUpdate) {
      footerChildren[index] = updatedChild;
      break;
    }
  }

  return footerChildren;
}

function updateLastButton(node: DialogChild): [DialogChild, boolean] {
  if (!isValidElement(node)) {
    return [node, false];
  }

  if (node.type === Button) {
    return [
      cloneElement(node as ReactElement<ComponentProps<typeof Button>>, { kind: 'danger' }),
      true,
    ];
  }

  const element = node as ReactElement<{ children?: ReactNode }>;
  const children = Children.toArray(element.props.children);

  for (let index = children.length - 1; index >= 0; index -= 1) {
    const [updatedChild, didUpdate] = updateLastButton(children[index]);

    if (didUpdate) {
      children[index] = updatedChild;
      return [cloneElement(element, undefined, children), true];
    }
  }

  return [node, false];
}

/**
 * A modal dialog with basic, scrollable, and divided layouts.
 *
 * Use `footer` for right-aligned action buttons. The scrollable variant keeps
 * its title and footer visible while its body scrolls once the dialog reaches
 * the available viewport height. The warning preset adds its attention icon
 * and makes the primary footer Button destructive. Set `bodyMinHeight` when a
 * reserved body area is required for short content.
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    bodyClassName,
    bodyMinHeight,
    children,
    className,
    closeLabel = 'Close dialog',
    closeOnBackdropClick = false,
    closeOnEscape = true,
    footer,
    icon,
    onClose,
    open = true,
    preset,
    size = 'md',
    title,
    variant = 'basic',
    ...dialogProps
  },
  ref,
) {
  const generatedTitleId = useId();
  const generatedBodyId = useId();
  const titleId = ariaLabelledBy ?? generatedTitleId;
  const bodyId = ariaDescribedBy ?? generatedBodyId;
  const hasFooter = footer !== null && footer !== undefined;
  const isScrollable = variant === 'scrollable';
  const isDivider = variant === 'divider';
  const isWarning = preset === 'warning';
  const bodyIcon = isWarning ? <AttentionIcon className="text-faster-warning-600" /> : icon;
  const renderedFooter = isWarning && hasFooter ? applyWarningPrimaryButton(footer) : footer;

  useBodyScrollLock(open);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  const requestClose = () => {
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (closeOnEscape && event.key === 'Escape') {
      event.preventDefault();
      requestClose();
    }
  };

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      requestClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-faster-overlay p-[var(--faster-dialog-spacing-viewport-inset)]"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        {...dialogProps}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        data-size={size}
        data-variant={variant}
        data-preset={preset}
        onKeyDown={handleKeyDown}
        className={cn(
          'faster-dialog w-full rounded-[var(--faster-dialog-radius)] bg-faster-white text-faster-text-primary shadow-[var(--faster-shadow-elevation-4)]',
          widthClasses[size],
          isScrollable
            ? 'flex max-h-[calc(100dvh-(var(--faster-dialog-spacing-viewport-inset)*2))] flex-col overflow-hidden'
            : undefined,
          className,
        )}
      >
        <div
          className={cn(
            'flex items-start justify-between gap-4',
            isDivider
              ? 'px-[var(--faster-dialog-padding-divider)] pt-[var(--faster-dialog-padding-divider)]'
              : 'px-[var(--faster-dialog-padding-basic)] pt-[var(--faster-dialog-padding-basic)]',
          )}
        >
          <h2 id={generatedTitleId} className="faster-type-title m-0 min-w-0">
            {title}
          </h2>
          <Button
            aria-label={closeLabel}
            autoFocus
            leadingIcon={<CloseIcon />}
            mode="ghost"
            size="sm"
            onClick={requestClose}
          />
        </div>

        {isDivider ? (
          <div
            aria-hidden="true"
            className="mx-[var(--faster-dialog-padding-divider)] mt-[var(--faster-dialog-spacing-header-body)] border-t border-faster-border"
          />
        ) : null}

        <div
          id={generatedBodyId}
          style={bodyMinHeight === undefined ? undefined : { minHeight: bodyMinHeight }}
          className={cn(
            'faster-type-body',
            isDivider
              ? 'mx-[var(--faster-dialog-padding-divider)] mt-[var(--faster-dialog-spacing-header-body)]'
              : 'mx-[var(--faster-dialog-padding-basic)] mt-[var(--faster-dialog-spacing-header-body)]',
            isScrollable ? 'min-h-0 flex-1 overflow-y-auto' : undefined,
            bodyClassName,
          )}
        >
          {bodyIcon === null || bodyIcon === undefined ? (
            children
          ) : (
            <div className="flex items-start gap-[var(--faster-dialog-spacing-icon-body)]">
              <span aria-hidden="true" className="inline-flex shrink-0">
                {bodyIcon}
              </span>
              <div className="min-w-0 flex-1">{children}</div>
            </div>
          )}
        </div>

        {isDivider && hasFooter ? (
          <div
            aria-hidden="true"
            className="mx-[var(--faster-dialog-padding-divider)] mt-[var(--faster-dialog-spacing-divider-footer)] border-t border-faster-border"
          />
        ) : null}

        {hasFooter ? (
          <div
            className={cn(
              'flex justify-end gap-[var(--faster-dialog-spacing-footer-actions)]',
              isDivider
                ? 'px-[var(--faster-dialog-padding-divider)] pb-[var(--faster-dialog-padding-divider)] pt-[var(--faster-dialog-spacing-divider-footer)]'
                : 'px-[var(--faster-dialog-padding-basic)] pb-[var(--faster-dialog-padding-basic)] pt-[var(--faster-dialog-spacing-basic-footer)]',
            )}
          >
            {renderedFooter}
          </div>
        ) : (
          <div
            aria-hidden="true"
            className={
              isDivider
                ? 'h-[var(--faster-dialog-padding-divider)]'
                : 'h-[var(--faster-dialog-padding-basic)]'
            }
          />
        )}
      </div>
    </div>,
    document.body,
  );
});

Dialog.displayName = 'Dialog';
