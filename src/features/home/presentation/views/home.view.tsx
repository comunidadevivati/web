import { PublicHeader } from '@/components/public-header/public-header';
import { Box } from '@/components/ui/box';
import { Carousel } from '@/components/ui/carousel';
import { useHomeViewModel } from '@/features/home/presentation/view-models/home.view-model';

export const HomeView = () => {
  const { carouselSlides } = useHomeViewModel();

  return (
    <Box className="min-h-dvh overflow-x-hidden bg-shell">
      <PublicHeader />

      <Box role="main">
        <Box className="mx-auto w-full max-w-360">
          <Carousel
            className="
              aspect-4/5 max-h-[calc(100dvh-4rem)] w-full sm:aspect-4/3
              md:max-h-[calc(100dvh-4.5rem)] lg:aspect-16/9
            "
            label="Fotos da Comunidade Viva"
            slides={carouselSlides}
          />
        </Box>
      </Box>
    </Box>
  );
};
