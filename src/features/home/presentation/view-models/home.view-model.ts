import type { Translations } from '@/app/i18n/i18n.model';
import mg0390 from '@/assets/home-carrousel/mg-0390.webp';
import mg0579 from '@/assets/home-carrousel/mg-0579.webp';
import mg1023 from '@/assets/home-carrousel/mg-1023.webp';
import mg1211 from '@/assets/home-carrousel/mg-1211.webp';
import mg1232 from '@/assets/home-carrousel/mg-1232.webp';
import mg1339 from '@/assets/home-carrousel/mg-1339.webp';
import mg1387 from '@/assets/home-carrousel/mg-1387.webp';
import mg9923 from '@/assets/home-carrousel/mg-9923.webp';
import { type CarouselSlide } from '@/components/ui';
import { useTranslation } from 'react-i18next';

type HomeSlideKey = keyof Translations['home']['slides'];

const slideImages: { id: string; key: HomeSlideKey; src: string }[] = [
  { id: 'mg-1387', key: 'mg1387', src: mg1387 },
  { id: 'mg-0579', key: 'mg0579', src: mg0579 },
  { id: 'mg-0390', key: 'mg0390', src: mg0390 },
  { id: 'mg-9923', key: 'mg9923', src: mg9923 },
  { id: 'mg-1023', key: 'mg1023', src: mg1023 },
  { id: 'mg-1339', key: 'mg1339', src: mg1339 },
  { id: 'mg-1211', key: 'mg1211', src: mg1211 },
  { id: 'mg-1232', key: 'mg1232', src: mg1232 },
];

export const useHomeViewModel = () => {
  const { t } = useTranslation('home');

  const carouselSlides: CarouselSlide[] = slideImages.map(({ id, key, src }) => ({
    id,
    src,
    alt: t(`slides.${key}`),
  }));

  return {
    carouselSlides,
  };
};
