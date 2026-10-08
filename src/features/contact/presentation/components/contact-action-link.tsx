import { Anchor } from '@/components/ui/anchor';
import type { ContactAction } from '@/features/contact/presentation/models/contact.model';
import { cva } from 'class-variance-authority';

const contactActionLinkVariants = cva(
  `
    inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold
    transition-all duration-200 focus-visible:ring-2 focus-visible:ring-shell-accent
    focus-visible:ring-offset-2 focus-visible:ring-offset-shell focus-visible:outline-none sm:h-10
  `,
  {
    variants: {
      variant: {
        primary: `
          border-shell-accent bg-shell-accent text-shell hover:border-shell-accent-foreground
          hover:bg-shell-accent-foreground
        `,
        secondary: `
          border-shell-accent/40 bg-shell-accent/10 text-shell-accent-foreground
          hover:border-shell-accent hover:bg-shell-accent/20
        `,
        whatsapp: `
          border-social-whatsapp bg-social-whatsapp text-social-whatsapp-foreground
          hover:brightness-110
        `,
      },
    },
  },
);

type ContactActionLinkProps = {
  action: ContactAction;
};

export const ContactActionLink = ({ action }: ContactActionLinkProps) => {
  const { ariaLabel, href, icon: Icon, isExternal, label, variant } = action;

  return (
    <Anchor
      aria-label={ariaLabel}
      className={contactActionLinkVariants({ variant })}
      href={href}
      isExternal={isExternal}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Anchor>
  );
};
