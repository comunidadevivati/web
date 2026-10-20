import type { StatusBadgeTone } from '@/components/molecules';
import {
  emailSchema,
  fullNameSchema,
  phoneSchema,
} from '@/features/auth/presentation/models/register.model';
import {
  InvalidUserDataError,
  UserConflictError,
  UserEmailTakenError,
  UserNotFoundError,
  UserRequestError,
  UsersAccessDeniedError,
  type UserAccount,
  type UserAction,
  type UserFilters,
  type UserStatus,
} from '@/features/users/domain/user';
import { formatPhone } from '@/shared/validation/brazilian-phone';
import { z } from 'zod';

export const USER_FILTERS = ['ALL', 'ACTIVE', 'SUSPENDED', 'VERIFIED', 'UNVERIFIED'] as const;

export type UserFilter = (typeof USER_FILTERS)[number];

// Filtros aplicados à lista: um valor por grupo (situação e verificação), combináveis entre si.
export type UserFilterSelection = Pick<UserFilters, 'status' | 'emailVerified'>;

export const NO_USER_FILTERS: UserFilterSelection = { status: null, emailVerified: null };

const filterSelections: Record<Exclude<UserFilter, 'ALL'>, Partial<UserFilterSelection>> = {
  ACTIVE: { status: 'ACTIVE' },
  SUSPENDED: { status: 'SUSPENDED' },
  VERIFIED: { emailVerified: true },
  UNVERIFIED: { emailVerified: false },
};

// "Todas" fica marcado somente sem nenhum outro filtro.
export const isUserFilterSelected = (selection: UserFilterSelection, filter: UserFilter) => {
  if (filter === 'ALL') {
    return selection.status === null && selection.emailVerified === null;
  }

  return Object.entries(filterSelections[filter]).every(
    ([key, value]) => selection[key as keyof UserFilterSelection] === value,
  );
};

// "Todas" limpa os filtros. Os demais alternam: marcar substitui o outro valor do mesmo grupo
// (ex.: Suspensas no lugar de Ativas) e marcar de novo remove o filtro.
export const toggleUserFilter = (
  selection: UserFilterSelection,
  filter: UserFilter,
): UserFilterSelection => {
  if (filter === 'ALL') {
    return NO_USER_FILTERS;
  }

  const changes = filterSelections[filter];

  if (isUserFilterSelected(selection, filter)) {
    return {
      ...selection,
      ...Object.fromEntries(Object.keys(changes).map((key) => [key, null])),
    };
  }

  return { ...selection, ...changes };
};

// Data e hora no padrão "16/10/2026 às 16:31:28" (o conector vem da tradução).
export const createDateTimeFormatter = (
  locale: string,
  join: (parts: { date: string; time: string }) => string,
) => {
  const date = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  return (iso: string) => {
    const value = new Date(iso);

    return join({ date: date.format(value), time: time.format(value) });
  };
};

export const userStatusTones: Record<UserStatus, StatusBadgeTone> = {
  ACTIVE: 'success',
  SUSPENDED: 'neutral',
};

// Falhas das requests, exibidas em toast (a lista sem dados mostra o aviso na própria página).
export type UsersNotice =
  | 'invalidData'
  | 'emailTaken'
  | 'conflict'
  | 'notFound'
  | 'accessDenied'
  | 'unavailable';

export const getUsersNotice = (error: Error): UsersNotice => {
  if (error instanceof InvalidUserDataError) {
    return 'invalidData';
  }

  if (error instanceof UserEmailTakenError) {
    return 'emailTaken';
  }

  if (error instanceof UserConflictError) {
    return 'conflict';
  }

  if (error instanceof UserNotFoundError) {
    return 'notFound';
  }

  if (error instanceof UsersAccessDeniedError) {
    return 'accessDenied';
  }

  return 'unavailable';
};

// Mensagem do servidor para a recusa, quando houver; sem ela, o toast usa o texto traduzido.
export const getUsersErrorDetail = (error: Error) => {
  return error instanceof UserRequestError ? error.detail : undefined;
};

// Ação aguardando confirmação.
export type UserActionRequest = {
  action: UserAction;
  user: UserAccount;
};

// Ações disponíveis para uma conta. A própria conta não pode ser suspensa nem excluída, e a
// exclusão definitiva vale somente para conta que nunca verificou o e-mail.
export const getUserActions = (user: UserAccount, currentUserId: string): UserAction[] => {
  if (user.id === currentUserId) {
    return [];
  }

  const statusAction: UserAction = user.status === 'ACTIVE' ? 'suspend' : 'reactivate';

  return user.emailVerified ? [statusAction] : [statusAction, 'delete'];
};

// Edição: nome, telefone e e-mail com as mesmas regras do cadastro (mensagens do namespace "auth").
export const userEditFormSchema = z.object({
  fullName: fullNameSchema,
  phone: phoneSchema,
  email: emailSchema,
});

export type UserEditFormInput = z.input<typeof userEditFormSchema>;

export type UserEditFormData = z.output<typeof userEditFormSchema>;

export const toUserEditFormInput = ({ email, name, phone }: UserAccount): UserEditFormInput => ({
  fullName: name,
  phone: phone ? formatPhone(phone) : '',
  email,
});
