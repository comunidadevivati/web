import type { Translations } from '@/app/i18n/i18n.model';

export const common = {
  app: {
    name: 'Comunidade Viva',
    fullName: 'Comunidade Viva e Eficaz',
  },
  pageTitles: {
    home: 'Home',
    history: 'History',
    events: 'Events',
    contact: 'Contact',
    login: 'Sign in',
    dashboard: 'Dashboard',
    guestWifi: 'Guest Wi-Fi',
  },
  navigation: {
    home: 'Home',
    history: 'History',
    events: 'Events',
    contact: 'Contact',
    dashboard: 'Dashboard',
    login: 'Sign in',
    logout: 'Sign out',
    accountMenu: 'Account menu',
    greeting: 'Hello, {{name}}',
    mainMenu: 'Main menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    goToHome: 'Go to the home page',
    goToDashboard: 'Go to the dashboard',
    sidebar: 'Side menu',
    sidebarHeading: 'Navigation',
    showSidebar: 'Show side menu',
    hideSidebar: 'Hide side menu',
    expandSidebar: 'Expand side menu',
    collapseSidebar: 'Collapse side menu',
  },
  preferences: {
    label: 'Preferences',
    open: 'Open language and theme preferences',
  },
  theme: {
    label: 'Theme',
    system: 'System theme',
    light: 'Light theme',
    dark: 'Dark theme',
  },
  language: {
    label: 'Language',
    ptBR: 'Português (Brasil)',
    ptBRShort: 'PT',
    enUS: 'English (US)',
    enUSShort: 'EN',
  },
  footer: {
    copyright: '© {{year}} Comunidade Viva.',
    rightsReserved: 'All rights reserved.',
    developedBy: 'Developed by',
    institution: 'IGREJA EVANGÉLICA VIVA E EFICAZ - CNPJ: 14.158.325/0001-01',
  },
  carousel: {
    roleDescription: 'carousel',
    slideRoleDescription: 'slide',
    slidePosition: '{{current}} of {{total}}',
    previous: 'Previous image',
    next: 'Next image',
    goTo: 'Go to image {{number}}',
  },
  loading: 'Loading',
  pwa: {
    title: 'New version available',
    description: 'A new version of Comunidade Viva is available.',
    update: 'Update',
  },
  routeError: {
    title: 'This page could not be loaded',
    description: 'An unexpected error occurred. Please try again.',
    retry: 'Try again',
    goHome: 'Back to the start',
  },
  statusPage: {
    goBack: 'Go back',
    goHome: 'Go to the home page',
    notFound: {
      eyebrow: 'Error 404',
      title: 'Page not found',
      description:
        'The address you tried to access does not exist or has changed. You can go back to where you were or go to the home page.',
    },
    underConstruction: {
      title: 'Page under construction',
      description:
        'This page is still being prepared and will be available soon. In the meantime, you can go back to where you were or go to the home page.',
    },
  },
} as const satisfies Translations['common'];
