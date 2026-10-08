// Cliente sem fio, interceptado pelo access point (EAP).
export type GuestWifiEapClient = {
  type: 'eap';
  clientMac: string;
  clientIp?: string;
  apMac: string;
  ssidName: string;
  radioId: number;
  site?: string;
};

// Cliente interceptado pelo gateway (ex.: ER605).
export type GuestWifiGatewayClient = {
  type: 'gateway';
  clientMac: string;
  clientIp?: string;
  gatewayMac: string;
  vid: number;
  site?: string;
};

export type GuestWifiClient = GuestWifiEapClient | GuestWifiGatewayClient;

// Dados de conexão recebidos do portal cativo, necessários para liberar o acesso.
export type GuestWifiAccess = {
  client: GuestWifiClient;
  redirectUrl: string | null;
};

export type GuestWifiVisitor = {
  fullName: string;
  phone: string;
};

export type GuestWifiAuthorization = {
  client: GuestWifiClient;
  visitor: GuestWifiVisitor;
  terms: {
    accepted: true;
    version: string;
  };
};

export interface GuestWifiGateway {
  authorize: (authorization: GuestWifiAuthorization) => Promise<void>;
}
