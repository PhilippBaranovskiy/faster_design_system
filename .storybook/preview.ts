import type { Preview } from '@storybook/react-vite';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on.*',
    },
    controls: {
      expanded: true,
    },
    layout: 'centered',
  },
};

export default preview;
