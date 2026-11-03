import {
  formStatusActionTargets,
  type Form,
  type FormStatusAction,
  type FormsGateway,
} from '@/features/forms/domain/form';
import { formsHttpGateway } from '@/features/forms/infrastructure/http/forms-http.gateway';

type ChangeFormStatusCommand = {
  csrfToken: string;
  // Formulário com a versão lida (concorrência otimista).
  form: Form;
  action: FormStatusAction;
  // Motivo, obrigatório ao cancelar.
  reason: string | null;
};

export const changeFormStatusUseCase = (
  { action, csrfToken, form, reason }: ChangeFormStatusCommand,
  gateway: FormsGateway = formsHttpGateway,
) => {
  return gateway.changeFormStatus(
    csrfToken,
    form.id,
    form.version,
    formStatusActionTargets[action],
    action === 'cancel' ? reason : null,
  );
};
