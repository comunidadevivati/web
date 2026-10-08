import type { ComponentType } from 'react';

export type ContactIcon = ComponentType<{
  className?: string;
}>;

export type ContactActionVariant = 'primary' | 'secondary' | 'whatsapp';

export type ContactSocialBrand = 'instagram' | 'facebook' | 'youtube';

export type ContactAction = {
  label: string;
  ariaLabel: string;
  href: string;
  icon: ContactIcon;
  isExternal: boolean;
  variant: ContactActionVariant;
};

export type ContactChannel = {
  id: string;
  title: string;
  details: string[];
  icon: ContactIcon;
  actions: ContactAction[];
};

export type ContactSocialLink = {
  id: ContactSocialBrand;
  name: string;
  handle: string;
  href: string;
  icon: ContactIcon;
};
