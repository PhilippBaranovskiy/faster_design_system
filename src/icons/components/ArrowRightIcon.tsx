import { forwardRef } from 'react';
import type { IconProps } from '../Icon.types';

export const ArrowRightIcon = forwardRef<SVGSVGElement, IconProps>(function ArrowRightIcon(
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
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
});

ArrowRightIcon.displayName = 'ArrowRightIcon';
