import { getPageTitle } from '@/app/router/page-title';
import { describe, expect, it } from 'vitest';

describe('getPageTitle', () => {
  it('prefixes the page name with the application title', () => {
    expect(getPageTitle('História')).toBe('VIVA - História');
  });
});
