import { PublicHeader } from '@/components/organisms';
import { Box, Heading, Text } from '@/components/ui';
import { ContactChannelCard } from '@/features/contact/presentation/components/contact-channel-card';
import { ContactSocialLink } from '@/features/contact/presentation/components/contact-social-link';
import { useContactViewModel } from '@/features/contact/presentation/view-models/contact.view-model';

export const ContactView = () => {
  const { channels, socialLinks } = useContactViewModel();

  return (
    <Box className="min-h-dvh overflow-x-hidden bg-background">
      <PublicHeader />

      <Box role="main">
        <Box
          className="
            mx-auto grid w-full max-w-360 gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 lg:gap-12
            lg:px-8 lg:py-16
          "
        >
          <Box className="grid max-w-2xl gap-3">
            <Text
              className="
                text-xs font-semibold tracking-widest text-primary-strong uppercase sm:text-sm
              "
            >
              Fale conosco
            </Text>

            <Heading className="text-3xl text-foreground sm:text-4xl lg:text-5xl">Contato</Heading>

            <Text className="text-base text-muted-foreground sm:text-lg">
              Quer conhecer a Comunidade Viva ou tirar uma dúvida? Fale com a gente por um dos
              canais abaixo.
            </Text>
          </Box>

          <Box className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {channels.map((channel) => (
              <ContactChannelCard key={channel.id} channel={channel} />
            ))}
          </Box>

          <Box aria-labelledby="contact-social-title" className="grid gap-4 sm:gap-5" role="region">
            <Box className="grid gap-1">
              <Heading
                className="text-xl text-foreground sm:text-2xl"
                id="contact-social-title"
                level={2}
              >
                Redes sociais
              </Heading>

              <Text className="text-base text-muted-foreground">
                Acompanhe a Comunidade Viva e fique por dentro das novidades.
              </Text>
            </Box>

            <Box className="grid gap-3 sm:grid-cols-3 lg:gap-6">
              {socialLinks.map((link) => (
                <ContactSocialLink key={link.id} link={link} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
