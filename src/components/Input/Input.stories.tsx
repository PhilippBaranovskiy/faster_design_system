import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MagnifierIcon } from '../../icons';
import { Input } from './Input';
import type { InputProps, InputSize } from './Input.types';

type InputStoryArgs = {
  clearable: boolean;
  currency: string;
  currencyCode: string;
  disabled: boolean;
  errorMessage: string;
  prefix: string;
  size: InputSize;
  suffix: string;
  type: InputProps['type'];
  urlProtocol: string;
  urlSuffix: string;
};

const storyArgs = {
  clearable: true,
  currency: '',
  currencyCode: '',
  disabled: false,
  errorMessage: '',
  prefix: '',
  size: 'md',
  suffix: '',
  type: 'text',
  urlProtocol: 'https://',
  urlSuffix: '',
} satisfies InputStoryArgs;

function ControlledInput({
  clearable,
  currency,
  currencyCode,
  disabled,
  errorMessage,
  prefix,
  size,
  suffix,
  type,
  urlProtocol,
  urlSuffix,
}: InputStoryArgs) {
  const [value, setValue] = useState('');
  const isNumber = type === 'number' || currency !== '';

  return (
    <Input
      aria-label="Example input"
      clearable={clearable}
      currency={currency === '' ? undefined : currency}
      currencyCode={currencyCode === '' ? undefined : currencyCode}
      disabled={disabled}
      errorMessage={errorMessage || undefined}
      leftIcon={isNumber ? undefined : <MagnifierIcon />}
      placeholder={isNumber ? '0' : 'Search'}
      prefix={prefix === '' ? undefined : prefix}
      size={size}
      suffix={suffix === '' ? undefined : suffix}
      type={type}
      urlProtocol={urlProtocol}
      urlSuffix={urlSuffix === '' ? undefined : urlSuffix}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: storyArgs,
  argTypes: {
    clearable: { control: 'boolean' },
    currency: { control: 'text' },
    currencyCode: { control: 'text' },
    disabled: { control: 'boolean' },
    errorMessage: { control: 'text' },
    prefix: { control: 'text' },
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
          'A native input with token-driven interaction states. Search inputs add a magnifier icon, currency inputs become number inputs with currency adornments, and URL inputs add a protocol with an optional suffix. Explicit prefix and suffix content takes precedence over automatic adornments.',
      },
    },
  },
  render: (args) => <ControlledInput {...args} />,
} satisfies Meta<InputStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcons: Story = {
  render: () => (
    <Input
      aria-label="Search"
      defaultValue="Faster UI"
      leftIcon={<MagnifierIcon />}
      placeholder="Search"
    />
  ),
};

export const Affixes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
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

export const AutomaticInputTypes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input aria-label="Search" type="search" defaultValue="Faster UI" placeholder="Search" />
      <Input aria-label="Price in dollars" currency="$" defaultValue="10" min="0" />
      <Input
        aria-label="Price in US dollars"
        currency="$"
        currencyCode="USD"
        defaultValue="10"
        min="0"
      />
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

export const Number: Story = {
  render: () => <Input aria-label="Quantity" type="number" defaultValue="1" min="0" max="10" />,
};

export const StatesAndSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-5">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input
          key={size}
          aria-label={`${size} search`}
          size={size}
          leftIcon={<MagnifierIcon />}
          placeholder={size}
        />
      ))}
      <Input aria-label="Error" errorMessage="Enter a valid email address." placeholder="Email" />
      <Input
        aria-label="Disabled"
        disabled
        defaultValue="Unavailable"
        leftIcon={<MagnifierIcon />}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
