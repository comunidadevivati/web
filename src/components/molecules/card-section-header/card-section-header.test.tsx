import { CardSectionHeader } from '@/components/molecules/card-section-header/card-section-header';
import { Card } from '@/components/ui';
import { cleanup, render, screen } from '@testing-library/react';
import { HistoryIcon } from 'lucide-react';
import { afterEach, describe, expect, it } from 'vitest';

describe('CardSectionHeader', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows the section title', () => {
    render(
      <Card>
        <CardSectionHeader
          description="Últimas movimentações registradas"
          icon={HistoryIcon}
          title="Atividades recentes"
        />
      </Card>,
    );

    expect(screen.getByText('Atividades recentes')).toBeInTheDocument();
  });

  it('shows the section description', () => {
    render(
      <Card>
        <CardSectionHeader
          description="Últimas movimentações registradas"
          icon={HistoryIcon}
          title="Atividades recentes"
        />
      </Card>,
    );

    expect(screen.getByText('Últimas movimentações registradas')).toBeInTheDocument();
  });
});
