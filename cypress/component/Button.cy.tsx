import { Button } from '../../src/components/Button';

const TestIcon = () => <svg data-cy="test-icon" />;

describe('Button', () => {
  it('mounts and renders its default treatment', () => {
    cy.mount(<Button>Continue</Button>);

    cy.contains('button', 'Continue')
      .should('have.attr', 'type', 'button')
      .and('have.attr', 'data-kind', 'button')
      .and('have.attr', 'data-mode', 'primary')
      .and('have.class', 'faster-button--button-primary');
  });

  it('renders an accessible icon-only button and resolves link mode to primary', () => {
    cy.mount(<Button leadingIcon={<TestIcon />} aria-label="Add item" mode="link" />);

    cy.get('button[aria-label="Add item"]')
      .should('have.attr', 'data-kind', 'iconButton')
      .and('have.attr', 'data-mode', 'primary');
    cy.get('[data-cy="test-icon"]').should('exist');
  });

  it('invokes an enabled button click handler', () => {
    const onClick = cy.spy().as('onClick');

    cy.mount(<Button onClick={onClick}>Continue</Button>);
    cy.contains('button', 'Continue').click();

    cy.get('@onClick').should('have.been.calledOnce');
  });

  it('renders disabled and loading buttons as unavailable', () => {
    cy.mount(
      <>
        <Button disabled>Disabled</Button>
        <Button loading>Saving</Button>
      </>,
    );

    cy.contains('button', 'Disabled').should('be.disabled');
    cy.contains('button', 'Saving')
      .should('be.disabled')
      .and('have.attr', 'aria-busy', 'true')
      .find('.animate-spin')
      .should('exist');
  });
});
