import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { subscriptionsQueryOptions } from '@/features/profile/application/queries/profile.query';
import { updateSubscriptionsUseCase } from '@/features/profile/application/use-cases/update-subscriptions.use-case';
import type { Subscriptions } from '@/features/profile/domain/profile';
import { getProfileNotice } from '@/features/profile/presentation/models/profile.model';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

// Inscrições da conta: cada opção é gravada assim que marcada ou desmarcada.
export const useProfileSubscriptionsViewModel = () => {
  const { t } = useTranslation('profile');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const { data: subscriptions, isPending: isLoading } = useQuery(subscriptionsQueryOptions);

  const { isPending: isSaving, mutate } = useMutation({
    mutationFn: ({ csrfToken, next }: { csrfToken: string; next: Subscriptions }) =>
      updateSubscriptionsUseCase(csrfToken, next),
    onSuccess: (saved) => {
      queryClient.setQueryData(subscriptionsQueryOptions.queryKey, saved);

      notify.success({
        title: t('success.subscriptions.title'),
        description: saved.news ? t('success.subscriptions.on') : t('success.subscriptions.off'),
      });
    },
    onError: (error) => {
      const notice = getProfileNotice(error);

      notify.error({
        title: t(`notices.${notice}.title`),
        description: t(`notices.${notice}.description`),
      });
    },
  });

  const toggleNews = (news: boolean) => {
    if (session && !isSaving) {
      mutate({ csrfToken: session.csrfToken, next: { news } });
    }
  };

  return {
    isDisabled: isLoading || isSaving,
    news: subscriptions?.news ?? false,
    toggleNews,
  };
};
