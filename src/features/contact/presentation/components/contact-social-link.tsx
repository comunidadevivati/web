import { Anchor, Box } from '@/components/ui';
import type { ContactSocialLink as ContactSocialLinkData } from '@/features/contact/presentation/models/contact.model';
import { cva } from 'class-variance-authority';
import { ExternalLinkIcon } from 'lucide-react';

const socialIconVariants = cva(
  `
    flex size-11 shrink-0 items-center justify-center rounded-lg text-social-foreground
    shadow-elevated transition-transform duration-200 group-hover:scale-105
  `,
  {
    variants: {
      brand: {
        instagram: `
          bg-linear-to-tr from-social-instagram-start via-social-instagram-middle
          to-social-instagram-end
        `,
        facebook: 'bg-social-facebook',
        youtube: 'bg-social-youtube',
      },
    },
  },
);

type ContactSocialLinkProps = {
  link: ContactSocialLinkData;
};

export const ContactSocialLink = ({ link }: ContactSocialLinkProps) => {
  const { handle, href, icon: Icon, id, name } = link;

  return (
    <Anchor
      aria-label={`${name} da Comunidade Viva (abre em nova aba)`}
      className="
        group flex min-h-16 items-center gap-4 rounded-xl border border-border surface-card px-4
        py-3 shadow-elevated transition-all duration-200 hover:-translate-y-0.5 hover:border-primary
        hover:shadow-elevated-lg focus-visible:ring-2 focus-visible:ring-ring
        focus-visible:outline-none
      "
      href={href}
      isExternal
    >
      <Box className={socialIconVariants({ brand: id })}>
        <Icon className="size-6" />
      </Box>

      <Box className="grid min-w-0 flex-1">
        <Box className="text-base font-semibold">{name}</Box>

        <Box className="truncate text-sm text-muted-foreground">{handle}</Box>
      </Box>

      <ExternalLinkIcon
        aria-hidden="true"
        className="
          size-4 shrink-0 text-muted-foreground transition-colors duration-200
          group-hover:text-primary-strong
        "
      />
    </Anchor>
  );
};
