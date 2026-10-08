import type { GuestWifiAccess } from '@/features/guest-wifi/domain/guest-wifi';

// Parâmetros que o Omada Controller acrescenta ao redirecionar para o portal externo.
export type OmadaRedirectParams = {
  clientMac?: string;
  clientIp?: string;
  apMac?: string;
  ssidName?: string;
  radioId?: string;
  gatewayMac?: string;
  vid?: string;
  site?: string;
  redirectUrl?: string;
};

const toInteger = (value: string | undefined) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) ? parsedValue : 0;
};

// Só aceita destinos http(s), evitando redirecionamentos para esquemas inesperados.
const toSafeRedirectUrl = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

export const parseOmadaRedirect = (params: OmadaRedirectParams): GuestWifiAccess | null => {
  const { apMac, clientIp, clientMac, gatewayMac, radioId, site, ssidName, vid } = params;

  if (!clientMac) {
    return null;
  }

  const redirectUrl = toSafeRedirectUrl(params.redirectUrl);

  if (apMac && ssidName) {
    return {
      client: {
        type: 'eap',
        clientMac,
        clientIp,
        apMac,
        ssidName,
        radioId: toInteger(radioId),
        site,
      },
      redirectUrl,
    };
  }

  if (gatewayMac) {
    return {
      client: {
        type: 'gateway',
        clientMac,
        clientIp,
        gatewayMac,
        vid: toInteger(vid),
        site,
      },
      redirectUrl,
    };
  }

  return null;
};
