import maintenancePage from '@/assets/images/maintenance-page.webp';
import { StatusPage } from '@/components/organisms';
import { useUnderConstructionViewModel } from '@/features/under-construction/presentation/view-models/under-construction.view-model';

type UnderConstructionViewProps = {
  pageName: string;
};

export const UnderConstructionView = ({ pageName }: UnderConstructionViewProps) => {
  const { canGoBack, handleGoBack } = useUnderConstructionViewModel();

  return (
    <StatusPage
      canGoBack={canGoBack}
      description="Esta página ainda está sendo preparada e estará disponível em breve. Enquanto isso, você pode voltar para onde estava ou ir para a página inicial."
      eyebrow={pageName}
      image={{ src: maintenancePage, width: 1200, height: 771 }}
      title="Página em construção"
      onGoBack={handleGoBack}
    />
  );
};
