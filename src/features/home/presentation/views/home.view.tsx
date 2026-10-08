import { AppFooter, PublicHeader } from '@/components/organisms';
import { Box, Carousel } from '@/components/ui';
import { useHomeViewModel } from '@/features/home/presentation/view-models/home.view-model';
import { useTranslation } from 'react-i18next';

export const HomeView = () => {
  const { carouselSlides } = useHomeViewModel();

  const { t } = useTranslation('home');

  return (
    <Box className="flex min-h-dvh flex-col overflow-x-clip bg-background">
      <PublicHeader />

      <Box className="flex-1" role="main">
        <Box className="mx-auto w-full max-w-360">
          <Carousel
            className="
              aspect-4/5 max-h-[calc(100dvh-8rem)] w-full sm:aspect-4/3 md:max-h-[calc(100dvh-9rem)]
              lg:aspect-16/9
            "
            label={t('carouselLabel')}
            slides={carouselSlides}
          />
        </Box>
      </Box>

      <AppFooter />
    </Box>
  );
};
