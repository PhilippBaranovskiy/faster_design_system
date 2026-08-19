import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentType } from 'react';
import { Button } from '../Button';
import { Dialog } from './Dialog';
import type { DialogPreset, DialogSize, DialogVariant } from './Dialog.types';

type DialogStoryArgs = {
  bodyMinHeight?: number;
  closeOnBackdropClick: boolean;
  closeOnEscape: boolean;
  footer: boolean;
  icon: boolean;
  preset?: DialogPreset;
  size: DialogSize;
  title: string;
  variant: DialogVariant;
};

const dialogSizes = [
  { value: 'sm', label: 'Small', width: '400px' },
  { value: 'md', label: 'Medium', width: '600px' },
  { value: 'lg', label: 'Large', width: '900px' },
] as const satisfies ReadonlyArray<{ value: DialogSize; label: string; width: string }>;

const dialogVariants = [
  { value: 'basic', label: 'Basic' },
  { value: 'scrollable', label: 'Scrollable' },
  { value: 'divider', label: 'With divider' },
] as const satisfies ReadonlyArray<{ value: DialogVariant; label: string }>;

const storyArgs = {
  closeOnBackdropClick: false,
  closeOnEscape: true,
  footer: true,
  icon: false,
  preset: undefined,
  size: 'md',
  title: 'Project settings',
  variant: 'basic',
} satisfies DialogStoryArgs;

function DialogStory({
  bodyMinHeight,
  closeOnBackdropClick,
  closeOnEscape,
  footer,
  icon,
  preset,
  size,
  title,
  variant,
}: DialogStoryArgs) {
  const [open, setOpen] = useState(false);
  const isWarning = preset === 'warning';

  return (
    <>
      <Button kind={isWarning ? 'danger' : 'button'} mode="primary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        bodyMinHeight={bodyMinHeight}
        closeOnBackdropClick={closeOnBackdropClick}
        closeOnEscape={closeOnEscape}
        footer={
          footer ? (
            <>
              <Button mode="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                kind={isWarning ? 'danger' : 'button'}
                mode="primary"
                onClick={() => setOpen(false)}
              >
                {isWarning ? 'Delete' : 'Save changes'}
              </Button>
            </>
          ) : undefined
        }
        icon={icon ? <span className="faster-type-title">!</span> : undefined}
        onClose={() => setOpen(false)}
        open={open}
        preset={preset}
        size={size}
        title={title}
        variant={variant}
      >
        {variant === 'divider' ? (
          <DividerDialogContent />
        ) : variant === 'scrollable' ? (
          <ScrollableDialogContent />
        ) : (
          <p className="m-0">
            {isWarning
              ? 'Deleting this project will permanently remove its data and cannot be undone.'
              : 'Review your project settings and save your changes when you are ready.'}
          </p>
        )}
      </Dialog>
    </>
  );
}

function ScrollableDialogContent() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 24 }, (_, index) => (
        <p key={index} className="m-0">
          Project update {index + 1} is ready to review. The title and actions remain visible while
          this body uses native browser scrolling.
        </p>
      ))}
    </div>
  );
}

function DividerDialogContent() {
  return (
    <div className="space-y-3">
      <p className="m-0">
        Your project details are organized into clear sections so you can review them with
        confidence.
      </p>
      <p className="m-0">Save your changes when you are ready to keep your project up to date.</p>
    </div>
  );
}

function AllDialogCombinations() {
  const [selected, setSelected] = useState<{ size: DialogSize; variant: DialogVariant } | null>(
    null,
  );
  const selectedSize = dialogSizes.find(({ value }) => value === selected?.size);
  const selectedVariant = dialogVariants.find(({ value }) => value === selected?.variant);

  return (
    <div className="min-h-screen bg-faster-neutral-50 p-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <div>
          <h2 className="faster-type-title m-0">Dialog size and layout combinations</h2>
          <p className="faster-type-body mt-2 text-faster-text-secondary">
            Open each of the nine size and layout combinations. Scrollable variants include overflow
            content so the fixed header and footer can be inspected.
          </p>
        </div>
        <div className="overflow-x-auto rounded-[var(--faster-radius-button)] border border-faster-border bg-faster-white">
          <table className="faster-type-body w-full min-w-[42rem] border-collapse text-left">
            <thead>
              <tr className="faster-type-caption border-b border-faster-border uppercase tracking-[0.12em] text-faster-text-secondary [font-weight:var(--faster-typography-font-weight-medium)]">
                <th className="px-4 py-3">Configuration</th>
                {dialogSizes.map(({ label, width }) => (
                  <th key={label} className="px-4 py-3">
                    {label}
                    <span className="normal-case"> ({width})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dialogVariants.map(({ value: variant, label }) => (
                <tr key={variant} className="border-b border-faster-border last:border-b-0">
                  <th
                    scope="row"
                    className="px-4 py-3 [font-weight:var(--faster-typography-font-weight-medium)]"
                  >
                    {label}
                  </th>
                  {dialogSizes.map(({ value: size, label: sizeLabel }) => (
                    <td key={size} className="px-4 py-3">
                      <Button onClick={() => setSelected({ size, variant })}>
                        Open {sizeLabel}
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <Dialog
          title={`Project update / ${selectedVariant?.label} / ${selectedSize?.label}`}
          size={selected.size}
          variant={selected.variant}
          onClose={() => setSelected(null)}
          footer={
            <>
              <Button mode="ghost" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button onClick={() => setSelected(null)}>Continue</Button>
            </>
          }
        >
          {selected.variant === 'scrollable' ? (
            <ScrollableDialogContent />
          ) : selected.variant === 'divider' ? (
            <DividerDialogContent />
          ) : (
            <p className="m-0">
              Your project update uses the {selectedVariant?.label.toLowerCase()} layout at{' '}
              {selectedSize?.width}.
            </p>
          )}
        </Dialog>
      ) : null}
    </div>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog as unknown as ComponentType<DialogStoryArgs>,
  tags: ['autodocs'],
  args: storyArgs,
  argTypes: {
    bodyMinHeight: {
      control: 'number',
      description: 'Optional minimum body height in pixels.',
    },
    closeOnBackdropClick: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    footer: {
      control: 'boolean',
      description: 'Shows a secondary text action followed by a primary action.',
    },
    icon: {
      control: 'boolean',
      description: 'Shows the optional icon slot before the body content.',
    },
    preset: {
      control: 'radio',
      options: [undefined, 'warning'] satisfies (DialogPreset | undefined)[],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'] satisfies DialogSize[],
    },
    title: {
      control: 'text',
    },
    variant: {
      control: 'radio',
      options: ['basic', 'scrollable', 'divider'] satisfies DialogVariant[],
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A modal dialog in 400px, 600px, and 900px widths. The scrollable layout keeps its header and footer fixed, while the divider layout separates its sections with border lines.',
      },
    },
  },
  render: (args) => <DialogStory {...args} />,
} satisfies Meta<DialogStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Basic: Story = {
  args: {
    ...storyArgs,
    variant: 'basic',
  },
};

export const Scrollable: Story = {
  args: {
    ...storyArgs,
    bodyMinHeight: 180,
    variant: 'scrollable',
  },
  render: (args) => (
    <DialogStory
      {...args}
      bodyMinHeight={180}
      variant="scrollable"
      title="Review project details"
    />
  ),
};

export const WithDivider: Story = {
  args: {
    ...storyArgs,
    variant: 'divider',
  },
};

export const Warning: Story = {
  args: {
    ...storyArgs,
    preset: 'warning',
    title: 'Delete project?',
  },
};

export const MinimumBodyHeight: Story = {
  args: {
    ...storyArgs,
    bodyMinHeight: 160,
    footer: false,
  },
};

export const AllCombinations: Story = {
  name: 'All combinations',
  render: () => <AllDialogCombinations />,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Use the matrix to open every Basic, Scrollable, and With divider dialog at 400px, 600px, and 900px widths.',
      },
    },
  },
};
