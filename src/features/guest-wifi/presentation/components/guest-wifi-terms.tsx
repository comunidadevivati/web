import { isLocale } from '@/app/i18n/i18n.model';
import { Box, Heading, Text } from '@/components/ui';
import {
  guestWifiTermsEnUS,
  guestWifiTermsNoticeEnUS,
} from '@/features/guest-wifi/presentation/models/guest-wifi-terms.en-us';
import {
  GUEST_WIFI_TERMS_VERSION,
  type GuestWifiTermsByLocale,
} from '@/features/guest-wifi/presentation/models/guest-wifi-terms.model';
import { guestWifiTermsPtBR } from '@/features/guest-wifi/presentation/models/guest-wifi-terms.pt-br';
import { useTranslation } from 'react-i18next';

const termsByLocale: GuestWifiTermsByLocale = {
  'pt-BR': { sections: guestWifiTermsPtBR },
  'en-US': { notice: guestWifiTermsNoticeEnUS, sections: guestWifiTermsEnUS },
};

export const GuestWifiTerms = () => {
  const { i18n, t } = useTranslation('guestWifi');

  const { notice, sections } = termsByLocale[isLocale(i18n.language) ? i18n.language : 'pt-BR'];

  // A versão (AAAA-MM-DD) também é a data da última atualização.
  const updatedAt = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(
    new Date(`${GUEST_WIFI_TERMS_VERSION}T00:00:00`),
  );

  return (
    <Box
      aria-label={t('terms.title')}
      className="
        grid max-h-[45dvh] gap-5 overflow-y-auto rounded-xl border border-border bg-muted/50 p-4
        focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-5
      "
      role="region"
      tabIndex={0}
    >
      <Text className="text-xs">{t('terms.updatedAt', { date: updatedAt })}</Text>

      {notice && <Text className="text-xs font-medium text-foreground">{notice}</Text>}

      {sections.map(({ id, items, paragraphs, title }) => (
        <Box key={id} className="grid gap-2">
          <Heading className="text-sm text-foreground sm:text-base" level={3}>
            {title}
          </Heading>

          {paragraphs.map((paragraph) => (
            <Text key={paragraph} className="leading-relaxed">
              {paragraph}
            </Text>
          ))}

          {items && (
            <Box className="grid gap-1.5 pl-5" role="list">
              {items.map((item) => (
                <Box
                  key={item}
                  className="list-item list-disc text-sm leading-relaxed text-muted-foreground"
                  role="listitem"
                >
                  {item}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};
