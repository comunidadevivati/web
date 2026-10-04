import { Heading } from '@/components/ui/heading';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Heading', () => {
  it('renders the requested heading level', () => {
    render(<Heading level={2}>Comunidade Viva</Heading>);

    expect(screen.getByRole('heading', { level: 2, name: 'Comunidade Viva' })).toBeInTheDocument();
  });
});
