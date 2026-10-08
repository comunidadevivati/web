import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type CarouselSlide = {
  id: string;
  src: string;
  alt: string;
};

type CarouselProps = {
  slides: CarouselSlide[];
  label: string;
  autoplayInterval?: number;
  className?: string;
};

const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const Carousel = ({ slides, label, autoplayInterval = 6000, className }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  const { t } = useTranslation();

  const slidesCount = slides.length;

  const showPrevious = () => {
    setCurrentIndex((index) => (index - 1 + slidesCount) % slidesCount);
  };

  const showNext = () => {
    setCurrentIndex((index) => (index + 1) % slidesCount);
  };

  useEffect(() => {
    if (isPaused || slidesCount < 2 || prefersReducedMotion()) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slidesCount);
    }, autoplayInterval);

    return () => {
      window.clearInterval(timer);
    };
  }, [autoplayInterval, isPaused, slidesCount]);

  return (
    <section
      aria-label={label}
      aria-roledescription={t('carousel.roleDescription')}
      className={cn('relative overflow-hidden bg-overlay', className)}
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => {
        const isCurrent = index === currentIndex;

        return (
          <div
            key={slide.id}
            aria-hidden={!isCurrent}
            aria-label={t('carousel.slidePosition', { current: index + 1, total: slidesCount })}
            aria-roledescription={t('carousel.slideRoleDescription')}
            className={cn(
              `
                absolute inset-0 transition-opacity duration-1000 ease-out
                motion-reduce:transition-none
              `,
              isCurrent ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            role="group"
          >
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-2xl"
              decoding="async"
              loading={index === 0 ? 'eager' : 'lazy'}
              src={slide.src}
            />

            <img
              alt={slide.alt}
              className="relative size-full object-contain"
              decoding="async"
              loading={index === 0 ? 'eager' : 'lazy'}
              src={slide.src}
            />
          </div>
        );
      })}

      {slidesCount > 1 && (
        <>
          <Button
            aria-label={t('carousel.previous')}
            className="
              absolute top-1/2 left-2 size-10 -translate-y-1/2 rounded-full bg-overlay/35
              text-overlay-foreground backdrop-blur-sm hover:bg-primary/80
              hover:text-primary-foreground sm:left-4 md:size-11 lg:left-6
            "
            size="icon-lg"
            type="button"
            variant="ghost"
            onClick={showPrevious}
          >
            <ChevronLeftIcon className="size-5 md:size-6" />
          </Button>

          <Button
            aria-label={t('carousel.next')}
            className="
              absolute top-1/2 right-2 size-10 -translate-y-1/2 rounded-full bg-overlay/35
              text-overlay-foreground backdrop-blur-sm hover:bg-primary/80
              hover:text-primary-foreground sm:right-4 md:size-11 lg:right-6
            "
            size="icon-lg"
            type="button"
            variant="ghost"
            onClick={showNext}
          >
            <ChevronRightIcon className="size-5 md:size-6" />
          </Button>

          <div
            className="
              absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center rounded-full
              bg-overlay/35 px-1.5 backdrop-blur-sm sm:bottom-5 sm:px-2
            "
          >
            {slides.map((slide, index) => {
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={slide.id}
                  aria-current={isCurrent}
                  aria-label={t('carousel.goTo', { number: index + 1 })}
                  className="
                    group flex h-8 cursor-pointer items-center justify-center rounded-full px-1
                    focus-visible:ring-2 focus-visible:ring-overlay-foreground
                    focus-visible:outline-none sm:h-9 sm:px-1.5
                  "
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                >
                  <span
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      isCurrent
                        ? 'w-6 bg-primary'
                        : 'w-2 bg-overlay-foreground/50 group-hover:bg-overlay-foreground/80',
                    )}
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
