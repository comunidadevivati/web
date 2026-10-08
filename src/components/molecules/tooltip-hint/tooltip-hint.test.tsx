import { TooltipHint } from '@/components/molecules/tooltip-hint/tooltip-hint';
import { Button, TooltipProvider } from '@/components/ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

describe('TooltipHint', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows the label when the pointer rests on the element', async () => {
    render(
      <TooltipProvider>
        <TooltipHint label="Recolher menu lateral">
          <Button aria-label="Recolher menu lateral">x</Button>
        </TooltipHint>
      </TooltipProvider>,
    );

    await userEvent.hover(screen.getByRole('button', { name: 'Recolher menu lateral' }));

    expect(await screen.findByText('Recolher menu lateral')).toBeInTheDocument();
  });

  it('does not show the label when disabled', async () => {
    render(
      <TooltipProvider>
        <TooltipHint isEnabled={false} label="Sair">
          <Button aria-label="Sair">x</Button>
        </TooltipHint>
      </TooltipProvider>,
    );

    await userEvent.hover(screen.getByRole('button', { name: 'Sair' }));

    expect(screen.queryByText('Sair')).not.toBeInTheDocument();
  });
});
