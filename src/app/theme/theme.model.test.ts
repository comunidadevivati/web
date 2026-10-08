import { resolveTheme } from '@/app/theme/theme.model';
import { describe, expect, it } from 'vitest';

describe('resolveTheme', () => {
  it('follows a dark operating system when the preference is system', () => {
    expect(resolveTheme('system', true)).toBe('dark');
  });

  it('follows a light operating system when the preference is system', () => {
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('keeps the light theme chosen by the user on a dark operating system', () => {
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('keeps the dark theme chosen by the user on a light operating system', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});
