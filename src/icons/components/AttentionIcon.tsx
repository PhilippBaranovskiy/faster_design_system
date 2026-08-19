import { forwardRef } from 'react';
import type { IconProps } from '../Icon.types';

export const AttentionIcon = forwardRef<SVGSVGElement, IconProps>(function AttentionIcon(
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
      focusable="false"
      className={className}
      aria-hidden={ariaLabel || ariaLabelledBy ? undefined : true}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="var(--faster-color-white)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path fill="currentColor" d="M11 6.5h2v7h-2v-7Zm0 9h2v2h-2v-2Z" />
    </svg>
  );
});

AttentionIcon.displayName = 'AttentionIcon';
