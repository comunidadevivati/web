import { AppFooter } from '@/components/organisms/app-footer/app-footer';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

// O footer renderiza o layout estreito e o largo; as container queries (CSS) escolhem qual aparece.
// Sem CSS no jsdom, os dois ficam no DOM, então as consultas usam getAllBy*.
describe('AppFooter', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows the copyright notice with the current year', () => {
    render(<AppFooter />);

    expect(screen.getAllByText(`© ${new Date().getFullYear()} Comunidade Viva.`)[0]).toBeVisible();
  });

  it('shows who developed the application', () => {
    render(<AppFooter />);

    expect(screen.getAllByText('ComVivaTI')[0]).toBeInTheDocument();
  });

  it('is exposed as the page footer landmark', () => {
    render(<AppFooter />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('identifies the church symbol with its legal name and CNPJ', () => {
    render(<AppFooter />);

    expect(
      screen.getAllByRole('img', {
        name: 'IGREJA EVANGÉLICA VIVA E EFICAZ - CNPJ: 14.158.325/0001-01',
      })[0],
    ).toBeInTheDocument();
  });
});
