import { ArrowRightIcon, MagnifierIcon, PlusIcon } from '../../src/icons';

describe('icons', () => {
  it('mounts decorative icons', () => {
    cy.mount(
      <>
        <ArrowRightIcon />
        <MagnifierIcon />
        <PlusIcon />
      </>,
    );

    cy.get('svg').should('have.length', 3).and('have.attr', 'aria-hidden', 'true');
  });

  it('renders a labelled icon accessibly', () => {
    cy.mount(<PlusIcon aria-label="Add item" />);

    cy.get('svg[aria-label="Add item"]').should('not.have.attr', 'aria-hidden');
    cy.get('svg[aria-label="Add item"]').should('have.attr', 'focusable', 'false');
  });

  it('uses an external label when aria-labelledby is provided', () => {
    cy.mount(
      <>
        <span id="icon-label">Add item</span>
        <PlusIcon aria-labelledby="icon-label" />
      </>,
    );

    cy.get('svg[aria-labelledby="icon-label"]').should('not.have.attr', 'aria-hidden');
  });
});
