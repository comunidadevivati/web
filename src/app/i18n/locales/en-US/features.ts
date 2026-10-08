import type { Translations } from '@/app/i18n/i18n.model';

export const auth = {
  login: {
    tagline: 'A place built to connect people, ministries and purposes.',
    title: 'Welcome',
    subtitle: 'Sign in with your credentials to access your account.',
    email: 'Email',
    emailPlaceholder: 'youremail@example.com',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    submit: 'Sign in',
    validation: {
      emailRequired: 'Enter your email.',
      emailInvalid: 'Enter a valid email.',
      passwordRequired: 'Enter your password.',
    },
  },
} as const satisfies Translations['auth'];

export const home = {
  carouselLabel: 'Comunidade Viva photos',
  slides: {
    mg1387: 'Congregation with raised hands during worship',
    mg0579: 'Men embracing in prayer',
    mg0390: 'Group prayer in front of the stage',
    mg9923: 'Woman with a raised hand in worship',
    mg1023: 'Young people praying together',
    mg1339: 'Man and woman praying together',
    mg1211: 'Prayer with laying on of hands',
    mg1232: 'Man worshipping near the stage',
  },
} as const satisfies Translations['home'];

export const dashboard = {
  title: 'Dashboard',
  subtitle: 'Overview of Comunidade Viva.',
  summaries: {
    members: {
      label: 'Members',
      description: 'Registered members',
    },
    visitors: {
      label: 'Visitors',
      description: 'Visitors in the period',
    },
    events: {
      label: 'Events',
      description: 'Upcoming events',
    },
    ministries: {
      label: 'Ministries',
      description: 'Active ministries',
    },
  },
  upcomingEvents: {
    title: 'Upcoming events',
    description: "The community's planned schedule",
    badge: 'Event',
    next: 'Upcoming',
    items: {
      celebration: 'Celebration Service',
      leaders: 'Leaders Meeting',
      families: 'Family Conference',
    },
  },
  recentActivities: {
    title: 'Recent activity',
    description: 'Latest recorded changes',
    items: {
      newMember: 'New member registered',
      newVisitor: 'New visitor registered',
      eventUpdated: 'Event updated',
    },
  },
} as const satisfies Translations['dashboard'];

export const contact = {
  eyebrow: 'Get in touch',
  title: 'Contact',
  description:
    'Would you like to get to know Comunidade Viva or have a question? Reach us through one of the channels below.',
  channels: {
    address: {
      title: 'Address',
      mapAction: 'View on map',
      mapAriaLabel: 'View the address on Google Maps (opens in a new tab)',
    },
    phone: {
      title: 'Phone and WhatsApp',
      whatsAppAction: 'WhatsApp',
      whatsAppAriaLabel: 'Chat on WhatsApp (opens in a new tab)',
      callAction: 'Call',
      callAriaLabel: 'Call {{phone}}',
    },
    email: {
      title: 'Email',
      sendAction: 'Send email',
      sendAriaLabel: 'Send an email to {{email}}',
    },
  },
  social: {
    title: 'Social media',
    description: 'Follow Comunidade Viva and stay up to date.',
    linkAriaLabel: 'Comunidade Viva on {{name}} (opens in a new tab)',
  },
} as const satisfies Translations['contact'];

export const guestWifi = {
  eyebrow: 'VIVA Wi-Fi - Guests',
  title: 'Welcome to Comunidade Viva!',
  intro:
    "We're so glad you're here. To use the internet, accept the terms of use and enter your name and phone number.",
  unavailable: {
    title: 'Access unavailable',
    description:
      'This page opens automatically when you connect to the "VIVA - Visitantes" Wi-Fi network. Connect to the network and wait for the page to open.',
    goToSite: 'Go to the Comunidade Viva website',
  },
  steps: {
    label: 'Steps',
    terms: 'Terms',
    data: 'Your details',
  },
  terms: {
    title: 'Terms of use and privacy policy',
    updatedAt: 'Last updated: {{date}}',
    accept:
      'I have read and accept the terms of use, the privacy policy and the image and voice use authorization.',
    continue: 'Continue',
  },
  form: {
    title: 'Your details',
    description: 'Fill in to unlock internet access.',
    fullName: 'Full name',
    fullNamePlaceholder: 'Your first and last name',
    phone: 'Phone (WhatsApp)',
    phonePlaceholder: '(67) 99999-9999',
    backToTerms: 'Back to the terms',
    connect: 'Connect',
    validation: {
      fullNameRequired: 'Enter your full name.',
      fullNameTooLong: 'The name must be at most 120 characters long.',
      fullNameIncomplete: 'Enter your first and last name.',
      phoneRequired: 'Enter your phone number.',
      phoneInvalid: 'Enter a valid phone number with area code.',
    },
  },
  error: {
    title: 'We could not unlock your access',
    description:
      'Check that you are still connected to the "VIVA - Visitantes" network and try again. If the problem persists, please ask the front desk.',
    code: 'Error code: {{code}}',
  },
  success: {
    title: "You're connected!",
    description: 'Your internet access is unlocked. Enjoy, and welcome to Comunidade Viva.',
    continue: 'Continue browsing',
    redirect_one: 'You will be taken to the website in {{count}} second.',
    redirect_other: 'You will be taken to the website in {{count}} seconds.',
  },
} as const satisfies Translations['guestWifi'];
