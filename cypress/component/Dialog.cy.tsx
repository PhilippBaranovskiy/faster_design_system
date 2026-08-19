import { Button } from '../../src/components/Button';
import { Dialog } from '../../src/components/Dialog';
import { useState } from 'react';

function ControlledDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog title="Delete project" open={open} onClose={() => setOpen(false)}>
        This action cannot be undone.
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('opens from a trigger and closes from its close control', () => {
    cy.mount(<ControlledDialog />);

    cy.get('[role="dialog"]').should('not.exist');
    cy.contains('button', 'Open dialog').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('button[aria-label="Close dialog"]').click();
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('mounts its default modal structure and invokes the close callback', () => {
    const onClose = cy.spy().as('onClose');

    cy.mount(
      <Dialog title="Delete project" onClose={onClose} footer={<Button>Delete</Button>}>
        This action cannot be undone.
      </Dialog>,
    );

    cy.get('[role="dialog"]')
      .should('have.attr', 'aria-modal', 'true')
      .and('have.attr', 'data-size', 'md')
      .and('have.attr', 'data-variant', 'basic');
    cy.get('button[aria-label="Close dialog"]').click();
    cy.get('@onClose').should('have.been.calledOnce');
  });

  it('supports scrollable and divided dialog layouts', () => {
    cy.mount(
      <>
        <Dialog title="Scrollable dialog" variant="scrollable" onClose={() => undefined}>
          Scrollable body
        </Dialog>
        <Dialog
          title="Divided dialog"
          variant="divider"
          onClose={() => undefined}
          footer={<Button>Save</Button>}
        >
          Divided body
        </Dialog>
      </>,
    );

    cy.get('[role="dialog"][data-variant="scrollable"]')
      .should('have.class', 'flex')
      .find('.overflow-y-auto')
      .should('exist');
    cy.get('[role="dialog"][data-variant="divider"] [aria-hidden="true"].border-t').should(
      'have.length',
      2,
    );
  });

  it('applies the warning preset icon and destructive primary action', () => {
    cy.mount(
      <Dialog
        title="Delete project"
        preset="warning"
        onClose={() => undefined}
        footer={
          <>
            <Button mode="ghost">Cancel</Button>
            <Button>Delete</Button>
          </>
        }
      >
        This action cannot be undone.
      </Dialog>,
    );

    cy.get('[role="dialog"][data-preset="warning"] svg.text-faster-warning-600').should('exist');
    cy.contains('button', 'Delete').should('have.attr', 'data-kind', 'danger');
  });
});
