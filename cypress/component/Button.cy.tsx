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

  it('renders every button treatment and size', () => {
    cy.mount(
      <>
        <Button mode="outline">Outline</Button>
        <Button kind="danger" mode="ghost">
          Delete
        </Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
      </>,
    );

    cy.contains('button', 'Outline')
      .should('have.attr', 'data-mode', 'outline')
      .and('have.class', 'faster-button--button-outline');
    cy.contains('button', 'Delete')
      .should('have.attr', 'data-kind', 'danger')
      .and('have.class', 'faster-button--danger-ghost');
    cy.contains('button', 'Small').should('have.class', 'h-[var(--faster-button-small-height)]');
    cy.contains('button', 'Large').should('have.class', 'h-[var(--faster-button-large-height)]');
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
