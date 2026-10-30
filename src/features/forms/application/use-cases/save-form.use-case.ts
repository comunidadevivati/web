import {
  HeaderImageSaveError,
  type Form,
  type FormDetails,
  type FormsGateway,
  type HeaderImageContentType,
  type HeaderImageTransfer,
} from '@/features/forms/domain/form';
import { directHeaderImageTransfer } from '@/features/forms/infrastructure/http/direct-header-image.transfer';
import { formsHttpGateway } from '@/features/forms/infrastructure/http/forms-http.gateway';

// O que fazer com a imagem do cabeçalho ao salvar.
export type HeaderImageChange =
  | { kind: 'keep' }
  | { kind: 'replace'; file: File }
  | { kind: 'remove' };

type SaveFormCommand = {
  csrfToken: string;
  department: string;
  // Formulário em edição (com a versão lida); null cria um novo.
  form: Form | null;
  details: FormDetails;
  headerImage: HeaderImageChange;
};

// Envio direto ao bucket: pede a URL, envia o arquivo e confirma.
const uploadHeaderImage = async (
  csrfToken: string,
  saved: Form,
  file: File,
  gateway: FormsGateway,
  transfer: HeaderImageTransfer,
) => {
  // O tipo já foi conferido no domínio (checkHeaderImage) antes de chegar aqui.
  const ticket = await gateway.requestHeaderImageUpload(
    csrfToken,
    saved.id,
    file.type as HeaderImageContentType,
  );

  await transfer.send(ticket, file);

  return gateway.completeHeaderImageUpload(csrfToken, saved.id, ticket.uploadId);
};

// Salva os dados e, em seguida, aplica a troca ou a remoção da imagem do cabeçalho (o envio da
// imagem precisa do id do formulário, que só existe depois da criação). Falha na imagem depois dos
// dados salvos vira HeaderImageSaveError, com o formulário já gravado.
export const saveFormUseCase = async (
  { csrfToken, department, details, form, headerImage }: SaveFormCommand,
  gateway: FormsGateway = formsHttpGateway,
  transfer: HeaderImageTransfer = directHeaderImageTransfer,
) => {
  const saved = form
    ? await gateway.updateForm(csrfToken, form.id, form.version, details)
    : await gateway.createForm(csrfToken, department, details);

  try {
    if (headerImage.kind === 'replace') {
      return await uploadHeaderImage(csrfToken, saved, headerImage.file, gateway, transfer);
    }

    if (headerImage.kind === 'remove' && saved.headerImage) {
      return await gateway.removeHeaderImage(csrfToken, saved.id);
    }
  } catch (error) {
    throw new HeaderImageSaveError(saved, error);
  }

  return saved;
};
