import mg0390 from '@/assets/home-carrousel/mg-0390.webp';
import mg0579 from '@/assets/home-carrousel/mg-0579.webp';
import mg1023 from '@/assets/home-carrousel/mg-1023.webp';
import mg1211 from '@/assets/home-carrousel/mg-1211.webp';
import mg1232 from '@/assets/home-carrousel/mg-1232.webp';
import mg1339 from '@/assets/home-carrousel/mg-1339.webp';
import mg1387 from '@/assets/home-carrousel/mg-1387.webp';
import mg9923 from '@/assets/home-carrousel/mg-9923.webp';
import { type CarouselSlide } from '@/components/ui';

const carouselSlides: CarouselSlide[] = [
  {
    id: 'mg-1387',
    src: mg1387,
    alt: 'Congregação com as mãos levantadas durante o louvor',
  },
  {
    id: 'mg-0579',
    src: mg0579,
    alt: 'Homens abraçados em oração',
  },
  {
    id: 'mg-0390',
    src: mg0390,
    alt: 'Oração em grupo em frente ao palco',
  },
  {
    id: 'mg-9923',
    src: mg9923,
    alt: 'Mulher com a mão levantada em adoração',
  },
  {
    id: 'mg-1023',
    src: mg1023,
    alt: 'Jovens em momento de oração',
  },
  {
    id: 'mg-1339',
    src: mg1339,
    alt: 'Homem e mulher orando juntos',
  },
  {
    id: 'mg-1211',
    src: mg1211,
    alt: 'Oração com imposição de mãos',
  },
  {
    id: 'mg-1232',
    src: mg1232,
    alt: 'Homem em adoração próximo ao palco',
  },
];

export const useHomeViewModel = () => {
  return {
    carouselSlides,
  };
};
