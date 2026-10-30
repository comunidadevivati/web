// Formulários dos departamentos (pesquisas, avaliações de desempenho...), ADR 0013 do backend.

// DRAFT = não publicado. FINISHED e CANCELLED são finais: o formulário não muda mais.
export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'FINISHED' | 'CANCELLED';

export const FORM_STATUSES = ['DRAFT', 'PUBLISHED', 'FINISHED', 'CANCELLED'] as const;

// Tipo do campo de resposta: texto curto (input), texto longo (textarea), múltipla escolha
// (checkbox), escolha única (radio), lista suspensa (select, escolha única), escala numérica
// (ex.: 1 a 5), data e número.
export const QUESTION_FIELD_TYPES = [
  'INPUT',
  'TEXTAREA',
  'CHECKBOX',
  'RADIO',
  'SELECT',
  'SCALE',
  'DATE',
  'NUMBER',
] as const;

export type QuestionFieldType = (typeof QUESTION_FIELD_TYPES)[number];

export type ChoiceFieldType = 'CHECKBOX' | 'RADIO' | 'SELECT';

// Tipos com lista de opções; os demais não têm opções.
export const isChoiceFieldType = (fieldType: QuestionFieldType): fieldType is ChoiceFieldType => {
  return fieldType === 'CHECKBOX' || fieldType === 'RADIO' || fieldType === 'SELECT';
};

// Escala de min (0 ou 1) a max (até 10), com rótulos opcionais nas pontas ou um nome para cada
// ponto (ex.: Péssimo, Ruim, Regular, Bom, Ótimo).
export type QuestionScale = {
  min: number;
  max: number;
  minLabel: string | null;
  maxLabel: string | null;
  // Um nome por ponto, de min a max; com eles, as pontas repetem o primeiro e o último.
  pointLabels: string[] | null;
};

// Nome do ponto da escala (null sem nomes por ponto ou fora da escala).
export const scalePointLabel = (scale: QuestionScale | null, value: number): string | null =>
  scale?.pointLabels?.[value - scale.min] ?? null;

export const SCALE_MIN_VALUES = [0, 1] as const;

export const SCALE_MAX_VALUE = 10;

export const SCALE_LABEL_MAX_LENGTH = 40;

export const DEFAULT_SCALE: QuestionScale = {
  min: 1,
  max: 5,
  minLabel: null,
  maxLabel: null,
  pointLabels: null,
};

export const CONSENT_TEXT_MAX_LENGTH = 1000;

// Opção de uma pergunta de escolha, na ordem de exibição.
export type QuestionOption = {
  id: string;
  label: string;
};

export type FormQuestion = {
  id: string;
  title: string;
  description: string | null;
  fieldType: QuestionFieldType;
  // Obrigatória: a resposta pelo link não é aceita sem ela.
  required: boolean;
  // Somente nos tipos de escolha; vazio nos demais.
  options: QuestionOption[];
  // Somente no tipo SCALE.
  scale: QuestionScale | null;
};

// Imagem exibida acima do título do formulário.
export type FormHeaderImage = {
  url: string;
  width: number;
  height: number;
  contentType: string;
  byteSize: number;
};

// Datas civis ISO (AAAA-MM-DD): o formulário vale do início ao fim, inclusive.
export type Form = {
  id: string;
  department: string;
  title: string;
  description: string | null;
  startsOn: string;
  endsOn: string;
  status: FormStatus;
  headerImage: FormHeaderImage | null;
  // Perguntas na ordem de exibição.
  questions: FormQuestion[];
  // Grupos de e-mail que recebem o formulário (pela ação "Enviar e-mails do grupo").
  recipientGroupIds: string[];
  // Anônimo: o painel mostra quem respondeu, nunca o que cada pessoa respondeu.
  anonymous: boolean;
  // Quem respondeu pelo link pode alterar a resposta até o fim do período (não vale para anônimo).
  allowAnswerEdit: boolean;
  // Texto de consentimento (LGPD) a ser aceito antes de responder; null dispensa.
  consentText: string | null;
  // Último envio dos e-mails aos grupos; null se nunca foi enviado.
  emailDispatch: EmailDispatch | null;
  // Convites enviados (um por conta) e quantos já responderam pelo link.
  invitedCount: number;
  answeredCount: number;
  // Pessoas dos grupos que ainda não responderam (pelo link ou em papel): quem o reenvio alcança.
  pendingRecipientCount: number;
  // Respostas apagadas (LGPD): o conteúdo saiu; a participação continua registrada.
  answersPurgedAt: string | null;
  // Versão lida: a edição a devolve (concorrência otimista).
  version: number;
  createdAt: string;
  updatedAt: string;
};

// SENDING bloqueia o formulário (nenhuma ação) até o servidor concluir o envio.
export type EmailDispatchStatus = 'SENDING' | 'SENT' | 'FAILED';

export const EMAIL_DISPATCH_STATUSES = ['SENDING', 'SENT', 'FAILED'] as const;

export type EmailDispatch = {
  // INVITE: convite; REMINDER: lembrete aos pendentes.
  kind: 'INVITE' | 'REMINDER';
  status: EmailDispatchStatus;
  startedAt: string;
  finishedAt: string | null;
  sentCount: number;
  failedCount: number;
};

export const isSendingEmails = (form: Pick<Form, 'emailDispatch'>) => {
  return form.emailDispatch?.status === 'SENDING';
};

// Envio aos grupos: formulário publicado, com grupos e fora de outro envio. Depois do primeiro envio
// a ação vira "Reenviar" (quem já respondeu não recebe de novo).
export type FormEmailAction = 'sendEmails' | 'resendEmails' | 'remindPending';

// Lembrete aos pendentes: depois do primeiro envio, com alguém ainda sem responder.
export const canRemindPending = (
  form: Pick<Form, 'status' | 'emailDispatch' | 'invitedCount' | 'answeredCount'>,
) => {
  return (
    form.status === 'PUBLISHED' &&
    form.emailDispatch !== null &&
    !isSendingEmails(form) &&
    form.invitedCount > form.answeredCount
  );
};

// Apagar respostas (LGPD): formulário finalizado ou cancelado, com convites e ainda não apagado.
export const canPurgeAnswers = (
  form: Pick<Form, 'status' | 'invitedCount' | 'answersPurgedAt'>,
) => {
  return isFinalFormStatus(form.status) && form.invitedCount > 0 && form.answersPurgedAt === null;
};

// O reenvio só aparece enquanto alguém dos grupos não respondeu.
export const getFormEmailAction = (
  form: Pick<Form, 'status' | 'recipientGroupIds' | 'emailDispatch' | 'pendingRecipientCount'>,
): FormEmailAction | null => {
  if (form.status !== 'PUBLISHED' || form.recipientGroupIds.length === 0 || isSendingEmails(form)) {
    return null;
  }

  if (!form.emailDispatch) {
    return 'sendEmails';
  }

  return form.pendingRecipientCount > 0 ? 'resendEmails' : null;
};

export type FormPage = {
  items: Form[];
  nextCursor: string | null;
};

// Quantidade de formulários do departamento por status (card do dashboard).
export type FormsSummary = {
  total: number;
  byStatus: Record<FormStatus, number>;
};

// Pergunta enviada na criação/edição: id null cria uma nova; o id mantém a existente.
export type QuestionDetails = {
  id: string | null;
  title: string;
  description: string | null;
  fieldType: QuestionFieldType;
  required: boolean;
  // id null cria uma opção nova; o id mantém a existente. Vazio fora dos tipos de escolha.
  options: { id: string | null; label: string }[];
  scale: QuestionScale | null;
};

export type FormDetails = {
  title: string;
  description: string | null;
  startsOn: string;
  endsOn: string;
  status: FormStatus;
  questions: QuestionDetails[];
  recipientGroupIds: string[];
  anonymous: boolean;
  allowAnswerEdit: boolean;
  consentText: string | null;
};

export type EmailGroup = {
  id: string;
  name: string;
  description: string | null;
  recipientCount: number;
};

// Limites do formulário (o servidor deve aplicar os mesmos).
export const FORM_TITLE_MAX_LENGTH = 120;

export const FORM_DESCRIPTION_MAX_LENGTH = 2000;

export const QUESTION_TITLE_MAX_LENGTH = 200;

export const QUESTION_DESCRIPTION_MAX_LENGTH = 500;

export const MAX_QUESTIONS = 50;

// Perguntas de escolha (checkbox e radio): de 1 a 20 opções, com rótulos distintos. Uma opção só
// atende casos como "Li e concordo com os termos".
export const MIN_QUESTION_OPTIONS = 1;

export const MAX_QUESTION_OPTIONS = 20;

export const QUESTION_OPTION_MAX_LENGTH = 100;

export type QuestionOptionsIssue = 'notAllowed' | 'tooFew' | 'tooMany' | 'duplicated';

// Primeiro problema da lista de opções de uma pergunta, ou null quando ela está de acordo com o tipo.
export const checkQuestionOptions = (
  fieldType: QuestionFieldType,
  labels: readonly string[],
): QuestionOptionsIssue | null => {
  if (!isChoiceFieldType(fieldType)) {
    return labels.length > 0 ? 'notAllowed' : null;
  }

  if (labels.length < MIN_QUESTION_OPTIONS) {
    return 'tooFew';
  }

  if (labels.length > MAX_QUESTION_OPTIONS) {
    return 'tooMany';
  }

  const normalized = labels.map((label) => label.trim().toLocaleLowerCase('pt-BR'));

  return new Set(normalized).size === normalized.length ? null : 'duplicated';
};

// Transições permitidas a partir de cada status (inclui permanecer no mesmo).
export const formStatusTransitions: Record<FormStatus, FormStatus[]> = {
  DRAFT: ['DRAFT', 'PUBLISHED', 'CANCELLED'],
  PUBLISHED: ['PUBLISHED', 'DRAFT', 'FINISHED', 'CANCELLED'],
  FINISHED: ['FINISHED'],
  CANCELLED: ['CANCELLED'],
};

// Status possíveis ao criar um formulário.
export const INITIAL_FORM_STATUSES: FormStatus[] = ['DRAFT', 'PUBLISHED'];

export const isFinalFormStatus = (status: FormStatus) => {
  return status === 'FINISHED' || status === 'CANCELLED';
};

export const canChangeFormStatus = (from: FormStatus, to: FormStatus) => {
  return formStatusTransitions[from].includes(to);
};

// Finalizado e cancelado não aceitam mais alterações (abrem somente para leitura).
export const canEditForm = (status: FormStatus) => {
  return !isFinalFormStatus(status);
};

// Formulário publicado já foi enviado por e-mail: antes de excluir, é preciso despublicar,
// concluir ou cancelar.
export const canDeleteForm = (status: FormStatus) => {
  return status !== 'PUBLISHED';
};

// Mudanças de status feitas fora do editor (menu da lista), cada uma com o status de destino.
export type FormStatusAction = 'publish' | 'unpublish' | 'finish' | 'cancel';

export const formStatusActionTargets: Record<FormStatusAction, FormStatus> = {
  publish: 'PUBLISHED',
  unpublish: 'DRAFT',
  finish: 'FINISHED',
  cancel: 'CANCELLED',
};

const FORM_STATUS_ACTIONS: FormStatusAction[] = ['publish', 'unpublish', 'finish', 'cancel'];

// Ações disponíveis para o status atual, conforme as transições permitidas.
export const getFormStatusActions = (status: FormStatus) => {
  return FORM_STATUS_ACTIONS.filter((action) => {
    const target = formStatusActionTargets[action];

    return target !== status && canChangeFormStatus(status, target);
  });
};

// Imagem do cabeçalho: PNG, JPG/JPEG ou WebP, até 2 MB. Qualquer resolução é aceita: na tela ela
// se adapta à largura disponível, até no máximo 800 x 600 px, sem distorcer.
export const ACCEPTED_HEADER_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;

export const ACCEPTED_HEADER_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'] as const;

export const MAX_HEADER_IMAGE_BYTES = 2 * 1024 * 1024;

export type HeaderImageCandidate = {
  name: string;
  contentType: string;
  byteSize: number;
  // null quando o arquivo não pôde ser lido como imagem.
  width: number | null;
  height: number | null;
};

export type HeaderImageIssue = 'type' | 'size' | 'unreadable';

// Primeiro motivo de recusa da imagem, ou null quando ela é aceita.
export const checkHeaderImage = ({
  byteSize,
  contentType,
  height,
  name,
  width,
}: HeaderImageCandidate): HeaderImageIssue | null => {
  const lowerName = name.toLowerCase();

  const hasAcceptedType = (ACCEPTED_HEADER_IMAGE_TYPES as readonly string[]).includes(contentType);

  const hasAcceptedExtension = ACCEPTED_HEADER_IMAGE_EXTENSIONS.some((extension) =>
    lowerName.endsWith(extension),
  );

  if (!hasAcceptedType || !hasAcceptedExtension) {
    return 'type';
  }

  if (byteSize > MAX_HEADER_IMAGE_BYTES) {
    return 'size';
  }

  if (width === null || height === null) {
    return 'unreadable';
  }

  return null;
};

// Campos recusados pelo servidor, no formato de caminho do contrato (ex.: endsOn, questions.0.title).
export class InvalidFormDataError extends Error {
  readonly fields: string[];

  constructor(fields: string[]) {
    super('Invalid form data');

    this.name = 'InvalidFormDataError';

    this.fields = fields;
  }
}

// Conflito de regra (versão desatualizada, transição de status recusada...). detail é a explicação
// devolvida pelo servidor, quando houver.
export class FormConflictError extends Error {
  readonly detail?: string;

  constructor(detail?: string) {
    super('Form conflict');

    this.name = 'FormConflictError';

    this.detail = detail;
  }
}

export class FormNotFoundError extends Error {
  constructor() {
    super('Form not found');

    this.name = 'FormNotFoundError';
  }
}

// Conta sem permissão (HTTP 403).
export class FormAccessDeniedError extends Error {
  constructor() {
    super('Form access denied');

    this.name = 'FormAccessDeniedError';
  }
}

// O BFF não respondeu ou respondeu fora do contrato.
export class FormsUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Forms service unavailable', { cause });

    this.name = 'FormsUnavailableError';
  }
}

// Alterações exigem o token CSRF da sessão; a edição exige também a versão lida.
export interface FormsGateway {
  listForms: (
    department: string,
    status: FormStatus | null,
    cursor: string | null,
    // Tamanho da página (padrão do servidor: 10; máximo: 100).
    limit?: number,
  ) => Promise<FormPage>;
  getFormsSummary: (department: string) => Promise<FormsSummary>;
  getForm: (id: string) => Promise<Form>;
  createForm: (csrfToken: string, department: string, details: FormDetails) => Promise<Form>;
  updateForm: (
    csrfToken: string,
    id: string,
    version: number,
    details: FormDetails,
  ) => Promise<Form>;
  changeFormStatus: (
    csrfToken: string,
    id: string,
    version: number,
    status: FormStatus,
  ) => Promise<Form>;
  // Começa o envio dos e-mails aos grupos (convite ou lembrete aos pendentes, com mensagem opcional);
  // o formulário volta com o envio em andamento (SENDING).
  startEmailDispatch: (
    csrfToken: string,
    id: string,
    options: { kind: 'INVITE' | 'REMINDER'; message: string | null },
  ) => Promise<Form>;
  // Apaga o conteúdo das respostas (LGPD); só com o formulário finalizado ou cancelado.
  purgeAnswers: (csrfToken: string, id: string) => Promise<Form>;
  deleteForm: (csrfToken: string, id: string) => Promise<void>;
  // Cópia não publicada (duplicar ou começar a partir de um modelo).
  duplicateForm: (csrfToken: string, id: string) => Promise<Form>;
  // A imagem vai direto ao bucket de mídia: pede a URL, envia (HeaderImageTransfer) e confirma.
  requestHeaderImageUpload: (
    csrfToken: string,
    id: string,
    contentType: HeaderImageContentType,
  ) => Promise<HeaderImageUploadTicket>;
  completeHeaderImageUpload: (csrfToken: string, id: string, uploadId: string) => Promise<Form>;
  removeHeaderImage: (csrfToken: string, id: string) => Promise<Form>;
  listEmailGroups: () => Promise<EmailGroup[]>;
}

export type HeaderImageContentType = (typeof ACCEPTED_HEADER_IMAGE_TYPES)[number];

// URL pré-assinada para o navegador enviar a imagem direto ao bucket, com este Content-Type.
export type HeaderImageUploadTicket = {
  uploadId: string;
  uploadUrl: string;
  contentType: HeaderImageContentType;
  expiresAt: string;
};

// O bucket recusou ou não recebeu o envio (status 0 = falha de rede).
export class HeaderImageTransferError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Header image transfer failed with status ${status}`);

    this.name = 'HeaderImageTransferError';

    this.status = status;
  }
}

// Os dados do formulário foram salvos, mas a troca ou a remoção da imagem falhou.
export class HeaderImageSaveError extends Error {
  readonly form: Form;

  constructor(form: Form, cause: unknown) {
    super('Form saved without the header image change', { cause });

    this.name = 'HeaderImageSaveError';

    this.form = form;
  }
}

export interface HeaderImageTransfer {
  send: (ticket: HeaderImageUploadTicket, file: File) => Promise<void>;
}

// Leitura local das dimensões de uma imagem, antes do envio.
export interface ImageInspector {
  readDimensions: (file: File) => Promise<{ width: number; height: number } | null>;
}
