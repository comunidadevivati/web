import type { Translations } from '@/app/i18n/i18n.model';

export const auth = {
  login: {
    tagline: 'A place built to connect people, ministries and purposes.',
    title: 'Welcome',
    subtitle: 'Sign in with your email and password to access your account.',
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    password: 'Password',
    submit: 'Sign in',
    submitting: 'Signing in…',
    success: {
      title: 'Signed in',
      description: 'Welcome back to Comunidade Viva.',
    },
    forgotPassword: 'Forgot my password',
    noAccount: "Don't have an account?",
    createAccount: 'Create account',
    validation: {
      emailRequired: 'Enter your email.',
      emailInvalid: 'Enter a valid email.',
      passwordRequired: 'Enter your password.',
    },
    notices: {
      expired: {
        title: 'Your session has expired',
        description: 'For your security, please sign in again to continue.',
      },
      invalidCredentials: {
        title: 'Incorrect email or password',
        description: 'Check the information you entered and try again.',
      },
      tooManyAttempts: {
        title: 'Too many sign-in attempts',
        description: 'Please wait a moment before trying again.',
      },
      unavailable: {
        title: 'Sign-in is currently unavailable',
        description: 'We could not reach the authentication service. Please try again shortly.',
      },
    },
  },
  forgotPassword: {
    title: 'Reset password',
    description: 'Enter your account email to receive a link to change your password.',
    close: 'Close',
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    submit: 'Send',
    submitting: 'Sending…',
    success: {
      title: 'Request sent',
      description:
        'If an account is linked to {{email}}, the link will arrive in a few minutes. Please also check your spam folder.',
    },
    validation: {
      emailRequired: 'Enter your email.',
      emailTooLong: 'The email must be at most 254 characters.',
      emailInvalid: 'Enter a valid email.',
    },
    notices: {
      tooManyAttempts: {
        title: 'Too many requests',
        description: 'Please wait a moment before trying again.',
      },
      unavailable: {
        title: 'Sending is currently unavailable',
        description: 'We could not reach the service. Please try again shortly.',
      },
    },
  },
  resetPassword: {
    tagline: 'Keep your account protected and stay connected to our community.',
    title: 'Create a new password',
    description: 'Choose a secure password that is different from the previous one.',
    password: 'New password',
    confirmPassword: 'Confirm new password',
    submit: 'Reset password',
    submitting: 'Resetting…',
    submitHint: 'Fill in both fields correctly to reset your password.',
    backToLogin: 'Back to sign in',
    success: {
      title: 'Password reset',
      description: 'Your password has been reset. Sign in again to continue.',
    },
    validation: {
      passwordRequired: 'Create a new password.',
      passwordTooShort: 'Your password must be at least 8 characters.',
      passwordTooLong: 'Your password must be at most 64 characters.',
      passwordEdgeWhitespace: 'Your password cannot start or end with a space.',
      passwordWeak:
        'Weak password. Mix uppercase and lowercase letters, numbers and symbols, without obvious sequences.',
      confirmPasswordRequired: 'Confirm your new password.',
      passwordMismatch: 'Passwords do not match.',
    },
    notices: {
      invalidLink: {
        title: 'Invalid or expired link',
        description: 'Request a new link from the sign-in page to reset your password.',
      },
      tooManyAttempts: {
        title: 'Too many attempts',
        description: 'Please wait a moment before trying again.',
      },
      unavailable: {
        title: 'Password reset is currently unavailable',
        description: 'We could not reach the service. Please try again shortly.',
      },
    },
  },
  register: {
    title: 'Create account',
    description: 'Fill in your details to sign up for Comunidade Viva. All fields are required.',
    close: 'Close',
    submit: 'Create account',
    submitting: 'Creating account…',
    success: {
      title: 'Account created',
      description: 'Welcome to Comunidade Viva.',
    },
    submitHint: 'Fill in all fields correctly to create your account.',
    fullName: 'Full name',
    fullNamePlaceholder: 'e.g. Maria da Silva',
    phone: 'Phone with area code',
    phonePlaceholder: '(67) 99999-9999',
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    password: 'Password',
    confirmPassword: 'Confirm password',
    validation: {
      fullNameRequired: 'Enter your full name.',
      fullNameTooLong: 'Your name must be at most 120 characters.',
      fullNameInvalidCharacters: 'Use only letters, spaces, apostrophes, periods and hyphens.',
      fullNameIncomplete: 'Enter your first and last name.',
      phoneRequired: 'Enter your phone number with area code.',
      phoneIncomplete: 'Incomplete phone number. Enter the area code and number.',
      phoneInvalidAreaCode: 'Invalid area code.',
      phoneInvalidNumber: 'Invalid number. Mobile numbers have 9 digits and start with 9.',
      emailRequired: 'Enter your email.',
      emailTooLong: 'Your email must be at most 254 characters.',
      emailInvalid: 'Enter a valid email.',
      emailTaken: 'An account with this email already exists.',
      passwordRequired: 'Create a password.',
      passwordTooShort: 'Your password must be at least 8 characters.',
      passwordTooLong: 'Your password must be at most 64 characters.',
      passwordEdgeWhitespace: 'Your password cannot start or end with a space.',
      passwordWeak:
        'Weak password. Mix uppercase and lowercase letters, numbers and symbols, without personal data or obvious sequences.',
      confirmPasswordRequired: 'Confirm your password.',
      passwordMismatch: 'Passwords do not match.',
    },
    notices: {
      invalidData: {
        title: 'We could not complete your sign-up',
        description: 'Some details were rejected. Check your information and try again.',
      },
      tooManyAttempts: {
        title: 'Too many sign-up attempts',
        description: 'Please wait a moment before trying again.',
      },
      unavailable: {
        title: 'Sign-up is currently unavailable',
        description: 'We could not reach the service. Please try again shortly.',
      },
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
  states: {
    error: {
      title: 'Could not load the dashboard',
      description: 'Check your connection and try again.',
      retry: 'Try again',
    },
  },
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
    empty: 'No upcoming events.',
  },
  recentActivities: {
    title: 'Recent activity',
    description: 'Latest recorded changes',
    empty: 'No recent activity.',
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
