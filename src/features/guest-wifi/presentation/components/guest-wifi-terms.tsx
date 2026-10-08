import { Box, Heading, Text } from '@/components/ui';
import {
  GUEST_WIFI_TERMS_UPDATED_AT,
  guestWifiTermsSections,
} from '@/features/guest-wifi/presentation/models/guest-wifi-terms.model';

export const GuestWifiTerms = () => {
  return (
    <Box
      aria-label="Termos de uso e política de privacidade"
      className="
        grid max-h-[45dvh] gap-5 overflow-y-auto rounded-xl border border-border bg-muted/50 p-4
        focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-5
      "
      role="region"
      tabIndex={0}
    >
      <Text className="text-xs">Última atualização: {GUEST_WIFI_TERMS_UPDATED_AT}</Text>

      {guestWifiTermsSections.map(({ id, items, paragraphs, title }) => (
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
