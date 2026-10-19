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
    resetPassword: 'Reset password',
    verifyEmail: 'Verify email',
    dashboard: 'Dashboard',
    guestWifi: 'Guest Wi-Fi',
    organization: 'Organization',
    congregations: 'Congregations',
  },
  navigation: {
    home: 'Home',
    history: 'History',
    events: 'Events',
    contact: 'Contact',
    dashboard: 'Dashboard',
    organization: 'Organization',
    congregations: 'Congregations',
    login: 'Sign in',
    logout: 'Sign out',
    emailNotVerified: 'Not verified',
    resendVerification: 'Resend verification email',
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
  emailVerification: {
    resendDialog: {
      title: 'Resend verification email',
      description: 'The verification email will be sent to {{email}} for the user {{name}}.',
      submit: 'Send',
      submitting: 'Sending…',
      cancel: 'Cancel',
    },
    resendSuccess: {
      title: 'Email sent',
      description: 'We sent a new verification link to your email.',
    },
    resendErrors: {
      alreadyVerified: {
        title: 'Email already verified',
        description: 'This email has already been verified.',
      },
      tooManyAttempts: {
        title: 'Please wait',
        description: 'Please wait a moment before requesting a new email.',
      },
      unavailable: {
        title: 'Could not send',
        description: 'We could not send the verification email. Please try again shortly.',
      },
    },
  },
  session: {
    logoutFailed: {
      title: 'Could not sign out',
      description: 'Your session is still active. Check your connection and try signing out again.',
    },
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
  processing: 'Processing, please wait',
  toast: {
    close: 'Close notification',
    secondsLeft: '{{seconds}}s',
  },
  password: {
    show: 'Show password',
    hide: 'Hide password',
  },
  passwordStrength: {
    label: 'Password strength',
    summary: 'Password strength: {{level}}',
    levels: {
      empty: 'not entered',
      weak: 'weak',
      medium: 'medium',
      strong: 'strong',
    },
    requirementsLabel: 'Password requirements',
    requirements: {
      minLength: 'At least 8 characters',
      lowercase: 'One lowercase letter',
      uppercase: 'One uppercase letter',
      number: 'One number',
      symbol: 'One symbol (e.g. ! @ # $)',
    },
    met: 'met',
    notMet: 'pending',
  },
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
