import { THEME_STORAGE_KEY } from '@/app/theme/theme.model';
import { useThemeStore } from '@/app/theme/theme.store';
import { ThemeToggle } from '@/components/molecules/theme-toggle/theme-toggle';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();

    useThemeStore.setState({ preference: 'system' });
  });

  afterEach(() => {
    cleanup();
  });

  it('follows the system theme by default', () => {
    render(<ThemeToggle tone="header" />);

    expect(screen.getByRole('button', { name: 'Tema do sistema' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks the theme chosen by the user', async () => {
    render(<ThemeToggle tone="header" />);

    await userEvent.click(screen.getByRole('button', { name: 'Tema escuro' }));

    expect(screen.getByRole('button', { name: 'Tema escuro' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('saves the chosen theme on the device', async () => {
    render(<ThemeToggle tone="sidebar" />);

    await userEvent.click(screen.getByRole('button', { name: 'Tema claro' }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toContain('"preference":"light"');
  });
});
