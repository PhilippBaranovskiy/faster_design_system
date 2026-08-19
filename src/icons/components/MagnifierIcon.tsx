import { forwardRef } from 'react';
import type { IconProps } from '../Icon.types';

export const MagnifierIcon = forwardRef<SVGSVGElement, IconProps>(function MagnifierIcon(
  { className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy },
  ref,
) {
  return (
    <svg
      ref={ref}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={className}
      aria-hidden={ariaLabel || ariaLabelledBy ? undefined : true}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
});

MagnifierIcon.displayName = 'MagnifierIcon';
