import { ArrowRightIcon, PlusIcon } from '../../src/icons';

describe('icons', () => {
  it('mounts decorative icons', () => {
    cy.mount(
      <>
        <ArrowRightIcon />
        <PlusIcon />
      </>,
    );

    cy.get('svg').should('have.length', 2).and('have.attr', 'aria-hidden', 'true');
  });

  it('renders a labelled icon accessibly', () => {
    cy.mount(<PlusIcon aria-label="Add item" />);

    cy.get('svg[aria-label="Add item"]').should('not.have.attr', 'aria-hidden');
  });
});
