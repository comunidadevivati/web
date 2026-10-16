import { NotificationToast } from '@/components/molecules';
import { ToastPortal, ToastProvider, ToastViewport, useToastManager } from '@/components/ui';
import { toastManager } from '@/shared/feedback/notify';
import type { ReactNode } from 'react';

type ToasterProps = {
  children: ReactNode;
};

// No máximo 3 toasts visíveis; os mais antigos saem quando chegam novos.
const TOAST_LIMIT = 3;

const ToastList = () => {
  const { toasts } = useToastManager();

  return toasts.map((toast) => <NotificationToast key={toast.id} toast={toast} />);
};

// Provedor global dos toasts (montado no main.tsx). Exibe as mensagens enviadas por notify.
export const Toaster = ({ children }: ToasterProps) => {
  return (
    <ToastProvider limit={TOAST_LIMIT} toastManager={toastManager}>
      {children}

      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
};
