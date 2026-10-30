import { getEmailGroupUseCase } from '@/features/communication/application/use-cases/get-email-group.use-case';
import { listEmailGroupsUseCase } from '@/features/communication/application/use-cases/list-email-groups.use-case';
import { listEmailRecipientsUseCase } from '@/features/communication/application/use-cases/list-email-recipients.use-case';
import { queryOptions } from '@tanstack/react-query';

// Raiz das chaves dos grupos: invalidada após qualquer alteração. Inclui a lista de grupos usada
// pelo editor de formulários (['email-groups']).
export const EMAIL_GROUPS_QUERY_KEY = ['email-groups'] as const;

export const emailGroupListQueryOptions = () => {
  return queryOptions({
    queryKey: [...EMAIL_GROUPS_QUERY_KEY, 'list'],
    queryFn: () => listEmailGroupsUseCase(),
  });
};

export const emailGroupQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: [...EMAIL_GROUPS_QUERY_KEY, 'group', id],
    queryFn: () => getEmailGroupUseCase(id),
  });
};

export const emailRecipientsQueryOptions = () => {
  return queryOptions({
    queryKey: ['email-recipients'],
    queryFn: () => listEmailRecipientsUseCase(),
  });
};
