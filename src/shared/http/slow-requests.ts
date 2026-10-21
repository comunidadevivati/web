import { create } from 'zustand';

// A partir deste tempo sem resposta, o BFF provavelmente está acordando do repouso (Render Free).
const SLOW_REQUEST_MS = 4_000;

type SlowRequestsState = {
  // Requisições ao BFF ainda sem resposta depois de SLOW_REQUEST_MS.
  slow: number;
  increment: () => void;
  decrement: () => void;
};

export const useSlowRequestsStore = create<SlowRequestsState>()((set) => ({
  slow: 0,

  increment: () => {
    set(({ slow }) => ({ slow: slow + 1 }));
  },

  decrement: () => {
    set(({ slow }) => ({ slow: Math.max(0, slow - 1) }));
  },
}));

// fetch que conta as requisições demoradas, para o aviso "Conectando ao servidor…".
export const trackedFetch: typeof fetch = async (input, init) => {
  let isSlow = false;

  const timer = setTimeout(() => {
    isSlow = true;

    useSlowRequestsStore.getState().increment();
  }, SLOW_REQUEST_MS);

  try {
    return await fetch(input, init);
  } finally {
    clearTimeout(timer);

    if (isSlow) {
      useSlowRequestsStore.getState().decrement();
    }
  }
};
