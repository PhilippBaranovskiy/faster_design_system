import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import type { ComponentType } from 'react';
import { Button } from './Button';

const TestIcon = () => <svg data-testid="test-icon" />;
const UnsafeButton = Button as unknown as ComponentType<Record<string, unknown>>;

describe('Button', () => {
  it('renders a native button with its default treatment', () => {
    const ref = { current: null as HTMLButtonElement | null };

    render(
      <Button ref={ref} data-testid="button">
        Continue
      </Button>,
    );

    const button = screen.getByTestId('button');

    expect(button).toHaveRole('button');
    expect(button).toHaveAccessibleName('Continue');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-kind', 'button');
    expect(button).toHaveAttribute('data-mode', 'primary');
    expect(button).toHaveClass('faster-button--button-primary');
    expect(ref.current).toBe(button);
  });

  it.each([
    ['button', 'primary', 'faster-button--button-primary'],
    ['button', 'outline', 'faster-button--button-outline'],
    ['button', 'ghost', 'faster-button--button-ghost'],
    ['button', 'link', 'faster-button--button-link'],
    ['danger', 'primary', 'faster-button--danger-primary'],
    ['danger', 'outline', 'faster-button--danger-outline'],
    ['danger', 'ghost', 'faster-button--danger-ghost'],
    ['danger', 'link', 'faster-button--danger-link'],
  ] as const)('applies the %s %s treatment', (kind, mode, className) => {
    render(
      <Button kind={kind} mode={mode}>
        Continue
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Continue' });

    expect(button).toHaveAttribute('data-kind', kind);
    expect(button).toHaveAttribute('data-mode', mode);
    expect(button).toHaveClass(className);
  });

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    render(<Button size={size}>Continue</Button>);

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute('data-kind', 'button');
  });

  it('renders leading and trailing icons as decorative content', () => {
    const { rerender } = render(<Button leadingIcon={<TestIcon />}>Add item</Button>);

    expect(screen.getByTestId('test-icon').parentElement).toHaveAttribute('aria-hidden', 'true');

    rerender(<Button trailingIcon={<TestIcon />}>Continue</Button>);

    expect(screen.getByTestId('test-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('automatically uses the icon button treatment and resolves link mode to primary', () => {
    render(
      <Button leadingIcon={<TestIcon />} aria-label="Add item" mode="link">
        {undefined}
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Add item' });

    expect(button).toHaveAttribute('data-kind', 'iconButton');
    expect(button).toHaveAttribute('data-mode', 'primary');
    expect(button).toHaveClass('faster-button--icon-button-primary');
  });

  it.each(['primary', 'outline', 'ghost'] as const)(
    'supports the %s icon button treatment',
    (mode) => {
      render(<Button leadingIcon={<TestIcon />} aria-label="Add item" mode={mode} />);

      expect(screen.getByRole('button', { name: 'Add item' })).toHaveAttribute('data-mode', mode);
    },
  );

  it('calls onClick for an enabled button', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Continue</Button>);

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents activation while disabled or loading', async () => {
    const user = userEvent.setup();
    const disabledClick = jest.fn();
    const loadingClick = jest.fn();

    const { rerender } = render(
      <Button disabled onClick={disabledClick}>
        Continue
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(disabledClick).not.toHaveBeenCalled();

    rerender(
      <Button loading onClick={loadingClick}>
        Continue
      </Button>,
    );

    const loadingButton = screen.getByRole('button', { name: 'Continue' });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();

    await user.click(loadingButton);
    expect(loadingClick).not.toHaveBeenCalled();
  });

  it('renders a decorative loading spinner while retaining the visible label', () => {
    render(<Button loading>Continue</Button>);

    const button = screen.getByRole('button', { name: 'Continue' });
    const spinner = button.querySelector('.animate-spin');

    expect(spinner).toBeInTheDocument();
    expect(spinner?.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('requires an accessible name for icon-only content', () => {
    expect(() => render(<UnsafeButton leadingIcon={<TestIcon />} />)).toThrow(
      'Button: icon-only buttons require either an aria-label or aria-labelledby prop.',
    );
  });

  it('rejects using both icon slots', () => {
    expect(() =>
      render(
        <UnsafeButton leadingIcon={<TestIcon />} trailingIcon={<TestIcon />}>
          Continue
        </UnsafeButton>,
      ),
    ).toThrow('Button: leadingIcon and trailingIcon cannot be used together.');
  });

  it('has no accessibility violations for text and icon-only buttons', async () => {
    const { container, rerender } = render(<Button leadingIcon={<TestIcon />}>Continue</Button>);

    expect(await axe(container)).toHaveNoViolations();

    rerender(<Button leadingIcon={<TestIcon />} aria-label="Add item" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
