import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { MagnifierIcon } from '../../icons';
import { Input } from './Input';
import type { InputProps, InputSize } from './Input.types';

type IconOption = 'none' | 'magnifier';

type InputStoryArgs = {
  ariaLabel: string;
  clearable: boolean;
  currency: string;
  currencyCode: string;
  defaultValue: string;
  disabled: boolean;
  errorMessage: string;
  leftIcon: IconOption;
  onClear?: () => void;
  placeholder: string;
  prefix: string;
  rightIcon: IconOption;
  size: InputSize;
  suffix: string;
  type: InputProps['type'];
  urlProtocol: string;
  urlSuffix: string;
};

const storyArgs = {
  ariaLabel: 'Example input',
  clearable: true,
  currency: '',
  currencyCode: '',
  defaultValue: '',
  disabled: false,
  errorMessage: '',
  leftIcon: 'none',
  onClear: undefined,
  placeholder: 'Enter a value',
  prefix: '',
  rightIcon: 'none',
  size: 'md',
  suffix: '',
  type: 'text',
  urlProtocol: 'https://',
  urlSuffix: '',
} satisfies InputStoryArgs;

function ControlledInput({
  ariaLabel,
  clearable,
  currency,
  currencyCode,
  defaultValue,
  disabled,
  errorMessage,
  leftIcon,
  onClear,
  placeholder,
  prefix,
  rightIcon,
  size,
  suffix,
  type,
  urlProtocol,
  urlSuffix,
}: InputStoryArgs) {
  const [value, setValue] = useState(defaultValue);
  const isNumber = type === 'number' || currency !== '';
  const selectedLeftIcon = leftIcon === 'magnifier' ? <MagnifierIcon /> : undefined;
  const selectedRightIcon = rightIcon === 'magnifier' ? <MagnifierIcon /> : undefined;

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Input
      aria-label={ariaLabel}
      clearable={clearable}
      currency={currency === '' ? undefined : currency}
      currencyCode={currencyCode === '' ? undefined : currencyCode}
      disabled={disabled}
      errorMessage={errorMessage || undefined}
      leftIcon={isNumber ? undefined : selectedLeftIcon}
      placeholder={placeholder}
      prefix={prefix === '' ? undefined : prefix}
      rightIcon={isNumber ? undefined : selectedRightIcon}
      size={size}
      suffix={suffix === '' ? undefined : suffix}
      type={type}
      urlProtocol={urlProtocol}
      urlSuffix={urlSuffix === '' ? undefined : urlSuffix}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={onClear}
    />
  );
}

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: storyArgs,
  argTypes: {
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
    },
    clearable: { control: 'boolean' },
    currency: { control: 'text' },
    currencyCode: { control: 'text' },
    defaultValue: {
      control: 'text',
      description: 'The value used when the Playground resets.',
    },
    disabled: { control: 'boolean' },
    errorMessage: { control: 'text' },
    leftIcon: {
      control: 'radio',
      options: ['none', 'magnifier'] satisfies IconOption[],
    },
    onClear: { action: 'cleared' },
    placeholder: { control: 'text' },
    prefix: { control: 'text' },
    rightIcon: {
      control: 'radio',
      options: ['none', 'magnifier'] satisfies IconOption[],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'] satisfies InputSize[],
    },
    suffix: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'search', 'number', 'email', 'password', 'url'] satisfies NonNullable<
        InputProps['type']
      >[],
    },
    urlProtocol: { control: 'text' },
    urlSuffix: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native input with token-driven interaction states. Use the Playground to combine all public visual and behavioral props. Search inputs add a magnifier icon, currency inputs become number inputs with currency adornments, and URL inputs add a protocol with an optional suffix. Explicit prefix and suffix content takes precedence over automatic adornments.',
      },
    },
  },
  render: (args) => <ControlledInput {...args} />,
} satisfies Meta<InputStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls to explore sizes, native input types, automatic adornments, explicit affixes, icons, clear behavior, disabled state, and validation feedback.',
      },
    },
  },
};

export const Text: Story = {
  render: () => (
    <Input aria-label="Project name" defaultValue="Faster UI" placeholder="Project name" />
  ),
};

export const Search: Story = {
  render: () => (
    <Input aria-label="Search" type="search" defaultValue="Faster UI" placeholder="Search" />
  ),
};

export const Number: Story = {
  render: () => <Input aria-label="Quantity" type="number" defaultValue="1" min="0" max="10" />,
};

export const Currency: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input aria-label="Price in dollars" currency="$" defaultValue="10" min="0" />
      <Input
        aria-label="Price in US dollars"
        currency="$"
        currencyCode="USD"
        defaultValue="10"
        min="0"
      />
    </div>
  ),
};

export const Url: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input aria-label="Website" type="url" defaultValue="faster-ui" />
      <Input
        aria-label="Company website"
        type="url"
        urlProtocol="http://"
        urlSuffix=".dev"
        defaultValue="faster-ui"
      />
    </div>
  ),
};

export const IconsAndAffixes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input
        aria-label="Search"
        defaultValue="Faster UI"
        leftIcon={<MagnifierIcon />}
        placeholder="Search"
      />
      <Input
        aria-label="Price"
        type="number"
        defaultValue="10"
        min="0"
        prefix="$"
        placeholder="0.00"
      />
      <Input
        aria-label="Weight"
        type="number"
        defaultValue="1"
        min="0"
        placeholder="0"
        suffix="kg"
      />
      <Input
        aria-label="Amount"
        type="number"
        defaultValue="10"
        min="0"
        prefix="$"
        placeholder="0.00"
        suffix="USD"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input
          key={size}
          aria-label={`${size} search`}
          size={size}
          leftIcon={<MagnifierIcon />}
          placeholder={size}
        />
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Error: Story = {
  name: 'Error state',
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input
        aria-label="Email address"
        errorMessage="Enter a valid email address."
        placeholder="name@example.com"
        type="email"
      />
      <Input
        aria-label="Amount"
        currency="$"
        currencyCode="USD"
        defaultValue="0"
        errorMessage="Enter an amount greater than zero."
        min="0"
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Disabled: Story = {
  name: 'Disabled state',
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input aria-label="Disabled text input" disabled defaultValue="Unavailable" />
      <Input
        aria-label="Disabled search input"
        disabled
        defaultValue="Faster UI"
        leftIcon={<MagnifierIcon />}
      />
      <Input
        aria-label="Disabled price input"
        currency="$"
        currencyCode="USD"
        disabled
        defaultValue="10"
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const InteractionStates: Story = {
  name: 'Interaction states',
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <p className="faster-type-body m-0 text-faster-text-secondary">
        Focus the field, enter a value, clear it, and use the number steppers to inspect native
        focus, hover, active, and keyboard interaction states.
      </p>
      <Input aria-label="Search projects" clearable placeholder="Search projects" type="search" />
      <Input aria-label="Quantity" clearable defaultValue="1" min="0" type="number" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
