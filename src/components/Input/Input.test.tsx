import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { useState } from 'react';
import { MagnifierIcon } from '../../icons';
import { Input } from './Input';

describe('Input', () => {
  it('renders a native input and forwards its ref', () => {
    const ref = { current: null as HTMLInputElement | null };

    render(<Input ref={ref} aria-label="Search" placeholder="Search" />);

    const input = screen.getByRole('textbox', { name: 'Search' });

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Search');
    expect(ref.current).toBe(input);
    expect(input.closest('.faster-input')).toHaveClass('faster-input--medium');
  });

  it.each([
    ['sm', 'faster-input--small'],
    ['md', 'faster-input--medium'],
    ['lg', 'faster-input--large'],
  ] as const)('supports the %s size', (size, className) => {
    render(<Input aria-label="Name" size={size} />);

    expect(screen.getByRole('textbox', { name: 'Name' }).closest('.faster-input')).toHaveClass(
      className,
    );
  });

  it('uses prefix and suffix over matching icon slots', () => {
    render(
      <Input
        aria-label="Amount"
        prefix="$"
        suffix="USD"
        leftIcon={<MagnifierIcon />}
        rightIcon={<MagnifierIcon />}
      />,
    );

    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(document.querySelector('.faster-input__leading svg')).not.toBeInTheDocument();
    expect(document.querySelector('.faster-input__trailing svg')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Amount' }).closest('.faster-input')).toHaveClass(
      'faster-input--paired-affixes',
    );
  });

  it('supports a valid empty-string affix without falling back to the icon', () => {
    render(<Input aria-label="Search" prefix="" leftIcon={<MagnifierIcon />} />);

    expect(screen.getByRole('textbox', { name: 'Search' }).closest('.faster-input')).toHaveClass(
      'faster-input--single-affix',
    );
  });

  it('shows, clears, and returns focus to a non-empty uncontrolled input', async () => {
    const user = userEvent.setup();
    const onClear = jest.fn();
    const onChange = jest.fn();

    render(
      <Input aria-label="Search" defaultValue="Faster" onChange={onChange} onClear={onClear} />,
    );

    const input = screen.getByRole('textbox', { name: 'Search' });
    const clearButton = screen.getByRole('button', { name: 'Clear input' });

    await user.click(clearButton);

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
  });

  it('updates an uncontrolled value through typing and exposes the clear action', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Input aria-label="Search" onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Search' });

    await user.type(input, 'Faster');

    expect(input).toHaveValue('Faster');
    expect(onChange).toHaveBeenCalledTimes(6);
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
  });

  it('clears a controlled input when its parent responds to onChange', async () => {
    const user = userEvent.setup();

    function ControlledInput() {
      const [value, setValue] = useState('Faster');

      return (
        <Input
          aria-label="Search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }

    render(<ControlledInput />);

    await user.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('');
  });

  it('does not render the clear control when disabled or clearable is false', () => {
    const { rerender } = render(<Input aria-label="Search" defaultValue="Faster" disabled />);

    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();

    rerender(<Input aria-label="Search" defaultValue="Faster" clearable={false} />);

    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
  });

  it('renders a disabled input state and disables number controls', () => {
    render(<Input aria-label="Quantity" type="number" defaultValue="2" disabled />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    expect(input).toBeDisabled();
    expect(input.closest('.faster-input')).toHaveClass('faster-input--disabled');
    expect(input.closest('.faster-input')).toHaveAttribute('data-state', 'disabled');
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease value' })).toBeDisabled();
  });

  it('uses the error state, exposes the message, and reserves error-message space', () => {
    const { rerender } = render(<Input aria-label="Email" errorMessage="Enter a valid email." />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    const wrapper = input.closest('.faster-input');
    const message = screen.getByText('Enter a valid email.');

    expect(wrapper).toHaveClass('faster-input--error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', message.id);

    rerender(<Input aria-label="Email" />);

    expect(wrapper?.querySelector('.faster-input__error-message')).toBeInTheDocument();
  });

  it('combines external descriptions with an announced error message', () => {
    render(
      <>
        <span id="email-help">Use your work email address.</span>
        <Input
          id="email"
          aria-label="Email"
          aria-describedby="email-help"
          errorMessage="Enter a valid email."
        />
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    const errorMessage = screen.getByText('Enter a valid email.');

    expect(input).toHaveAttribute('aria-describedby', `email-help ${errorMessage.id}`);
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  it('adds a magnifier icon to search inputs and supports clearing them', () => {
    render(<Input aria-label="Search" type="search" defaultValue="Faster UI" />);

    expect(document.querySelector('.faster-input__leading svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
  });

  it('uses number controls and affixes while hiding decorative icons for number inputs', async () => {
    const user = userEvent.setup();

    render(
      <Input
        aria-label="Quantity"
        type="number"
        defaultValue="2"
        min="0"
        max="5"
        prefix="$"
        suffix="USD"
        leftIcon={<MagnifierIcon />}
        rightIcon={<MagnifierIcon />}
      />,
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(document.querySelector('.faster-input__leading svg')).not.toBeInTheDocument();
    expect(document.querySelector('.faster-input__trailing svg')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Increase value' }));
    expect(input).toHaveValue(3);

    await user.click(screen.getByRole('button', { name: 'Decrease value' }));
    expect(input).toHaveValue(2);
  });

  it('hides decorative icon slots for number inputs without affixes', () => {
    render(
      <Input
        aria-label="Quantity"
        type="number"
        leftIcon={<MagnifierIcon />}
        rightIcon={<MagnifierIcon />}
      />,
    );

    expect(document.querySelector('.faster-input__leading')).not.toBeInTheDocument();
    expect(document.querySelector('.faster-input__trailing')).not.toBeInTheDocument();
  });

  it('creates a clearable number input with currency adornments', () => {
    render(
      <Input
        aria-label="Price"
        currency="$"
        currencyCode="USD"
        defaultValue="12"
        leftIcon={<MagnifierIcon />}
        rightIcon={<MagnifierIcon />}
      />,
    );

    const input = screen.getByRole('spinbutton', { name: 'Price' });

    expect(input).toHaveAttribute('type', 'number');
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(document.querySelector('.faster-input__leading svg')).not.toBeInTheDocument();
    expect(document.querySelector('.faster-input__trailing svg')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('adds URL protocol and optional suffix adornments while preserving the clear action', () => {
    render(
      <Input
        aria-label="Website"
        type="url"
        urlProtocol="http://"
        urlSuffix=".dev"
        defaultValue="faster-ui"
      />,
    );

    expect(screen.getByText('http://')).toBeInTheDocument();
    expect(screen.getByText('.dev')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
  });

  it('renders filled chevrons', () => {
    const { container } = render(<Input aria-label="Quantity" type="number" />);

    const chevrons = container.querySelectorAll('.faster-input__chevron');

    expect(chevrons).toHaveLength(2);
    chevrons.forEach((chevron) => {
      expect(chevron).toHaveClass('faster-input__chevron');
      expect(chevron).toHaveAttribute('viewBox', '0 0 14 14');
    });
  });

  it('has no accessibility violations for a labelled input with clear and error states', async () => {
    const { container } = render(
      <Input
        aria-label="Search"
        defaultValue="Faster"
        leftIcon={<MagnifierIcon />}
        errorMessage="Try another search term."
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations for a labelled number input with controls', async () => {
    const { container } = render(
      <Input
        aria-label="Quantity"
        type="number"
        defaultValue="2"
        min="0"
        max="5"
        errorMessage="Quantity must be between 0 and 5."
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
