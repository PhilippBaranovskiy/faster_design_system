import { MagnifierIcon } from '../../src/icons';
import { Input } from '../../src/components/Input';

describe('Input', () => {
  it('mounts a default input with its native semantics', () => {
    cy.mount(<Input aria-label="Search" placeholder="Search" />);

    cy.get('input[aria-label="Search"]')
      .should('have.attr', 'type', 'text')
      .and('have.attr', 'placeholder', 'Search');
    cy.get('.faster-input').should('have.class', 'faster-input--medium');
  });

  it('accepts input, exposes its clear control, and clears an uncontrolled value', () => {
    const onChange = cy.spy().as('onChange');
    const onClear = cy.spy().as('onClear');

    cy.mount(<Input aria-label="Search" onChange={onChange} onClear={onClear} />);

    cy.get('input[aria-label="Search"]').type('Faster').should('have.value', 'Faster');
    cy.get('@onChange').should('have.been.called');
    cy.get('button[aria-label="Clear input"]').click();

    cy.get('input[aria-label="Search"]').should('have.value', '').and('be.focused');
    cy.get('@onClear').should('have.been.calledOnce');
    cy.get('button[aria-label="Clear input"]').should('not.exist');
  });

  it('gives affixes precedence over icons and renders error semantics', () => {
    cy.mount(
      <Input
        aria-label="Amount"
        prefix="$"
        suffix="USD"
        leftIcon={<MagnifierIcon />}
        rightIcon={<MagnifierIcon />}
        errorMessage="Enter a valid amount."
      />,
    );

    cy.contains('$').should('exist');
    cy.contains('USD').should('exist');
    cy.get('input[aria-label="Amount"]')
      .should('have.attr', 'aria-invalid', 'true')
      .and('have.attr', 'aria-describedby');
    cy.get('.faster-input').should('have.class', 'faster-input--error');
  });

  it('uses dedicated number button interactions and affixes without decorative icon slots', () => {
    cy.mount(
      <Input
        aria-label="Quantity"
        type="number"
        defaultValue="1"
        prefix="$"
        suffix="USD"
        leftIcon={<MagnifierIcon />}
        rightIcon={<MagnifierIcon />}
      />,
    );

    cy.get('button[aria-label="Clear input"]').should('exist');
    cy.contains('$').should('exist');
    cy.contains('USD').should('exist');
    cy.get('.faster-input__leading svg').should('not.exist');
    cy.get('.faster-input__trailing svg').should('not.exist');
    cy.get('button[aria-label="Increase value"]').click();
    cy.get('input[aria-label="Quantity"]').should('have.value', '2');
    cy.get('button[aria-label="Decrease value"]').click();
    cy.get('input[aria-label="Quantity"]').should('have.value', '1');
  });

  it('adds automatic search, currency, and URL adornments', () => {
    cy.mount(
      <div>
        <Input aria-label="Search" type="search" defaultValue="Faster UI" />
        <Input aria-label="Price" currency="$" currencyCode="USD" defaultValue="10" />
        <Input
          aria-label="Website"
          type="url"
          urlProtocol="http://"
          urlSuffix=".dev"
          defaultValue="faster-ui"
        />
      </div>,
    );

    cy.get('input[aria-label="Search"]').should('have.attr', 'type', 'search');
    cy.get('input[aria-label="Search"]')
      .closest('.faster-input')
      .find('.faster-input__leading svg')
      .should('exist');
    cy.get('input[aria-label="Price"]').should('have.attr', 'type', 'number');
    cy.contains('$').should('exist');
    cy.contains('USD').should('exist');
    cy.contains('http://').should('exist');
    cy.contains('.dev').should('exist');
    cy.get('button[aria-label="Clear input"]').should('have.length', 3);
  });
});
