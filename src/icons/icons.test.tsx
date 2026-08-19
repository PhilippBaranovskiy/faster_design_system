import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { ArrowRightIcon } from './components/ArrowRightIcon';
import { PlusIcon } from './components/PlusIcon';

const icons = [
  ['ArrowRightIcon', ArrowRightIcon],
  ['PlusIcon', PlusIcon],
] as const;

describe('icons', () => {
  it.each(icons)('%s is decorative by default and forwards its ref and class', (_name, Icon) => {
    const ref = createRef<SVGSVGElement>();

    const { container } = render(<Icon ref={ref} className="custom-icon" />);

    const icon = container.querySelector('svg');

    expect(ref.current).toBe(icon);
    expect(icon).toHaveClass('custom-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('focusable', 'false');
  });

  it.each(icons)('%s exposes an accessible name when labelled', (_name, Icon) => {
    render(<Icon aria-label="Action icon" />);

    const icon = screen.getByLabelText('Action icon');

    expect(icon).not.toHaveAttribute('aria-hidden');
    expect(icon).toHaveAttribute('focusable', 'false');
  });

  it.each(icons)('%s can be labelled by another element', (_name, Icon) => {
    render(
      <>
        <span id="icon-label">Action icon</span>
        <Icon aria-labelledby="icon-label" />
      </>,
    );

    const icon = screen.getByLabelText('Action icon');

    expect(icon).toHaveAttribute('aria-labelledby', 'icon-label');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });
});
