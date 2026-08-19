import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  component: {
    devServer: {
      bundler: 'vite',
      framework: 'react',
    },
    specPattern: 'cypress/component/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
});
