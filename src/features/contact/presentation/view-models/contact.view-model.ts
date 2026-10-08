import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from '@/components/ui';
import { COMMUNITY_CONTACT } from '@/features/contact/domain/community-contact';
import type {
  ContactChannel,
  ContactSocialLink,
} from '@/features/contact/presentation/models/contact.model';
import { MailIcon, MapPinIcon, NavigationIcon, PhoneIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { address, email, phone, socialNetworks } = COMMUNITY_CONTACT;

const fullAddress = `${address.street} - ${address.district}, ${address.city} - ${address.state}, ${address.postalCode}`;

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

const whatsAppUrl = `https://wa.me/${phone.e164.replace(/\D/g, '')}`;

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
  const { t } = useTranslation('contact');

  const channels: ContactChannel[] = [
    {
      id: 'address',
      title: t('channels.address.title'),
      details: [
        `${address.street} - ${address.district}`,
        `${address.city} - ${address.state}, ${address.postalCode}`,
      ],
      icon: MapPinIcon,
      actions: [
        {
          label: t('channels.address.mapAction'),
          ariaLabel: t('channels.address.mapAriaLabel'),
          href: mapsUrl,
          icon: NavigationIcon,
          isExternal: true,
          variant: 'primary',
        },
      ],
    },
    {
      id: 'phone',
      title: t('channels.phone.title'),
      details: [phone.display],
      icon: PhoneIcon,
      actions: [
        {
          label: t('channels.phone.whatsAppAction'),
          ariaLabel: t('channels.phone.whatsAppAriaLabel'),
          href: whatsAppUrl,
          icon: WhatsAppIcon,
          isExternal: true,
          variant: 'whatsapp',
        },
        {
          label: t('channels.phone.callAction'),
          ariaLabel: t('channels.phone.callAriaLabel', { phone: phone.display }),
          href: `tel:${phone.e164}`,
          icon: PhoneIcon,
          isExternal: false,
          variant: 'secondary',
        },
      ],
    },
    {
      id: 'email',
      title: t('channels.email.title'),
      details: [email],
      icon: MailIcon,
      actions: [
        {
          label: t('channels.email.sendAction'),
          ariaLabel: t('channels.email.sendAriaLabel', { email }),
          href: `mailto:${email}`,
          icon: MailIcon,
          isExternal: false,
          variant: 'primary',
        },
      ],
    },
  ];

  return {
    channels,
    socialLinks,
  };
};
