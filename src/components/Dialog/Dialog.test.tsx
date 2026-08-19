import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import { Button } from '../Button';
import { Dialog } from './Dialog';

function renderDialog(overrides: Partial<React.ComponentProps<typeof Dialog>> = {}) {
  const onClose = jest.fn();

  render(
    <Dialog
      title="Delete project"
      onClose={onClose}
      footer={
        <>
          <Button mode="link">Cancel</Button>
          <Button>Delete</Button>
        </>
      }
      {...overrides}
    >
      This action cannot be undone.
    </Dialog>,
  );

  return { onClose };
}

describe('Dialog', () => {
  it('renders an accessible modal dialog with a close action and right-aligned footer', () => {
    const ref = createRef<HTMLDivElement>();
    const { onClose } = renderDialog({ ref });

    const dialog = screen.getByRole('dialog', { name: 'Delete project' });
    const overlay = dialog.parentElement;

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('data-size', 'md');
    expect(dialog).toHaveAttribute('data-variant', 'basic');
    expect(ref.current).toBe(dialog);
    expect(overlay?.parentElement).toBe(document.body);
    expect(overlay).toHaveClass('fixed', 'inset-0', 'overflow-hidden');
    expect(overlay).not.toHaveClass('overflow-y-auto');
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' }).parentElement).toHaveClass(
      'gap-[var(--faster-dialog-spacing-footer-actions)]',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['sm', 'max-w-[var(--faster-dialog-small-width)]'],
    ['md', 'max-w-[var(--faster-dialog-medium-width)]'],
    ['lg', 'max-w-[var(--faster-dialog-large-width)]'],
  ] as const)('supports the %s width', (size, widthClass) => {
    renderDialog({ size });

    expect(screen.getByRole('dialog')).toHaveClass(widthClass);
  });

  it('does not render when closed', () => {
    renderDialog({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('locks document scrolling and restores its styles and scroll position when closed', () => {
    const originalScrollX = window.scrollX;
    const originalScrollY = window.scrollY;
    const originalScrollTo = window.scrollTo;
    const scrollTo = jest.fn();

    Object.defineProperties(window, {
      scrollX: { configurable: true, value: 24 },
      scrollY: { configurable: true, value: 160 },
    });
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: scrollTo });

    const { rerender } = render(
      <Dialog title="Scroll lock" onClose={jest.fn()}>
        Dialog content
      </Dialog>,
    );

    expect(document.body).toHaveStyle({
      left: '-24px',
      overflow: 'hidden',
      position: 'fixed',
      right: '0px',
      top: '-160px',
      width: '100%',
    });

    rerender(
      <Dialog title="Scroll lock" open={false} onClose={jest.fn()}>
        Dialog content
      </Dialog>,
    );

    expect(document.body).toHaveStyle({
      left: '',
      overflow: '',
      position: '',
      right: '',
      top: '',
      width: '',
    });
    expect(scrollTo).toHaveBeenCalledWith(24, 160);

    Object.defineProperties(window, {
      scrollX: { configurable: true, value: originalScrollX },
      scrollY: { configurable: true, value: originalScrollY },
    });
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: originalScrollTo });
  });

  it('supports a compact basic layout, optional body icon, and a reserved body height', () => {
    renderDialog({
      bodyMinHeight: 160,
      footer: undefined,
      icon: <svg data-testid="dialog-icon" />,
    });

    const dialog = screen.getByRole('dialog');
    const body = document.getElementById(dialog.getAttribute('aria-describedby')!);

    expect(body).toHaveStyle({ minHeight: '160px' });
    expect(screen.getByTestId('dialog-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the warning preset attention icon and destructive primary footer Button', () => {
    renderDialog({
      icon: <svg data-testid="custom-dialog-icon" />,
      preset: 'warning',
    });

    const dialog = screen.getByRole('dialog');
    const attentionIcon = dialog.querySelector('svg.text-faster-warning-600');

    expect(dialog).toHaveAttribute('data-preset', 'warning');
    expect(attentionIcon).toBeInTheDocument();
    expect(attentionIcon).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByTestId('custom-dialog-icon')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-kind', 'danger');
  });

  it('uses a fixed-header scrollable layout', () => {
    renderDialog({ variant: 'scrollable' });

    const dialog = screen.getByRole('dialog');
    const body = document.getElementById(dialog.getAttribute('aria-describedby')!);

    expect(dialog).toHaveClass(
      'flex',
      'max-h-[calc(100dvh-(var(--faster-dialog-spacing-viewport-inset)*2))]',
    );
    expect(body).toHaveClass('flex-1', 'overflow-y-auto');
  });

  it('renders dividers only for the divided layout and when its footer is present', () => {
    const { rerender } = render(
      <Dialog
        title="Dialog title"
        variant="divider"
        onClose={jest.fn()}
        footer={<Button>Save</Button>}
      >
        Dialog content
      </Dialog>,
    );

    expect(
      screen.getByRole('dialog').querySelectorAll('[aria-hidden="true"].border-t'),
    ).toHaveLength(2);

    rerender(
      <Dialog title="Dialog title" variant="divider" onClose={jest.fn()}>
        Dialog content
      </Dialog>,
    );

    expect(
      screen.getByRole('dialog').querySelectorAll('[aria-hidden="true"].border-t'),
    ).toHaveLength(1);
  });

  it('closes with Escape by default and can disable Escape closing', async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    const disabledEscapeClose = jest.fn();
    render(
      <Dialog title="Non-dismissible" closeOnEscape={false} onClose={disabledEscapeClose}>
        Dialog content
      </Dialog>,
    );
    await user.keyboard('{Escape}');

    expect(disabledEscapeClose).not.toHaveBeenCalled();
  });

  it('only closes from the backdrop when that behavior is enabled', () => {
    const { onClose } = renderDialog();
    const overlay = screen.getByRole('dialog').parentElement!;

    fireEvent.mouseDown(overlay);
    expect(onClose).not.toHaveBeenCalled();

    const enabledBackdropClose = jest.fn();
    render(
      <Dialog title="Backdrop close" closeOnBackdropClick onClose={enabledBackdropClose}>
        Dialog content
      </Dialog>,
    );

    fireEvent.mouseDown(screen.getAllByRole('dialog')[1].parentElement!);
    expect(enabledBackdropClose).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    render(
      <Dialog title="Save draft" onClose={jest.fn()} footer={<Button>Save draft</Button>}>
        Your changes will be saved.
      </Dialog>,
    );

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
