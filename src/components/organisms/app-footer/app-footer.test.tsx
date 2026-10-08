import { AppFooter } from '@/components/organisms/app-footer/app-footer';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

describe('AppFooter', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows the copyright notice with the current year', () => {
    render(<AppFooter />);

    expect(
      screen.getByText(
        `© ${new Date().getFullYear()} Comunidade Viva. Todos os direitos reservados.`,
      ),
    ).toBeInTheDocument();
  });

  it('shows who developed the application', () => {
    render(<AppFooter />);

    expect(screen.getByText('ComVivaTI')).toBeInTheDocument();
  });

  it('is exposed as the page footer landmark', () => {
    render(<AppFooter />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('identifies the church symbol with its legal name and CNPJ', () => {
    render(<AppFooter />);

    expect(
      screen.getByRole('img', {
        name: 'IGREJA EVANGÉLICA VIVA E EFICAZ - CNPJ: 14.158.325/0001-01',
      }),
    ).toBeInTheDocument();
  });
});
