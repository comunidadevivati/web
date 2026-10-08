import { formatPhone } from '@/features/guest-wifi/presentation/models/guest-wifi.model';
import { describe, expect, it } from 'vitest';

describe('formatPhone', () => {
  it('formats a mobile number with area code', () => {
    expect(formatPhone('67991066631')).toBe('(67) 99106-6631');
  });

  it('formats a landline number with area code', () => {
    expect(formatPhone('6733334444')).toBe('(67) 3333-4444');
  });

  it('formats a partially typed number', () => {
    expect(formatPhone('6799')).toBe('(67) 99');
  });

  it('ignores non-digit characters and extra digits', () => {
    expect(formatPhone('+(67) 99106-66319999')).toBe('(67) 99106-6631');
  });
});
