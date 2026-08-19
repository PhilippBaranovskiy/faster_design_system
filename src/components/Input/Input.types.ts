import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

type NativeInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'className' | 'prefix' | 'size' | 'suffix'
>;

export interface InputProps extends NativeInputProps {
  /** Additional classes applied to the component's outer wrapper. */
  className?: string;
  /** Additional classes applied to the native input element. */
  inputClassName?: string;
  /** Controls the component's dimensions and input typography. */
  size?: InputSize;
  /** Content that takes precedence over `leftIcon` when provided. */
  prefix?: ReactNode;
  /** Currency symbol displayed before a numeric input and used to set `type="number"`. */
  currency?: string;
  /** Currency notation displayed after a currency input, such as `USD` or `EUR`. */
  currencyCode?: string;
  /** Decorative content displayed before the editable field. */
  leftIcon?: ReactNode;
  /** Content that takes precedence over `rightIcon` when provided. */
  suffix?: ReactNode;
  /** Decorative content displayed after the clear control. */
  rightIcon?: ReactNode;
  /** Protocol displayed before a URL input. Defaults to `https://` for `type="url"`. */
  urlProtocol?: string;
  /** Optional domain suffix displayed after a URL input, such as `.com`. */
  urlSuffix?: string;
  /** Enables the clear control for non-empty, non-number inputs. */
  clearable?: boolean;
  /** Called after the clear control requests that the input value be emptied. */
  onClear?: () => void;
  /** Error text displayed below the control and used to set the invalid state. */
  errorMessage?: ReactNode;
}
