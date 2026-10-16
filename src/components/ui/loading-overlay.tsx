import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

// Os pontos do texto aparecem um a um (de 1 a 5) a cada meio segundo e recomeçam.
const DOTS_INTERVAL_MS = 500;

const MAX_DOTS = 5;

const OVERLAY_SLOT = 'loading-overlay';

// Bloqueio compartilhado entre overlays simultâneos (ex.: request + troca de rota): só libera a
// tela quando o último overlay sai.
let activeLocks = 0;

const inertElements = new Set<Element>();

let previousOverflow = { body: '', html: '' };

// Qualquer tecla (Tab, Enter, Esc, atalhos) é descartada enquanto a tela está bloqueada.
const blockKeyboard = (event: KeyboardEvent) => {
  event.preventDefault();

  event.stopImmediatePropagation();
};

const lockScreen = () => {
  activeLocks += 1;

  if (activeLocks > 1) {
    return;
  }

  // Tudo o que não é o overlay fica inerte: sem foco, clique ou leitura pelo leitor de tela
  // (inclui portais como modais e toasts).
  for (const element of document.body.children) {
    if (element.getAttribute('data-slot') !== OVERLAY_SLOT && !element.hasAttribute('inert')) {
      element.setAttribute('inert', '');

      inertElements.add(element);
    }
  }

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  previousOverflow = {
    body: document.body.style.overflow,
    html: document.documentElement.style.overflow,
  };

  document.body.style.overflow = 'hidden';

  document.documentElement.style.overflow = 'hidden';

  window.addEventListener('keydown', blockKeyboard, true);
};

const unlockScreen = () => {
  activeLocks = Math.max(0, activeLocks - 1);

  if (activeLocks > 0) {
    return;
  }

  for (const element of inertElements) {
    element.removeAttribute('inert');
  }

  inertElements.clear();

  document.body.style.overflow = previousOverflow.body;

  document.documentElement.style.overflow = previousOverflow.html;

  window.removeEventListener('keydown', blockKeyboard, true);
};

// Loading de tela cheia: bloqueia toda interação (mouse, toque, teclado e leitor de tela), mostra o
// cursor de espera e exibe o símbolo da Viva com o texto "Processando, por favor aguarde" e pontos
// animados. Use pelo controle global (globalLoading / useGlobalLoading) ou renderize direto.
export const LoadingOverlay = () => {
  const { t } = useTranslation();

  const [dots, setDots] = useState(1);

  useEffect(() => {
    lockScreen();

    return unlockScreen;
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDots((current) => (current === MAX_DOTS ? 1 : current + 1));
    }, DOTS_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return createPortal(
    <div
      aria-busy="true"
      className="
        fixed inset-0 z-9999 flex h-dvh w-dvw cursor-wait touch-none flex-col items-center
        justify-center gap-6 overflow-hidden bg-background px-4 text-center text-foreground
        select-none
      "
      data-slot={OVERLAY_SLOT}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div aria-hidden="true" className="relative size-28 sm:size-32">
        <span
          className="
            absolute inset-0 animate-spin rounded-full border-4 border-primary/20 border-t-primary
            motion-reduce:animate-[spin_2.5s_linear_infinite]
          "
        />

        <img
          alt=""
          className="absolute inset-0 m-auto size-16 object-contain sm:size-20"
          draggable={false}
          src={livingStoneGreen}
        />
      </div>

      <p aria-hidden="true" className="text-lg font-semibold sm:text-xl">
        {t('processing')}
        <span className="inline-block w-[5ch] text-left">{'.'.repeat(dots)}</span>
      </p>

      {/* Texto estável para o leitor de tela: anunciado uma vez, sem repetir a cada ponto. */}
      <p className="sr-only" role="status">
        {t('processing')}
      </p>
    </div>,
    document.body,
  );
};
