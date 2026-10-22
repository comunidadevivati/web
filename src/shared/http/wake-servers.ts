import { bffClient } from '@/shared/http/bff-client';

// Intervalo mínimo entre chamadas: o Render Free põe os serviços em repouso após ~15 min sem uso.
const WAKE_INTERVAL_MS = 5 * 60_000;

let lastWakeAt = 0;

// Acorda BFF, PostgreSQL e Core API (GET /api/v1/wake) sem bloquear a tela. Enquanto demora, o
// aviso "Conectando ao servidor…" aparece; o 503 (algum serviço ainda acordando) é repetido pelo Ky.
const wakeServers = () => {
  if (Date.now() - lastWakeAt < WAKE_INTERVAL_MS) {
    return;
  }

  lastWakeAt = Date.now();

  bffClient.get('api/v1/wake').catch(() => {
    // Falha não impede o uso: a próxima chamada ao BFF tenta acordá-lo de novo.
    lastWakeAt = 0;
  });
};

// Ao abrir o site e ao voltar para a aba depois de um tempo fora, para que login e primeira tela
// não esperem o cold start. Sem ping periódico com a aba parada: gastaria a franquia de horas.
export const keepServersAwake = () => {
  wakeServers();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      wakeServers();
    }
  });
};
