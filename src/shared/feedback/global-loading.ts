import { useEffect } from 'react';
import { create } from 'zustand';

type GlobalLoadingState = {
  // Quantas operações pediram o loading; ele aparece enquanto houver ao menos uma.
  pending: number;
  increment: () => void;
  decrement: () => void;
};

export const useGlobalLoadingStore = create<GlobalLoadingState>()((set) => ({
  pending: 0,

  increment: () => {
    set(({ pending }) => ({ pending: pending + 1 }));
  },

  decrement: () => {
    set(({ pending }) => ({ pending: Math.max(0, pending - 1) }));
  },
}));

// Liga o loading global e devolve a função que o desliga (chamadas extras são ignoradas).
const start = () => {
  useGlobalLoadingStore.getState().increment();

  let isStopped = false;

  return () => {
    if (isStopped) {
      return;
    }

    isStopped = true;

    useGlobalLoadingStore.getState().decrement();
  };
};

// Executa uma operação assíncrona com o loading global ativo, desligando-o ao final (sucesso ou erro).
const run = async <Result>(task: () => Promise<Result>) => {
  const stop = start();

  try {
    return await task();
  } finally {
    stop();
  }
};

// Controle do loading global (LoadingOverlay) fora de componentes ou em fluxos imperativos.
export const globalLoading = {
  start,
  run,
};

// Mantém o loading global ativo enquanto `isActive` for verdadeiro (ex.: isPending de uma mutation).
export const useGlobalLoading = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    return start();
  }, [isActive]);
};
