import { parseOmadaRedirect } from '@/features/guest-wifi/infrastructure/omada/omada-redirect';
import { describe, expect, it } from 'vitest';

describe('parseOmadaRedirect', () => {
  it('parses a wireless client redirected by an access point', () => {
    expect(
      parseOmadaRedirect({
        clientMac: 'AA-BB-CC-DD-EE-FF',
        clientIp: '192.168.10.20',
        apMac: '11-22-33-44-55-66',
        ssidName: 'VIVA - Visitantes',
        radioId: '1',
        site: 'Default',
        redirectUrl: 'https://www.google.com/',
      }),
    ).toEqual({
      client: {
        type: 'eap',
        clientMac: 'AA-BB-CC-DD-EE-FF',
        clientIp: '192.168.10.20',
        apMac: '11-22-33-44-55-66',
        ssidName: 'VIVA - Visitantes',
        radioId: 1,
        site: 'Default',
      },
      redirectUrl: 'https://www.google.com/',
    });
  });

  it('parses a client redirected by the gateway', () => {
    expect(
      parseOmadaRedirect({
        clientMac: 'AA-BB-CC-DD-EE-FF',
        gatewayMac: '11-22-33-44-55-66',
        vid: '20',
      })?.client,
    ).toEqual({
      type: 'gateway',
      clientMac: 'AA-BB-CC-DD-EE-FF',
      clientIp: undefined,
      gatewayMac: '11-22-33-44-55-66',
      vid: 20,
      site: undefined,
    });
  });

  it('returns null when the page is opened without the portal parameters', () => {
    expect(parseOmadaRedirect({})).toBeNull();
  });

  it('ignores redirect urls that are not http or https', () => {
    expect(
      parseOmadaRedirect({
        clientMac: 'AA-BB-CC-DD-EE-FF',
        gatewayMac: '11-22-33-44-55-66',
        redirectUrl: 'javascript:alert(1)',
      })?.redirectUrl,
    ).toBeNull();
  });
});
