import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType, MouseEventHandler } from 'react';
import { ArrowRightIcon } from '../../icons/components/ArrowRightIcon';
import { PlusIcon } from '../../icons/components/PlusIcon';
import { Button } from './Button';
import type { ButtonKind, ButtonMode, ButtonSize, ButtonType } from './Button.types';

type IconName = 'plus' | 'arrowRight';
type IconLayout = 'none' | 'leading' | 'trailing' | 'iconOnly';

type ButtonStoryArgs = {
  ariaLabel: string;
  disabled: boolean;
  iconLayout: IconLayout;
  iconName: IconName;
  kind: ButtonKind;
  label: string;
  loading: boolean;
  mode: ButtonMode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size: ButtonSize;
  type: ButtonType;
};

const storyArgs = {
  ariaLabel: 'Save changes',
  disabled: false,
  iconLayout: 'none',
  iconName: 'plus',
  kind: 'button',
  label: 'Save changes',
  loading: false,
  mode: 'primary',
  onClick: undefined,
  size: 'md',
  type: 'button',
} satisfies ButtonStoryArgs;

function renderButton({
  ariaLabel,
  disabled,
  iconLayout,
  iconName,
  kind,
  label,
  loading,
  mode,
  onClick,
  size,
  type,
}: ButtonStoryArgs) {
  const icon = iconName === 'plus' ? <PlusIcon /> : <ArrowRightIcon />;
  const commonProps = { disabled, kind, loading, mode, onClick, size, type };

  if (iconLayout === 'iconOnly') {
    return (
      <Button {...commonProps} leadingIcon={icon} aria-label={ariaLabel || label}>
        {undefined}
      </Button>
    );
  }

  if (iconLayout === 'leading') {
    return (
      <Button {...commonProps} leadingIcon={icon}>
        {label}
      </Button>
    );
  }

  if (iconLayout === 'trailing') {
    return (
      <Button {...commonProps} trailingIcon={icon}>
        {label}
      </Button>
    );
  }

  return <Button {...commonProps}>{label}</Button>;
}

const meta = {
  title: 'Components/Button',
  component: Button as unknown as ComponentType<ButtonStoryArgs>,
  tags: ['autodocs'],
  args: storyArgs,
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name used by an icon-only button.',
      name: 'aria-label',
    },
    disabled: {
      control: 'boolean',
    },
    iconLayout: {
      control: 'radio',
      options: ['none', 'leading', 'trailing', 'iconOnly'] satisfies IconLayout[],
    },
    iconName: {
      control: 'radio',
      options: ['plus', 'arrowRight'] satisfies IconName[],
    },
    kind: {
      control: 'select',
      options: ['button', 'danger', 'iconButton'] satisfies ButtonKind[],
    },
    label: {
      control: 'text',
      name: 'children',
    },
    loading: {
      control: 'boolean',
    },
    mode: {
      control: 'select',
      options: ['primary', 'outline', 'ghost', 'link'] satisfies ButtonMode[],
    },
    onClick: {
      action: 'clicked',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'] satisfies ButtonSize[],
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'] satisfies ButtonType[],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native button with token-driven treatments. Icon-only buttons require an accessible name; an icon-only button with `mode="link"` resolves to the primary IconButton treatment.',
      },
    },
  },
  render: renderButton,
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: 'Playground',
  args: storyArgs,
};

export const ButtonPrimary: Story = {
  name: 'Button / Primary',
  args: storyArgs,
};

export const ButtonOutline: Story = {
  name: 'Button / Outline',
  args: {
    ...storyArgs,
    mode: 'outline',
  },
};

export const ButtonGhost: Story = {
  name: 'Button / Ghost',
  args: {
    ...storyArgs,
    mode: 'ghost',
  },
};

export const ButtonLink: Story = {
  name: 'Button / Link',
  args: {
    ...storyArgs,
    mode: 'link',
  },
};

export const DangerPrimary: Story = {
  name: 'Danger / Primary',
  args: {
    ...storyArgs,
    kind: 'danger',
    label: 'Delete project',
  },
};

export const DangerOutline: Story = {
  name: 'Danger / Outline',
  args: {
    ...storyArgs,
    kind: 'danger',
    label: 'Delete project',
    mode: 'outline',
  },
};

export const DangerGhost: Story = {
  name: 'Danger / Ghost',
  args: {
    ...storyArgs,
    kind: 'danger',
    label: 'Delete project',
    mode: 'ghost',
  },
};

export const DangerLink: Story = {
  name: 'Danger / Link',
  args: {
    ...storyArgs,
    kind: 'danger',
    label: 'Delete project',
    mode: 'link',
  },
};

export const IconButtonPrimary: Story = {
  name: 'IconButton / Primary',
  args: {
    ...storyArgs,
    ariaLabel: 'Add item',
    iconLayout: 'iconOnly',
    kind: 'iconButton',
    label: 'Add item',
  },
};

export const IconButtonOutline: Story = {
  name: 'IconButton / Outline',
  args: {
    ...storyArgs,
    ariaLabel: 'Add item',
    iconLayout: 'iconOnly',
    kind: 'iconButton',
    label: 'Add item',
    mode: 'outline',
  },
};

export const IconButtonGhost: Story = {
  name: 'IconButton / Ghost',
  args: {
    ...storyArgs,
    ariaLabel: 'Add item',
    iconLayout: 'iconOnly',
    kind: 'iconButton',
    label: 'Add item',
    mode: 'ghost',
  },
};

export const IconButtonLinkResolution: Story = {
  name: 'IconButton / Link resolution',
  args: {
    ...storyArgs,
    ariaLabel: 'Add item',
    iconLayout: 'iconOnly',
    kind: 'iconButton',
    label: 'Add item',
    mode: 'link',
  },
  parameters: {
    docs: {
      description: {
        story:
          'IconButtons do not have a link treatment. Passing `mode="link"` intentionally resolves to the primary IconButton treatment.',
      },
    },
  },
};

export const AutomaticIconButton: Story = {
  name: 'Automatic IconButton',
  args: {
    ...storyArgs,
    ariaLabel: 'Add item',
    iconLayout: 'iconOnly',
    kind: 'button',
    label: 'Add item',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When icon-only content is used without an explicit `kind`, Button automatically selects the IconButton treatment.',
      },
    },
  },
};

export const LayoutsAndSizes: Story = {
  name: 'Layouts and sizes',
  args: storyArgs,
  render: () => (
    <div className="flex flex-col items-start gap-6 p-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          <Button size={size}>Continue</Button>
          <Button size={size} leadingIcon={<PlusIcon />}>
            Add item
          </Button>
          <Button size={size} trailingIcon={<ArrowRightIcon />}>
            Continue
          </Button>
          <Button size={size} leadingIcon={<PlusIcon />} aria-label="Add item" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Each row shows text-only, leading-icon, trailing-icon, and accessible icon-only layouts in small, medium, and large sizes.',
      },
    },
  },
};

export const Disabled: Story = {
  name: 'Disabled states',
  args: storyArgs,
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button disabled>Continue</Button>
      <Button mode="outline" disabled>
        Continue
      </Button>
      <Button mode="ghost" disabled>
        Continue
      </Button>
      <Button mode="link" disabled>
        Continue
      </Button>
      <Button kind="danger" disabled>
        Delete
      </Button>
      <Button kind="danger" mode="outline" disabled>
        Delete
      </Button>
      <Button kind="danger" mode="ghost" disabled>
        Delete
      </Button>
      <Button kind="danger" mode="link" disabled>
        Delete
      </Button>
      <Button leadingIcon={<PlusIcon />} aria-label="Add item" disabled />
      <Button leadingIcon={<PlusIcon />} aria-label="Add item" mode="outline" disabled />
      <Button leadingIcon={<PlusIcon />} aria-label="Add item" mode="ghost" disabled />
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Loading: Story = {
  name: 'Loading state',
  args: storyArgs,
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button loading>Save changes</Button>
      <Button mode="outline" loading>
        Save changes
      </Button>
      <Button kind="danger" loading>
        Delete project
      </Button>
      <Button leadingIcon={<PlusIcon />} aria-label="Add item" loading />
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Loading replaces the provided icon with a decorative spinner, sets `aria-busy`, and disables the native button to prevent repeated activation.',
      },
    },
  },
};

export const InteractionStates: Story = {
  name: 'Interaction states',
  args: storyArgs,
  render: () => (
    <div className="flex max-w-xl flex-col items-start gap-4 p-6">
      <p className="faster-type-body m-0 text-faster-text-secondary">
        Hover or press an enabled button to inspect its token-driven visual state. Use Tab to
        inspect the focus-visible outline.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Continue</Button>
        <Button mode="outline">Edit profile</Button>
        <Button kind="danger">Delete project</Button>
        <Button leadingIcon={<PlusIcon />} aria-label="Add item" />
      </div>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
