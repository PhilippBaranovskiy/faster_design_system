import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type DialogSize = 'sm' | 'md' | 'lg';
export type DialogVariant = 'basic' | 'scrollable' | 'divider';
export type DialogPreset = 'warning';

type NativeDialogProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'aria-describedby' | 'aria-labelledby' | 'children' | 'role' | 'title'
>;

export interface DialogProps extends NativeDialogProps {
  /** References content that describes the dialog. */
  'aria-describedby'?: string;
  /** References an element that labels the dialog instead of its visible title. */
  'aria-labelledby'?: string;
  /** The content displayed in the dialog body. */
  children: ReactNode;
  /** Visible dialog heading. */
  title: ReactNode;
  /** Additional classes applied to the body content region. */
  bodyClassName?: string;
  /**
   * A minimum body height. Omit it to let basic and divider dialogs remain
   * compact when their content is short.
   */
  bodyMinHeight?: CSSProperties['minHeight'];
  /** Enables closing the dialog by pressing Escape. */
  closeOnEscape?: boolean;
  /** Enables closing the dialog by pressing the backdrop. */
  closeOnBackdropClick?: boolean;
  /** Accessible label for the close control. */
  closeLabel?: string;
  /** Optional footer actions, displayed right-aligned with an 8px gap. */
  footer?: ReactNode;
  /** Optional icon displayed before the dialog body content. */
  icon?: ReactNode;
  /**
   * Applies a semantic dialog treatment. The warning preset displays an
   * attention icon and changes the primary footer Button to `kind="danger"`.
   */
  preset?: DialogPreset;
  /** Called when the close button, enabled backdrop, or Escape requests a close. */
  onClose: () => void;
  /** Whether the dialog is rendered. */
  open?: boolean;
  /** Controls the 400px, 600px, or 900px maximum width. */
  size?: DialogSize;
  /** Dialog layout: compact basic, fixed-header scrollable, or divided sections. */
  variant?: DialogVariant;
}
