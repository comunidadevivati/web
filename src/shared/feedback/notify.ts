import { Toast } from '@base-ui/react/toast';

// Tempo até o toast fechar sozinho (pausa enquanto o mouse ou o foco estiver nele).
export const TOAST_DURATION_MS = 7_000;

export type NotificationType = 'success' | 'error';

export type NotificationContent = {
  // Textos já traduzidos.
  title: string;
  description?: string;
};

// Gerenciador único dos toasts da aplicação (lido pelo organismo Toaster).
export const toastManager = Toast.createToastManager();

const show = (type: NotificationType) => {
  return ({ description, title }: NotificationContent) => {
    return toastManager.add({
      type,
      title,
      description,
      // O fechamento automático é controlado pelo NotificationToast (contagem regressiva visível).
      timeout: 0,
      // Erros são anunciados imediatamente pelo leitor de tela; sucesso, sem interromper.
      priority: type === 'error' ? 'high' : 'low',
    });
  };
};

// Mensagens de retorno das requests, para uso nas ViewModels:
// notify.success({ title: t('...'), description: t('...') }).
export const notify = {
  success: show('success'),
  error: show('error'),
};
