import type { PageTitleKey } from '@/app/router/page-title';
import maintenancePage from '@/assets/images/maintenance-page.webp';
import { StatusPage } from '@/components/organisms';
import { useUnderConstructionViewModel } from '@/features/under-construction/presentation/view-models/under-construction.view-model';
import { useTranslation } from 'react-i18next';

type UnderConstructionViewProps = {
  page: PageTitleKey;
};

export const UnderConstructionView = ({ page }: UnderConstructionViewProps) => {
  const { canGoBack, handleGoBack } = useUnderConstructionViewModel();

  const { t } = useTranslation();

  return (
    <StatusPage
      canGoBack={canGoBack}
      description={t('statusPage.underConstruction.description')}
      eyebrow={t(`pageTitles.${page}`)}
      image={{ src: maintenancePage, width: 1200, height: 771 }}
      title={t('statusPage.underConstruction.title')}
      onGoBack={handleGoBack}
    />
  );
};
