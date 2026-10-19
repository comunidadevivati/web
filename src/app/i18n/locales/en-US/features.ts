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
      description: 'Your password was reset successfully.',
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
      weakPassword: {
        title: 'Password not accepted',
        description: 'The new password does not meet the security requirements.',
      },
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
  verifyEmail: {
    tagline: 'Confirm your email to enjoy everything the community has prepared for you.',
    title: 'Email verification',
    verifying: 'Verifying your email…',
    goToApp: 'Go to the app',
    success: {
      title: 'Email verified',
      description: 'Your email was verified successfully.',
    },
    notices: {
      invalidLink: {
        title: 'Invalid or expired link',
        description:
          'Sign in and use "Resend verification email" in the account menu to receive a new link.',
      },
      unavailable: {
        title: 'Verification is currently unavailable',
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
  unverified: {
    title: 'Account not verified',
    description:
      'Confirm your email using the link we sent to unlock the app information. Did not get it? Use "Resend verification email" in the account menu.',
  },
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

export const organization = {
  status: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DRAFT: 'Draft',
  },
  actions: {
    edit: 'Edit',
    activate: 'Activate',
    deactivate: 'Deactivate',
    retry: 'Try again',
  },
  fields: {
    legalName: 'Legal name',
    tradeName: 'Trade name',
    name: 'Name',
    code: 'Institutional code',
    codeHint: 'Letters, numbers and hyphens (e.g. CG-NORTE). It cannot be changed later.',
    cnpj: 'CNPJ',
    phone: 'Phone',
    email: 'Email',
    optional: '{{label}} (optional)',
    street: 'Street',
    number: 'Number',
    complement: 'Complement',
    district: 'District',
    city: 'City',
    state: 'State',
    postalCode: 'ZIP code (CEP)',
    cnpjPlaceholder: '00.000.000/0000-00',
    phonePlaceholder: '(67) 99999-9999',
    emailPlaceholder: 'contact@example.com',
    postalCodePlaceholder: '00000-000',
    statePlaceholder: 'MS',
  },
  details: {
    contact: 'Contact',
    address: 'Address',
    region: '{{city}}/{{state}} · ZIP {{postalCode}}',
    notInformed: 'Not provided',
  },
  validation: {
    required: 'Fill in this field.',
    tooLong: 'The text is longer than allowed.',
    invalid: 'Value rejected by the server. Check it and try again.',
    cnpjInvalid: 'Enter a valid CNPJ.',
    postalCodeInvalid: 'Enter an 8-digit ZIP code (CEP).',
    stateInvalid: 'Enter a Brazilian state abbreviation (e.g. MS).',
    emailInvalid: 'Enter a valid email.',
    codeInvalid: 'Use 2 to 20 letters, numbers or hyphens, with no hyphen at the ends.',
    phoneIncomplete: 'Enter the full phone number with area code.',
    phoneInvalidAreaCode: 'Enter a valid area code.',
    phoneInvalidNumber: 'Enter a valid phone number.',
  },
  notices: {
    invalidData: {
      title: 'Data rejected',
      description: 'Check the highlighted fields and try again.',
    },
    conflict: {
      title: 'Could not complete',
      description: 'The data was changed by another operation. Reload and try again.',
    },
    notFound: {
      title: 'Record not found',
      description: 'The record may have been removed. Refresh the page.',
    },
    accessDenied: {
      title: 'Access not granted',
      description: 'Confirm your email to access the organization data.',
    },
    unavailable: {
      title: 'Service unavailable',
      description: 'Could not connect to the service. Try again in a moment.',
    },
  },
  statusDialog: {
    activateTitle: 'Activate {{name}}?',
    deactivateTitle: 'Deactivate {{name}}?',
    organizationActivate:
      'The organization will allow congregations to be registered and activated again.',
    organizationDeactivate:
      'While the organization is inactive, no congregation can be registered or activated.',
    congregationActivate: 'The congregation will operate normally.',
    congregationDeactivate: 'The congregation will stop operating until it is reactivated.',
    cancel: 'Cancel',
    confirming: 'Saving…',
    success: {
      activate: 'Activated',
      deactivate: 'Deactivated',
      description: '{{name}} is now "{{status}}".',
    },
  },
  organizationPage: {
    title: 'Organization',
    subtitle: 'Institutional data of Igreja Evangélica Viva e Eficaz (headquarters organization).',
    edit: 'Edit data',
  },
  organizationForm: {
    title: 'Edit organization',
    description: 'Update the institutional data of the organization.',
    close: 'Close',
    submit: 'Save',
    submitting: 'Saving…',
    success: {
      title: 'Organization updated',
      description: 'The organization data was saved.',
    },
  },
  congregationsPage: {
    title: 'Congregations',
    subtitle: 'Local churches linked to the organization.',
    create: 'New congregation',
    filterLabel: 'Filter by status',
    filters: {
      ALL: 'All',
      ACTIVE: 'Active',
      DRAFT: 'Drafts',
      INACTIVE: 'Inactive',
    },
    headquarters: 'Main church',
    empty: 'No congregations found.',
    loadMore: 'Load more',
    loadingMore: 'Loading…',
    editLabel: 'Edit {{name}}',
    activateLabel: 'Activate {{name}}',
    deactivateLabel: 'Deactivate {{name}}',
  },
  congregationForm: {
    createTitle: 'New congregation',
    createDescription: 'The congregation is registered as a draft and can be activated next.',
    editTitle: 'Edit congregation',
    editDescription: 'Update the data of {{name}}.',
    close: 'Close',
    submit: 'Save',
    submitting: 'Saving…',
    success: {
      createTitle: 'Congregation registered',
      createDescription: '{{name}} was registered as a draft.',
      editTitle: 'Congregation updated',
      editDescription: 'The data of {{name}} was saved.',
    },
  },
} as const satisfies Translations['organization'];

export const users = {
  status: {
    ACTIVE: 'Active',
    SUSPENDED: 'Suspended',
    suspendedAt: 'Suspended on {{dateTime}}',
  },
  verification: {
    verified: 'Verified',
    unverified: 'Not verified',
  },
  actions: {
    suspend: 'Suspend',
    reactivate: 'Reactivate',
    delete: 'Delete',
    retry: 'Try again',
  },
  notices: {
    invalidData: {
      title: 'Data rejected',
      description: 'Check the fields and try again.',
    },
    emailTaken: {
      title: 'Email already registered',
      description: 'An account with this email already exists.',
    },
    conflict: {
      title: 'Could not complete',
      description: 'This operation is not allowed for this account.',
    },
    notFound: {
      title: 'User not found',
      description: 'The account may have been deleted. Refresh the list.',
    },
    accessDenied: {
      title: 'Access not granted',
      description: 'Confirm your email to manage users.',
    },
    unavailable: {
      title: 'Service unavailable',
      description: 'Could not connect to the service. Try again in a moment.',
    },
  },
  listPage: {
    title: 'Users',
    subtitle: 'Access accounts registered on the platform.',
    create: 'New user',
    searchLabel: 'Search by name or email',
    searchPlaceholder: 'Type part of the name or email',
    search: 'Search',
    filtersLabel: 'Filter accounts',
    removeFilter: 'Remove the {{filter}} filter',
    filters: {
      ALL: 'All',
      ACTIVE: 'Active',
      SUSPENDED: 'Suspended',
      VERIFIED: 'Verified',
      UNVERIFIED: 'Not verified',
    },
    columns: {
      user: 'User',
      phone: 'Phone',
      verification: 'Email',
      status: 'Status',
      createdAt: 'Created',
      actions: 'Actions',
    },
    you: 'You',
    notInformed: 'Not provided',
    createdAt: 'Created: {{date}}',
    dateTime: '{{date}} at {{time}}',
    empty: 'No users found.',
    loadMore: 'Load more',
    loadingMore: 'Loading…',
    actionLabels: {
      edit: 'Edit {{name}}',
      suspend: 'Suspend {{name}}',
      reactivate: 'Reactivate {{name}}',
      delete: 'Delete {{name}}',
    },
  },
  createForm: {
    title: 'New user',
    description:
      'The same data as the sign-up on the login screen. The person receives a link to confirm the email.',
    close: 'Close',
    submit: 'Create',
    submitting: 'Creating…',
    success: {
      title: 'User created',
      description: 'We sent the verification link to {{email}}.',
    },
  },
  editForm: {
    title: 'Edit user',
    description: 'Update the data of {{name}}. The password is changed through password recovery.',
    emailAlertTitle: 'The email will need to be verified again',
    emailHint:
      'When you save, the account becomes unverified and a new link is sent to the new address.',
    close: 'Close',
    submit: 'Save',
    submitting: 'Saving…',
    success: {
      title: 'User updated',
      description: 'The data of {{name}} was saved.',
      emailChanged: 'We sent a new verification link to {{email}}.',
    },
  },
  confirm: {
    cancel: 'Cancel',
    confirming: 'Saving…',
    suspend: {
      title: 'Suspend {{name}}?',
      description:
        'The person can no longer sign in and open sessions are ended. The account can be reactivated later.',
    },
    reactivate: {
      title: 'Reactivate {{name}}?',
      description: 'The person can sign in with email and password again.',
    },
    delete: {
      title: 'Delete {{name}} permanently?',
      description:
        'The account never confirmed its email and will be deleted with no way to recover it.',
    },
    success: {
      suspend: 'User suspended',
      reactivate: 'User reactivated',
      delete: 'User deleted',
      description: 'Operation completed for {{name}}.',
    },
  },
} as const satisfies Translations['users'];
