import pageNotFound from '@/assets/images/page-not-found.webp';
import { StatusPage } from '@/components/organisms';
import { cn } from '@/lib/utils';
import { useHistoryBack } from '@/shared/navigation/use-history-back';

export const RouteNotFound = () => {
  const { canGoBack, goBack } = useHistoryBack();

  return (
    <StatusPage
      canGoBack={canGoBack}
      description="O endereço que você tentou acessar não existe ou foi alterado. Você pode voltar para onde estava ou ir para a página inicial."
      eyebrow="Erro 404"
      image={{
        src: pageNotFound,
        width: 1200,
        height: 553,
        className: cn('rounded-2xl shadow-elevated-lg'),
      }}
      title="Página não encontrada"
      onGoBack={goBack}
    />
  );
};
