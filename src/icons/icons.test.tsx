import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import { AttentionIcon } from './components/AttentionIcon';
import { ArrowRightIcon } from './components/ArrowRightIcon';
import { CloseIcon } from './components/CloseIcon';
import { MagnifierIcon } from './components/MagnifierIcon';
import { PlusIcon } from './components/PlusIcon';

const icons = [
  ['AttentionIcon', AttentionIcon],
  ['ArrowRightIcon', ArrowRightIcon],
  ['CloseIcon', CloseIcon],
  ['MagnifierIcon', MagnifierIcon],
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

  it('has no accessibility violations for decorative and labelled icons', async () => {
    const { container } = render(
      <>
        <AttentionIcon />
        <ArrowRightIcon />
        <MagnifierIcon aria-label="Search" />
        <span id="add-label">Add item</span>
        <PlusIcon aria-labelledby="add-label" />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the attention mark and circle in the current color on a white background', () => {
    const { container } = render(<AttentionIcon />);

    const circle = container.querySelector('circle');
    const mark = container.querySelector('path');

    expect(circle).toHaveAttribute('fill', 'var(--faster-color-white)');
    expect(circle).toHaveAttribute('stroke', 'currentColor');
    expect(mark).toHaveAttribute('fill', 'currentColor');
  });
});
