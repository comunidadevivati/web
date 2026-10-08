import pageNotFound from '@/assets/images/page-not-found.webp';
import { StatusPage } from '@/components/organisms';
import { cn } from '@/lib/utils';
import { useHistoryBack } from '@/shared/navigation/use-history-back';
import { useTranslation } from 'react-i18next';

export const RouteNotFound = () => {
  const { canGoBack, goBack } = useHistoryBack();

  const { t } = useTranslation();

  return (
    <StatusPage
      canGoBack={canGoBack}
      description={t('statusPage.notFound.description')}
      eyebrow={t('statusPage.notFound.eyebrow')}
      image={{
        src: pageNotFound,
        width: 1200,
        height: 553,
        className: cn('rounded-2xl shadow-elevated-lg'),
      }}
      title={t('statusPage.notFound.title')}
      onGoBack={goBack}
    />
  );
};
