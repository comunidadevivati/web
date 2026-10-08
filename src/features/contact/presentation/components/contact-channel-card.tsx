import { Box, Heading, Text } from '@/components/ui';
import { ContactActionLink } from '@/features/contact/presentation/components/contact-action-link';
import type { ContactChannel } from '@/features/contact/presentation/models/contact.model';

type ContactChannelCardProps = {
  channel: ContactChannel;
};

export const ContactChannelCard = ({ channel }: ContactChannelCardProps) => {
  const { actions, details, icon: Icon, id, title } = channel;

  const titleId = `contact-channel-${id}-title`;

  return (
    <Box
      aria-labelledby={titleId}
      className="
        flex flex-col gap-5 rounded-xl border border-border surface-card p-5 shadow-elevated
        transition-all duration-200 hover:border-primary hover:shadow-elevated-lg sm:p-6
      "
      role="region"
    >
      <Box className="flex items-start gap-4">
        <Box
          className="
            flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/15
            text-primary-strong ring-1 ring-primary/30
          "
        >
          <Icon className="size-5" />
        </Box>

        <Box className="grid min-w-0 gap-1">
          <Heading className="text-base text-card-foreground sm:text-lg" id={titleId} level={2}>
            {title}
          </Heading>

          {details.map((detail) => (
            <Text key={detail} className="text-base wrap-anywhere text-muted-foreground">
              {detail}
            </Text>
          ))}
        </Box>
      </Box>

      <Box className="mt-auto flex flex-wrap gap-2">
        {actions.map((action) => (
          <ContactActionLink key={action.href} action={action} />
        ))}
      </Box>
    </Box>
  );
};
