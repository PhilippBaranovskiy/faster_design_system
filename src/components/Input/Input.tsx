import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react';
import { MagnifierIcon } from '../../icons';
import { cn } from '../../utils/cn';
import type { InputProps, InputSize } from './Input.types';

const sizeClasses: Record<InputSize, string> = {
  sm: 'faster-input--small',
  md: 'faster-input--medium',
  lg: 'faster-input--large',
};

function hasValue(value: string | readonly string[] | number | undefined) {
  return value !== undefined && value !== null && String(value).length > 0;
}

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;

  valueSetter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function ClearIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg className="faster-input__chevron" aria-hidden="true" viewBox="0 0 14 14" focusable="false">
      <path d="m1 11 6-7 6 7h-2.1L7 6.2 3.1 11H1Z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="faster-input__chevron" aria-hidden="true" viewBox="0 0 14 14" focusable="false">
      <path d="M1 3h2.1L7 7.8 10.9 3H13l-6 7-6-7Z" />
    </svg>
  );
}

/**
 * A native input with optional leading and trailing content.
 *
 * Search inputs receive a magnifier icon. Currency inputs use a numeric field
 * with an optional currency symbol and notation. URL inputs display a protocol
 * and optional domain suffix. Explicit prefix and suffix props take precedence
 * over automatic adornments.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    clearable = true,
    currency,
    currencyCode,
    defaultValue,
    disabled = false,
    errorMessage,
    inputClassName,
    leftIcon,
    onChange,
    onClear,
    prefix,
    rightIcon,
    size = 'md',
    suffix,
    type = 'text',
    urlProtocol = 'https://',
    urlSuffix,
    value,
    ...inputProps
  },
  forwardedRef,
) {
  const generatedErrorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    hasValue(defaultValue) ? String(defaultValue) : '',
  );
  const inputType = currency !== undefined ? 'number' : type;
  const isNumberInput = inputType === 'number';
  const isSearchInput = inputType === 'search';
  const isUrlInput = inputType === 'url';
  const isControlled = value !== undefined;
  const valueIsNonEmpty = isControlled ? hasValue(value) : uncontrolledValue.length > 0;
  const hasError = errorMessage !== undefined && errorMessage !== null;
  const automaticLeading = currency ?? (isUrlInput ? urlProtocol : undefined);
  const automaticTrailing =
    currency !== undefined ? currencyCode : isUrlInput ? urlSuffix : undefined;
  const leading =
    prefix !== undefined
      ? prefix
      : automaticLeading !== undefined
        ? automaticLeading
        : isNumberInput
          ? undefined
          : (leftIcon ?? (isSearchInput ? <MagnifierIcon /> : undefined));
  const trailing =
    suffix !== undefined
      ? suffix
      : automaticTrailing !== undefined
        ? automaticTrailing
        : isNumberInput
          ? undefined
          : rightIcon;
  const hasLeading = leading !== undefined && leading !== null;
  const hasTrailing = trailing !== undefined && trailing !== null;
  const hasLeadingAffix = prefix !== undefined || automaticLeading !== undefined;
  const hasTrailingAffix = suffix !== undefined || automaticTrailing !== undefined;
  const affixGapClass =
    hasLeadingAffix || hasTrailingAffix
      ? hasLeadingAffix && hasTrailingAffix
        ? 'faster-input--paired-affixes'
        : 'faster-input--single-affix'
      : undefined;
  const externalDescribedBy = inputProps['aria-describedby'];
  const errorId = inputProps.id ? `${inputProps.id}-error` : generatedErrorId;
  const describedBy =
    [externalDescribedBy, hasError ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  useImperativeHandle(forwardedRef, () => inputRef.current!, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const input = inputRef.current;
    if (!input || disabled) {
      return;
    }

    setNativeInputValue(input, '');
    if (!isControlled) {
      setUncontrolledValue('');
    }
    onClear?.();
    focusInput();
  };

  const handleStep = (direction: 'up' | 'down') => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const input = inputRef.current;
    if (!input || disabled) {
      return;
    }

    if (direction === 'up') {
      input.stepUp();
    } else {
      input.stepDown();
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
    if (!isControlled) {
      setUncontrolledValue(input.value);
    }
    focusInput();
  };

  return (
    <div
      className={cn(
        'faster-input',
        sizeClasses[size],
        hasError && 'faster-input--error',
        disabled && 'faster-input--disabled',
        hasLeading && 'faster-input--has-leading',
        hasTrailing && 'faster-input--has-trailing',
        affixGapClass,
        className,
      )}
      data-size={size}
      data-state={disabled ? 'disabled' : hasError ? 'error' : undefined}
    >
      <div className="faster-input__control">
        {hasLeading ? (
          <span className="faster-input__leading" aria-hidden="true">
            {leading}
          </span>
        ) : null}
        <input
          {...inputProps}
          ref={inputRef}
          type={inputType}
          disabled={disabled}
          defaultValue={defaultValue}
          value={value}
          onChange={handleChange}
          aria-invalid={hasError || inputProps['aria-invalid'] || undefined}
          aria-describedby={describedBy}
          className={cn('faster-input__field', inputClassName)}
        />
        {clearable && valueIsNonEmpty && !disabled ? (
          <button
            type="button"
            className="faster-input__clear"
            aria-label="Clear input"
            onClick={handleClear}
          >
            <ClearIcon />
          </button>
        ) : null}
        {hasTrailing ? (
          <span className="faster-input__trailing" aria-hidden="true">
            {trailing}
          </span>
        ) : null}
        {isNumberInput ? (
          <span className="faster-input__number-control">
            <button
              type="button"
              tabIndex={-1}
              aria-label="Increase value"
              onClick={handleStep('up')}
              disabled={disabled}
            >
              <ChevronUpIcon />
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Decrease value"
              onClick={handleStep('down')}
              disabled={disabled}
            >
              <ChevronDownIcon />
            </button>
          </span>
        ) : null}
      </div>
      <div
        id={errorId}
        className="faster-input__error-message"
        aria-live={hasError ? 'polite' : undefined}
      >
        {errorMessage}
      </div>
    </div>
  );
});

Input.displayName = 'Input';
