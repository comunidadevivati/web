import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from '@/components/ui';
import { COMMUNITY_CONTACT } from '@/features/contact/domain/community-contact';
import type {
  ContactChannel,
  ContactSocialLink,
} from '@/features/contact/presentation/models/contact.model';
import { MailIcon, MapPinIcon, NavigationIcon, PhoneIcon } from 'lucide-react';

const { address, email, phone, socialNetworks } = COMMUNITY_CONTACT;

const fullAddress = `${address.street} - ${address.district}, ${address.city} - ${address.state}, ${address.postalCode}`;

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

const whatsAppUrl = `https://wa.me/${phone.e164.replace(/\D/g, '')}`;

const channels: ContactChannel[] = [
  {
    id: 'address',
    title: 'Endereço',
    details: [
      `${address.street} - ${address.district}`,
      `${address.city} - ${address.state}, ${address.postalCode}`,
    ],
    icon: MapPinIcon,
    actions: [
      {
        label: 'Ver no mapa',
        ariaLabel: 'Ver o endereço no Google Maps (abre em nova aba)',
        href: mapsUrl,
        icon: NavigationIcon,
        isExternal: true,
        variant: 'primary',
      },
    ],
  },
  {
    id: 'phone',
    title: 'Telefone e WhatsApp',
    details: [phone.display],
    icon: PhoneIcon,
    actions: [
      {
        label: 'WhatsApp',
        ariaLabel: 'Conversar pelo WhatsApp (abre em nova aba)',
        href: whatsAppUrl,
        icon: WhatsAppIcon,
        isExternal: true,
        variant: 'whatsapp',
      },
      {
        label: 'Ligar',
        ariaLabel: `Ligar para ${phone.display}`,
        href: `tel:${phone.e164}`,
        icon: PhoneIcon,
        isExternal: false,
        variant: 'secondary',
      },
    ],
  },
  {
    id: 'email',
    title: 'E-mail',
    details: [email],
    icon: MailIcon,
    actions: [
      {
        label: 'Enviar e-mail',
        ariaLabel: `Enviar e-mail para ${email}`,
        href: `mailto:${email}`,
        icon: MailIcon,
        isExternal: false,
        variant: 'primary',
      },
    ],
  },
];

const socialLinks: ContactSocialLink[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@comunidadevivacg',
    href: socialNetworks.instagram,
    icon: InstagramIcon,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'comunidadevivacg',
    href: socialNetworks.facebook,
    icon: FacebookIcon,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'Comunidade Viva',
    href: socialNetworks.youtube,
    icon: YouTubeIcon,
  },
];

export const useContactViewModel = () => {
  return {
    channels,
    socialLinks,
  };
};
