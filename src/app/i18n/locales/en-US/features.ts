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

export const members = {
  status: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    ARCHIVED: 'Archived',
  },
  membershipStatus: {
    PENDING: 'Pending',
    ACTIVE: 'Active',
    INACTIVE: 'Ended',
  },
  actions: {
    activate: 'Activate',
    deactivate: 'Deactivate',
    archive: 'Archive',
    restore: 'Restore',
    end: 'End',
    retry: 'Try again',
  },
  fields: {
    fullName: 'Full name',
    birthDate: 'Date of birth',
    phone: 'Phone',
    email: 'Email',
    congregation: 'Congregation',
    congregationPlaceholder: 'Select the congregation',
    primary: 'Primary membership',
    primaryHint: "The member's reference congregation. Only one primary membership can be active.",
  },
  validation: {
    congregationRequired: 'Select the congregation.',
    invalid: 'Value rejected by the server. Check it and try again.',
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
      description: 'The record may have been removed. Go back to the member list.',
    },
    accessDenied: {
      title: 'Access not granted',
      description: 'Confirm your email to access member data.',
    },
    unavailable: {
      title: 'Service unavailable',
      description: 'Could not connect to the service. Try again in a moment.',
    },
  },
  listPage: {
    title: 'Members',
    subtitle: 'People in the community and their congregation memberships.',
    create: 'Create member',
    searchLabel: 'Search by name',
    searchPlaceholder: 'Type part of the name',
    search: 'Search',
    statusFilterLabel: 'Filter by status',
    filters: {
      ALL: 'All',
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
      ARCHIVED: 'Archived',
    },
    congregationLabel: 'Congregation',
    allCongregations: 'All congregations',
    empty: 'No members found.',
    loadMore: 'Load more',
    loadingMore: 'Loading…',
    birthDate: 'Born: {{date}}',
  },
  detailPage: {
    back: 'Back to members',
    profile: 'Personal data',
    notInformed: 'Not provided',
    memberships: 'Congregation memberships',
    membershipsDescription: 'Full history, including ended memberships.',
    addMembership: 'New membership',
    membershipsEmpty: 'No memberships registered.',
    primary: 'Primary',
    startedOn: 'Started: {{date}}',
    endedOn: 'Ended: {{date}}',
    removedCongregation: 'Congregation not found',
    inactiveHint: 'Only active members can receive new memberships.',
  },
  memberCreate: {
    title: 'Create member',
    description:
      'Users with a verified account who are not members yet. Linking turns the account into a Person (with the account data) and the Person into a member; congregation memberships are added later, on the member page.',
    close: 'Close',
    selected_one: '{{count}} user selected',
    selected_other: '{{count}} users selected',
    linkAll: 'Link all',
    linking: 'Linking…',
    link: 'Link',
    linkUser: 'Link {{name}} as a member',
    selectAll: 'Select all users in the list',
    select: 'Select {{name}}',
    empty: 'No verified users waiting to become members.',
    columns: {
      user: 'User',
      phone: 'Phone',
      action: 'Action',
    },
    success: {
      title_one: 'Member created',
      title_other: 'Members created',
      description_one: '{{name}} is now a member.',
      description_other: '{{count}} users are now members.',
    },
    failure: {
      title: 'No member created',
      not_found: "{{name}}'s account was not found. It may have been deleted.",
      unverified: "{{name}}'s account does not have a verified email.",
      rejected:
        "{{name}}'s account data was rejected by the member registry. Fix the name or phone in Users.",
      unavailable: 'Could not convert {{name}} right now. Try again in a moment.',
    },
    partial: {
      title: 'Partial conversion',
      description_one:
        '{{created}} of {{count}} user became a member. Check the ones still listed.',
      description_other:
        '{{created}} of {{count}} users became members. Check the ones still listed.',
    },
  },
  membershipForm: {
    title: 'New membership',
    description: 'The membership of {{name}} is registered as pending and can be activated next.',
    close: 'Close',
    submit: 'Register membership',
    submitting: 'Registering…',
    noCongregations: 'There is no active congregation available.',
    success: {
      title: 'Membership registered',
      description: 'Membership with {{congregation}} registered as pending.',
    },
  },
  confirm: {
    cancel: 'Cancel',
    confirming: 'Saving…',
    member: {
      activate: {
        title: 'Activate {{name}}?',
        description: 'The member takes part normally again and can receive new memberships.',
      },
      deactivate: {
        title: 'Deactivate {{name}}?',
        description: 'The member stops taking part. End active or pending memberships first.',
      },
      archive: {
        title: 'Archive {{name}}?',
        description:
          'The member leaves the day-to-day lists and becomes read-only. History is preserved.',
      },
      restore: {
        title: 'Restore {{name}}?',
        description: 'The member returns as inactive and can be edited and reactivated.',
      },
    },
    membership: {
      activate: {
        title: 'Activate the membership with {{congregation}}?',
        description: "Today's date is recorded as the start of the membership.",
      },
      deactivate: {
        title: 'End the membership with {{congregation}}?',
        description: "Today's date is recorded as the end. An ended membership cannot be reopened.",
      },
    },
    success: {
      member: {
        activate: 'Member activated',
        deactivate: 'Member deactivated',
        archive: 'Member archived',
        restore: 'Member restored',
      },
      membership: {
        activate: 'Membership activated',
        deactivate: 'Membership ended',
      },
    },
  },
} as const satisfies Translations['members'];

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

export const gallery = {
  status: {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    ARCHIVED: 'Archived',
  },
  photoStatus: {
    PROCESSING: 'Processing',
    READY: 'Ready',
    FAILED: 'Failed',
  },
  photoFailure: {
    invalid_image: 'The file is not a valid image.',
    processing_error: 'The photo could not be processed. Delete it and upload it again.',
  },
  actions: {
    edit: 'Edit',
    retry: 'Try again',
    addPhotos: 'Add photos',
    delete: 'Delete photo',
  },
  fields: {
    title: 'Title',
    titlePlaceholder: 'E.g. Sunday Service',
    occurredOn: 'Service or event date',
    description: 'Description (optional)',
    descriptionPlaceholder: 'A summary of the service or event.',
  },
  validation: {
    titleRequired: 'Enter the title.',
    titleInvalid: 'Use up to 120 characters.',
    occurredOnInvalid: 'Enter a valid date from 2000 to today.',
    descriptionInvalid: 'Use up to 2000 characters.',
    invalid: 'Value rejected by the server. Check it and try again.',
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
      title: 'Album not found',
      description: 'The album may have been removed. Go back to the album list.',
    },
    accessDenied: {
      title: 'Access not granted',
      description: 'Confirm your email to manage the gallery.',
    },
    unavailable: {
      title: 'Service unavailable',
      description: 'Could not connect to the service. Try again in a moment.',
    },
  },
  listPage: {
    title: 'Albums',
    subtitle: 'Photos from services and events. Uploaded photos stay private until published.',
    create: 'New album',
    empty: 'No albums yet.',
    loadMore: 'Load more',
    loadingMore: 'Loading…',
    photoCount_one: '{{count}} photo',
    photoCount_other: '{{count}} photos',
  },
  detailPage: {
    back: 'Back to albums',
    photos: 'Photos',
    photosDescription: 'Only published photos will appear in the Photos section of the website.',
    empty: 'No photos uploaded yet.',
    hint: 'JPEG, PNG or WebP, up to 25 MB each. Photos are optimized and lose their location (GPS).',
    publicAddress: 'Website address: /fotos/{{slug}}',
    photoAlt: 'Photo {{position}} of the album {{title}}',
  },
  publication: {
    summary: 'Published on the site: {{published}} of {{total}}',
    photo: {
      badge: 'Published',
      publish: 'Publish',
      unpublish: 'Unpublish',
      publishFor: 'Publish on the site: {{alt}}',
      unpublishFor: 'Remove from the site: {{alt}}',
      published: 'Photo published on the site',
      unpublished: 'Photo removed from the site',
    },
    cover: {
      badge: 'Cover',
      set: 'Use as cover',
      setFor: 'Use as album cover: {{alt}}',
      success: 'Album cover updated',
    },
    publishAll: {
      label_one: 'Publish {{count}} photo',
      label_other: 'Publish {{count}} photos',
      progress_one: 'Publishing… {{count}} photo',
      progress_other: 'Publishing… {{count}} photos',
      success_one: '{{count}} photo published',
      success_other: '{{count}} photos published',
    },
    status: {
      publish: {
        label: 'Publish album',
        hint: 'Publish at least one photo to publish the album.',
        success: 'Album published on the site',
      },
      unpublish: {
        label: 'Unpublish album',
        success: 'Album removed from the site. The photos stay published.',
      },
      archive: {
        label: 'Archive',
        success: 'Album archived',
      },
      restore: {
        label: 'Restore',
        success: 'Album restored as a draft',
      },
    },
  },
  uploads: {
    title: 'Uploads',
    clear: 'Clear finished',
    retry: 'Try again',
    retryFile: 'Try uploading {{name}} again',
    stage: {
      waiting: 'Queued',
      sending: 'Uploading {{percent}}%',
      confirming: 'Confirming…',
      done: 'Uploaded. Processing on the server…',
      failed: 'Failed',
    },
    failure: {
      invalidType: 'Format not accepted. Use JPEG, PNG or WebP.',
      tooLarge: 'File larger than 25 MB.',
      rejected: 'Upload rejected by the server.',
      transfer: 'The file could not be uploaded. Check the connection and try again.',
      unavailable: 'Service unavailable. Try again in a moment.',
    },
    success: {
      title_one: 'Photo uploaded',
      title_other: 'Photos uploaded',
      description_one: 'The photo is being optimized and shows up in the album shortly.',
      description_other: '{{count}} photos are being optimized and show up in the album shortly.',
    },
    partial: {
      title: 'Some uploads failed',
      description_one: '{{failed}} of {{count}} file was not uploaded. Check the upload list.',
      description_other: '{{failed}} of {{count}} files were not uploaded. Check the upload list.',
    },
  },
  albumForm: {
    createTitle: 'New album',
    createDescription: 'The album starts as a draft and does not appear on the website.',
    editTitle: 'Edit album',
    editDescription: 'Update the data of {{title}}. The website address does not change.',
    close: 'Close',
    submit: 'Save',
    submitting: 'Saving…',
    success: {
      createTitle: 'Album created',
      createDescription: 'Now add the photos of {{title}}.',
      editTitle: 'Album updated',
      editDescription: 'The data of {{title}} was saved.',
    },
  },
  confirmDelete: {
    title: 'Delete this photo?',
    description:
      'The uploaded file and the optimized versions are permanently deleted. This cannot be undone.',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Delete',
    confirming: 'Deleting…',
    success: 'Photo deleted',
  },
} as const satisfies Translations['gallery'];

export const photos = {
  eyebrow: 'Gallery',
  title: 'Photos',
  description: 'Moments from the services and events of Comunidade Viva e Eficaz.',
  empty: 'No albums published yet.',
  loadMore: 'Load more',
  loadingMore: 'Loading…',
  retry: 'Try again',
  back: 'Back to albums',
  photoCount_one: '{{count}} photo',
  photoCount_other: '{{count}} photos',
  photoAlt: 'Photo {{position}} of the album {{title}}',
  openPhoto: 'Open photo {{position}}',
  lightbox: {
    close: 'Close',
    previous: 'Previous photo',
    next: 'Next photo',
    position: '{{position}} of {{total}}',
  },
  notices: {
    notFound: {
      title: 'Album not found',
      description: 'The album may have been removed or is not published yet.',
    },
    unavailable: {
      title: 'Photos unavailable',
      description: 'The photos could not be loaded. Try again in a moment.',
    },
  },
};

export const profile = {
  page: {
    title: 'My profile',
    subtitle: 'Your personal data, address, social networks and account settings.',
  },
  avatar: {
    alt: 'Photo of {{name}}',
    change: 'Change photo',
    add: 'Add photo',
    remove: 'Remove photo',
    uploading: 'Uploading…',
    hint: 'JPEG, PNG or WebP up to 10 MB. The photo is cropped to a square.',
  },
  sections: {
    personal: {
      title: 'Personal data',
      description: 'How you appear to the community and how we can reach you.',
    },
    address: {
      title: 'Address',
      description: 'Optional. If you fill it in, provide the full address.',
    },
    social: {
      title: 'Social networks',
      description: 'Links to your profiles. All of them are optional.',
    },
    security: {
      title: 'Security',
      description: 'Password and sign-in email. Both changes require your current password.',
    },
    subscriptions: {
      title: 'Subscriptions',
      description: 'Choose what you want to receive from the community.',
    },
  },
  fields: {
    optional: '{{label}} (optional)',
    fullName: 'Full name',
    sex: 'Sex',
    sexes: {
      none: 'Not informed',
      MALE: 'Male',
      FEMALE: 'Female',
    },
    birthDate: 'Date of birth',
    phone: 'Phone 1',
    secondaryPhone: 'Phone 2',
    email: 'Primary email',
    emailHint: 'This is your sign-in email, already verified. To change it, use Security.',
    secondaryEmail: 'Secondary email',
    secondaryEmailHint: 'It does not need to be verified.',
    postalCode: 'Postal code',
    postalCodePlaceholder: '00000-000',
    street: 'Street',
    number: 'Number',
    complement: 'Complement',
    district: 'District',
    city: 'City',
    state: 'State',
    statePlaceholder: 'State',
    country: 'Country',
    reference: 'Reference point',
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    twitter: 'X (Twitter)',
    youtube: 'YouTube',
    socialPlaceholders: {
      instagram: 'https://instagram.com/your-username',
      facebook: 'https://facebook.com/your-username',
      linkedin: 'https://linkedin.com/in/your-username',
      twitter: 'https://x.com/your-username',
      youtube: 'https://youtube.com/@your-channel',
    },
  },
  actions: {
    save: 'Save changes',
    saving: 'Saving…',
    discard: 'Discard changes',
    retry: 'Try again',
  },
  success: {
    saved: {
      title: 'Profile updated',
      description: 'Your data has been saved.',
    },
    avatarSaved: {
      title: 'Photo updated',
      description: 'The new photo is already on your profile.',
    },
    avatarRemoved: {
      title: 'Photo removed',
      description: 'Your profile shows your initials again.',
    },
    subscriptions: {
      title: 'Subscriptions updated',
      on: 'You will receive the community news by email.',
      off: 'You will no longer receive the community news by email.',
    },
  },
  notices: {
    invalidData: {
      title: 'Check the data',
      description: 'Some fields were rejected. Fix the highlighted fields and save again.',
    },
    conflict: {
      title: 'Profile changed elsewhere',
      description: 'We reloaded the latest data. Review it and save again.',
    },
    accessDenied: {
      title: 'Profile unavailable',
      description: 'Only members have a profile.',
    },
    unavailable: {
      title: 'Profile unavailable right now',
      description: 'The service could not be reached. Try again in a moment.',
    },
    avatarType: {
      title: 'Format not accepted',
      description: 'Choose a JPEG, PNG or WebP photo.',
    },
    avatarSize: {
      title: 'Photo too large',
      description: 'Choose a photo up to 10 MB.',
    },
    avatarTransfer: {
      title: 'The photo could not be uploaded',
      description: 'The upload was interrupted. Check your connection and try again.',
    },
  },
  security: {
    accessEmail: 'Sign-in email',
    password: 'Password',
    passwordHint: 'Changing the password signs out the other open sessions of your account.',
    changePassword: 'Change password',
    changeEmail: 'Change email',
  },
  changePassword: {
    title: 'Change password',
    description: 'Enter your current password and choose a new, secure one.',
    close: 'Close',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    submit: 'Change password',
    submitting: 'Changing…',
    cancel: 'Cancel',
    success: {
      title: 'Password changed',
      description: 'The other sessions of your account have been signed out.',
    },
  },
  changeEmail: {
    title: 'Change sign-in email',
    description:
      'We will send a confirmation link to the new email. The current email stays valid until you open the link.',
    close: 'Close',
    newEmail: 'New email',
    newEmailPlaceholder: 'name@example.com',
    currentPassword: 'Current password',
    submit: 'Send link',
    submitting: 'Sending…',
    cancel: 'Cancel',
    success: {
      title: 'Confirm the new email',
      description: 'We sent a link to {{email}}. Also check your spam folder.',
    },
  },
  securityNotices: {
    invalidPassword: {
      title: 'Wrong current password',
      description: 'Check your current password and try again.',
    },
    weakPassword: {
      title: 'Password not accepted',
      description:
        'The new password does not meet the security requirements or equals the current one.',
    },
    sameEmail: {
      title: 'Same email',
      description: 'This is already your sign-in email.',
    },
    emailTaken: {
      title: 'Email in use',
      description: 'An account with this email already exists.',
    },
    tooManyAttempts: {
      title: 'Too many requests',
      description: 'Wait a moment before trying again.',
    },
    invalidLink: {
      title: 'Invalid or expired link',
      description: 'Request the email change again from your profile.',
    },
    unavailable: {
      title: 'Service unavailable right now',
      description: 'The operation could not be completed. Try again in a moment.',
    },
  },
  subscriptions: {
    news: 'Receive community news by email',
    newsHint: 'Announcements, events and news, sent to your sign-in email.',
  },
  confirmEmailChange: {
    tagline: 'Your account protected so you stay connected to our community.',
    title: 'Confirm new email',
    confirming: 'Confirming your new email…',
    goToApp: 'Go to my profile',
    success: {
      title: 'Email changed',
      description: 'From now on, sign in with the new email.',
    },
  },
  validation: {
    required: 'Fill in this field.',
    tooLong: 'Text longer than allowed.',
    invalid: 'Invalid value.',
    fullNameInvalid: 'Use only letters, spaces, apostrophe, period and hyphen.',
    birthDateInvalid: 'Enter a date between 1900 and today.',
    emailInvalid: 'Enter a valid email.',
    postalCodeInvalid: 'Enter an 8-digit postal code.',
    stateInvalid: 'Enter a state abbreviation (e.g. MS).',
    socialLinkInvalid: 'Enter the link to your profile on this network.',
    phoneIncomplete: 'Enter the full phone number, with area code.',
    phoneInvalidAreaCode: 'Invalid area code.',
    phoneInvalidNumber: 'Invalid phone number.',
    passwordRequired: 'Enter the password.',
    passwordTooShort: 'The password must be at least 8 characters long.',
    passwordTooLong: 'The password must be at most 64 characters long.',
    passwordEdgeWhitespace: 'The password cannot start or end with a space.',
    passwordWeak: 'Weak password. Follow the requirements below.',
    passwordMismatch: 'The passwords do not match.',
    passwordSameAsCurrent: 'The new password must be different from the current one.',
  },
} as const satisfies Translations['profile'];

export const departments = {
  eyebrow: 'Departments',
  leadership: {
    title: 'Leadership',
    subtitle: 'Tools and follow-up for the Leadership department.',
    cards: {
      forms: {
        title: 'Forms',
        description: 'Surveys and evaluations sent by email.',
        details: '{{published}} published · {{draft}} unpublished',
        open: 'Open forms',
      },
    },
  },
} as const satisfies Translations['departments'];

export const forms = {
  report: {
    title: 'Report',
    toResponses: 'See answers per person',
    exportCsv: 'Export CSV (Excel)',
    openPdf: 'Open PDF',
    anonymous:
      'Results are consolidated: there is no way to know what each person answered. The CSV has no names or dates.',
    empty: 'There are no link answers to consolidate yet.',
    paperNote:
      'Paper answers count in participation, but their content is in the attachments and is not part of the results below.',
    summary: {
      invited: 'Invited',
      answered: 'Answered',
      digital: 'By link',
      paper: 'On paper',
      pending: 'Pending',
    },
    rating: {
      title: 'Overall rating',
      label: 'Overall rating {{value}} out of {{max}}',
    },
    answeredCount_one: '{{count}} answer',
    answeredCount_other: '{{count}} answers',
    barValue: '{{count}} · {{percent}}%',
    chartLabel: 'Results for question {{title}}',
    scaleAverage: 'average (out of {{max}})',
    stats: {
      average: 'Average',
      minimum: 'Minimum',
      maximum: 'Maximum',
    },
    searchLabel: 'Search the answers to question {{title}}',
    searchPlaceholder: 'Search answers',
    noMatches: 'No answers found.',
    purged: {
      title: 'Answers deleted',
      description:
        'The content of the answers was deleted on {{date}} (LGPD). Only participation numbers remain.',
    },
  },
  settings: {
    anonymous: 'Anonymous survey',
    anonymousHint:
      'The panel shows who answered, but never what each person answered: answers only appear in the consolidated report. Cannot be changed after the first answer.',
    allowAnswerEdit: 'Allow changing the answer',
    allowAnswerEditHint:
      'Whoever answered by link can change the answer until the end of the period.',
    allowAnswerEditAnonymous:
      'Unavailable in anonymous surveys (the answer is not linked to the person).',
    consent: 'Consent text (LGPD)',
    consentHint:
      'Optional. When filled, respondents must check "I have read and agree" before sending.',
    consentPlaceholder:
      'E.g.: I authorize the leadership to use my answers to plan the ministries.',
  },
  scale: {
    groupLabel: 'Scale settings for question {{number}}',
    min: 'Starts at',
    max: 'Ends at',
    minLabel: 'Start label (optional)',
    maxLabel: 'End label (optional)',
    minLabelPlaceholder: 'E.g.: Strongly disagree',
    maxLabelPlaceholder: 'E.g.: Strongly agree',
    namedPoints: 'Name each point',
    pointLabel: 'Name of {{value}}',
    preset: {
      apply: 'Use Terrible, Bad, Fair, Good, Excellent',
      terrible: 'Terrible',
      bad: 'Bad',
      fair: 'Fair',
      good: 'Good',
      excellent: 'Excellent',
    },
  },
  duplicate: {
    success: {
      title: 'Form duplicated',
      description: 'The copy "{{title}}" was created as unpublished.',
    },
  },
  templates: {
    label: 'Start from an existing form (template)',
    placeholder: 'Choose a form',
    hint: 'Creates an unpublished copy with the questions, settings and image. Invitations and answers are not copied.',
    use: 'Use as template',
    success: {
      title: 'Copy created',
      description: 'The form "{{title}}" was created from the template.',
    },
  },
  status: {
    DRAFT: 'Unpublished',
    PUBLISHED: 'Published',
    FINISHED: 'Finished',
    CANCELLED: 'Cancelled',
  },
  fieldTypes: {
    INPUT: 'Short text (input)',
    TEXTAREA: 'Long text (textarea)',
    CHECKBOX: 'Multiple choice (checkbox)',
    RADIO: 'Single choice (radio)',
    SELECT: 'Dropdown list (select)',
    SCALE: 'Scale (e.g.: 1 to 5)',
    DATE: 'Date',
    NUMBER: 'Number',
  },
  actions: {
    retry: 'Try again',
    edit: 'Edit',
    duplicate: 'Duplicate',
    report: 'Report',
    view: 'View',
    delete: 'Delete',
    preview: 'Preview form',
    previewNamed: 'Preview the form {{title}}',
    menu: 'More actions',
    menuNamed: 'Actions for the form {{title}}',
    responses: 'Answers',
  },
  statusActions: {
    publish: {
      label: 'Publish',
      title: 'Publish form',
      description:
        'The form "{{title}}" will be published. To notify people, use "Send group emails" afterwards.',
      confirm: 'Publish',
      success: {
        title: 'Form published',
        description: 'The form "{{title}}" was published.',
      },
    },
    unpublish: {
      label: 'Unpublish',
      title: 'Unpublish form',
      description:
        'The form "{{title}}" goes back to unpublished and stops receiving answers until it is published again.',
      confirm: 'Unpublish',
      success: {
        title: 'Form unpublished',
        description: 'The form "{{title}}" is unpublished again.',
      },
    },
    finish: {
      label: 'Finish',
      title: 'Finish form',
      description:
        'The form "{{title}}" will be finished: it will no longer receive answers or be editable. This cannot be undone.',
      confirm: 'Finish',
      success: {
        title: 'Form finished',
        description: 'The form "{{title}}" was finished.',
      },
    },
    cancel: {
      label: 'Cancel form',
      title: 'Cancel form',
      description:
        'The form "{{title}}" will be cancelled: it will no longer receive answers or be editable. This cannot be undone.',
      confirm: 'Cancel form',
      success: {
        title: 'Form cancelled',
        description: 'The form "{{title}}" was cancelled.',
      },
    },
    sendEmails: {
      label: 'Send group emails',
      title: 'Send group emails',
      description:
        'Each person in the groups of "{{title}}" will receive an email with a personal link to answer. The form is locked while sending.',
      confirm: 'Send emails',
      success: {
        title: 'Sending started',
        description: 'The emails for "{{title}}" are being sent.',
      },
    },
    remindPending: {
      label: 'Send reminder to pending',
      title: 'Reminder to pending',
      description:
        'Whoever has not answered "{{title}}" yet gets a reminder with a new link (the previous one stops working). The form is locked while sending.',
      confirm: 'Send reminder',
      success: {
        title: 'Reminder started',
        description: 'The reminders for "{{title}}" are being sent.',
      },
    },
    purgeAnswers: {
      label: 'Delete answers',
      title: 'Delete answers (LGPD)',
      description:
        'The content of the answers to "{{title}}" will be deleted: link answers, anonymous answers and paper answer attachments. Only who answered and through which channel stays recorded. This cannot be undone.',
      confirm: 'Delete answers',
      success: {
        title: 'Answers deleted',
        description: 'The content of the answers to "{{title}}" was deleted.',
      },
    },
    resendEmails: {
      label: 'Resend group emails',
      title: 'Resend group emails',
      description:
        'Whoever has not answered "{{title}}" yet gets a new link (the previous one stops working), and whoever joined the groups later gets their first one. Whoever already answered is not emailed again.',
      confirm: 'Resend emails',
      success: {
        title: 'Resending started',
        description: 'The emails for "{{title}}" are being sent.',
      },
    },
  },
  responses: {
    title: 'Answers',
    toReport: 'See consolidated report',
    anonymous: {
      title: 'Anonymous survey',
      description:
        'Only who answered is shown here. What each person answered is not linked to them and only appears in the consolidated report.',
    },
    summary: '{{answered}} of {{invited}} answered',
    empty: 'No invitations sent yet. Use "Send group emails" in the form menu.',
    menuNamed: 'Actions for {{name}}',
    sentAt: 'Invitation sent on {{date}}',
    answeredAt: 'Answered on {{date}}',
    delivery: {
      SENT: 'Email sent',
      DELAYED: 'Email delivery delayed',
      DELIVERED: 'Email delivered',
      OPENED: 'Email opened',
      CLICKED: 'Email link clicked',
      BOUNCED: 'Email bounced (invalid address)',
      COMPLAINED: 'Email marked as spam',
      FAILED: 'Email failed to send',
    },
    states: {
      PENDING: 'Pending',
      DIGITAL: 'Answered by link',
      PAPER: 'Answered on paper',
    },
    actions: {
      viewAnswers: 'View answers',
      markPaper: 'Mark as answered on paper',
      attach: 'Attach filled form',
      replaceAttachment: 'Replace attachment',
      openPdf: 'Open PDF',
      openImage: 'Open image',
      unmark: 'Undo paper answer',
    },
    answersDialog: {
      close: 'Close',
      description: '{{email}} · answered on {{date}}',
      noAnswer: 'No answer',
      print: 'Open PDF',
    },
    print: {
      blocked: {
        title: 'New tab blocked',
        description: 'Allow pop-up windows for this site and try again.',
      },
    },
    paper: {
      close: 'Close',
      title: 'Paper answer',
      description:
        'Record that {{name}} answered the printed version. Optionally, attach the scanned filled form.',
      attachTitle: 'Paper answer attachment',
      attachDescription: 'Attach the form filled by {{name}} (replaces the current attachment).',
      fileOptional: 'Filled form (optional)',
      fileRequired: 'Filled form',
      dropzone: {
        idle: 'PDF, JPG, JPEG or PNG, up to 2 MB.',
        hover: 'Click here to select the file',
        drag: 'Drop here to attach the file',
      },
      replaceHint: 'There is already an attachment. Choose another file to replace it.',
      selectedHint: 'To replace it, drop another file on it or click it.',
      issues: {
        type: 'Use a PDF, JPG, JPEG or PNG file.',
        size: 'The file is larger than 2 MB.',
      },
      cancel: 'Cancel',
      confirm: 'Save',
      confirming: 'Saving…',
      success: {
        title: 'Paper answer recorded',
        description: 'The answer from {{name}} was recorded.',
      },
    },
    unmark: {
      close: 'Close',
      title: 'Undo paper answer',
      description:
        'The paper answer from {{name}} is removed and the attachment is deleted. The invitation becomes pending again.',
      cancel: 'Cancel',
      confirm: 'Undo',
      confirming: 'Undoing…',
      success: {
        title: 'Paper answer undone',
        description: 'The invitation of {{name}} is pending again.',
      },
    },
  },
  emailDispatch: {
    sending: 'Sending group emails',
    menuLocked: 'Wait for the emails to finish sending',
    editorLocked: 'The form is locked until the emails to the groups finish sending.',
    sent: { title: 'Emails sent' },
    failed: { title: 'Emails failed to send' },
    result: '"{{title}}": {{sent}} sent, {{failed}} failed.',
  },
  answer: {
    fields: {
      name: 'Name',
      email: 'Email',
    },
    submit: 'Send answers',
    update: 'Update answers',
    requiredSr: '(required)',
    requiredLegend: '* Required question',
    selectPlaceholder: 'Select an option',
    sendCopy: 'Receive a PDF copy of the answers at {{email}}',
    draftRestored: 'We restored the draft you started in this browser.',
    consent: {
      label: 'I have read and agree',
    },
    anonymous: {
      title: 'Anonymous answers',
      description:
        'Your name is only used to record that you answered. The answers are not linked to you.',
    },
    submitting: 'Sending…',
    success: {
      title: 'Answers sent',
      description: 'Thank you! Your answers were recorded.',
      withCopy: 'Thank you! Your answers were recorded, and the PDF copy is on its way by email.',
    },
    answered: {
      title: 'Form answered',
      description: 'Your answers were recorded on {{date}}. See below what you answered.',
      paperDescription: 'Your answer on the printed version was recorded on {{date}}.',
      anonymousDescription:
        'Your anonymous answer was recorded on {{date}}. Because it is anonymous, it cannot be shown back.',
      editableDescription:
        'Your answers were recorded on {{date}}. You can change them below until the end of the period.',
    },
    availability: {
      NOT_STARTED: {
        title: 'Not open yet',
        description: 'This form accepts answers from {{period}}.',
      },
      ENDED: {
        title: 'Period ended',
        description: 'This form accepted answers from {{period}}.',
      },
      CLOSED: {
        title: 'Form closed',
        description: 'This form is not accepting answers.',
      },
      OPEN: {
        title: 'Form open',
        description: 'Answer by the end of the period ({{period}}).',
      },
    },
    validation: {
      tooLong: 'The answer is over the character limit.',
      empty: 'Answer at least one question before sending.',
      required: 'This question is required.',
      invalidNumber: 'Enter a valid number.',
      invalidDate: 'Enter a valid date.',
      consent: 'Check "I have read and agree" to send.',
    },
    notices: {
      invalidLink: {
        title: 'Invalid link',
        description:
          'This link does not exist or was replaced by a newer email. Use the link from the latest email you received.',
      },
      invalidAnswers: {
        title: 'Review your answers',
        description: 'Some answers have problems. Fix the highlighted items and send again.',
      },
      conflict: {
        title: 'Could not send',
        description: 'The form was already answered with this link or is no longer open.',
      },
      unavailable: {
        title: 'Service unavailable',
        description: 'Could not load the form. Please try again shortly.',
      },
    },
  },
  statusDialog: {
    message: 'Message in the email (optional)',
    messagePlaceholder: 'E.g.: We count on your participation by Friday!',
    messageHint: 'Shown in the email body, before the answer button.',
    close: 'Close',
    back: 'Back',
    confirming: 'Saving…',
  },
  notices: {
    invalidData: {
      title: 'Data rejected',
      description: 'Review the highlighted fields and try again.',
    },
    conflict: {
      title: 'Could not save',
      description: 'The form was changed or does not allow this action. Reload and try again.',
    },
    notFound: {
      title: 'Form not found',
      description: 'The form no longer exists or was deleted.',
    },
    accessDenied: {
      title: 'Access denied',
      description: 'Your account is not allowed to manage forms.',
    },
    unavailable: {
      title: 'Service unavailable',
      description: 'Could not reach the server. Please try again shortly.',
    },
  },
  list: {
    back: 'Back to Leadership',
    title: 'Forms',
    subtitle: 'Surveys, performance evaluations and other Leadership forms.',
    create: 'New form',
    statusFilter: 'Status',
    allStatuses: 'All statuses',
    empty: 'No forms created yet.',
    emptyFiltered: 'No forms with this status.',
    period: '{{start}} to {{end}}',
    questionCount_one: '{{count}} question',
    questionCount_other: '{{count}} questions',
    recipientGroupCount_one: '{{count}} email group',
    recipientGroupCount_other: '{{count}} email groups',
    emailSummary: 'Emails sent on {{date}} · {{answered}} of {{invited}} answered',
    answersPurged: 'Answers deleted on {{date}} (LGPD)',
    loadMore: 'Load more',
    loadingMore: 'Loading…',
  },
  deleteDialog: {
    close: 'Close',
    title: 'Delete form',
    description: 'The form "{{title}}" will be permanently deleted. This cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Delete',
    confirming: 'Deleting…',
    success: {
      title: 'Form deleted',
      description: 'The form "{{title}}" was deleted.',
    },
  },
  validation: {
    titleRequired: 'Enter the form name.',
    titleTooLong: 'Use at most 120 characters.',
    descriptionTooLong: 'Use at most 2,000 characters.',
    dateInvalid: 'Enter a valid date.',
    endsBeforeStart: 'The end date cannot be before the start date.',
    endsInPast: 'To publish, the end date cannot be in the past.',
    questionsRequired: 'Add at least one question.',
    questionsTooMany: 'Use at most 50 questions.',
    questionTitleRequired: 'Enter the question name.',
    questionTitleTooLong: 'Use at most 200 characters.',
    questionDescriptionTooLong: 'Use at most 500 characters.',
    recipientsRequired: 'To publish, select at least one email group.',
    optionRequired: 'Enter the option text.',
    optionTooLong: 'Use at most 100 characters.',
    optionsTooFew: 'Add at least 1 option.',
    optionsTooMany: 'Use at most 20 options.',
    optionsDuplicated: 'Options must be different from each other.',
    scaleInvalid: 'The scale starts at 0 or 1 and ends after the start, up to 10.',
    scaleLabelTooLong: 'Use at most 40 characters.',
    scalePointRequired: 'Give this point a name.',
    scalePointsDuplicated: 'Use a different name for each point.',
    consentTooLong: 'Use at most 1,000 characters.',
    anonymousEdit: 'Anonymous surveys do not allow changing the answer.',
    invalid: 'Value rejected by the server.',
  },
  editor: {
    back: 'Back to Forms',
    createTitle: 'New form',
    createSubtitle: 'Build the form, choose who receives it and publish when it is ready.',
    editTitle: 'Edit form',
    preview: 'Preview',
    readOnly: {
      title: 'Read-only',
      description: 'Forms with status "{{status}}" can no longer be changed.',
    },
    sections: {
      general: {
        title: 'General information',
        description: 'Header image, name, description, validity and status.',
      },
      questions: {
        title: 'Questions',
        description: 'Questions are shown in this order to respondents.',
      },
      recipients: {
        title: 'Recipients',
        description: 'Email groups that receive the form through "Send group emails".',
      },
      settings: {
        title: 'Answer settings',
        description: 'Anonymity, changing the answer and consent.',
      },
    },
    cancel: 'Cancel',
    backToList: 'Back to the list',
    submit: 'Save form',
    submitting: 'Saving…',
    success: {
      createTitle: 'Form created',
      editTitle: 'Form updated',
      description: 'The form "{{title}}" was saved.',
    },
    imageFailure: {
      title: 'Image not saved',
      description:
        'The form "{{title}}" was saved, but the header image was not. Choose the image and save again.',
    },
    invalid: {
      title: 'Review the form',
      description: 'Some fields have problems. Fix the highlighted items and save again.',
    },
  },
  fields: {
    title: 'Form name',
    titlePlaceholder: 'E.g.: Leaders performance evaluation',
    description: 'Description (optional)',
    descriptionPlaceholder: 'Explain the purpose of the form to respondents.',
    startsOn: 'Start date',
    endsOn: 'End date',
    status: 'Status',
    statusHint:
      'Published sends the form to the selected groups. Finished and cancelled cannot be changed afterwards.',
  },
  headerImage: {
    label: 'Header image (optional)',
    previewAlt: 'Header image preview',
    remove: 'Remove image',
    dropzone: {
      idle: 'PNG, JPG, JPEG or WebP, up to 2 MB.',
      hover: 'Click here to select an image',
      drag: 'Drop here to attach the image',
    },
    hint: 'Shown above the title, fitted to the screen up to 800 x 600 px.',
    replaceHint: 'To replace it, drop another image on it or click it.',
    details: '{{name}} · {{width}} x {{height}} px · {{size}}',
    savedDetails: 'Saved image · {{width}} x {{height}} px · {{size}}',
    issues: {
      type: 'Format not accepted. Use PNG, JPG, JPEG or WebP.',
      size: 'The image is larger than 2 MB. Choose a smaller file.',
      unreadable: 'Could not read the image. Choose another file.',
    },
  },
  questions: {
    groupLabel: 'Question {{number}}',
    number: 'Question {{number}}',
    moveUp: 'Move question {{number}} up',
    moveDown: 'Move question {{number}} down',
    remove: 'Remove question {{number}}',
    duplicate: 'Duplicate question {{number}}',
    drag: 'Drag to reorder',
    required: 'Required',
    title: 'Question name',
    titlePlaceholder: 'E.g.: What can we improve?',
    fieldType: 'Field type',
    description: 'Description (optional)',
    descriptionPlaceholder: 'Guidance shown below the question name.',
    add: 'Add question',
  },
  options: {
    title: 'Answer options',
    hints: {
      CHECKBOX: 'Respondents can select several options.',
      RADIO: 'Respondents can select only one option.',
      SELECT: 'Respondents pick one option from a list.',
    },
    groupLabel: 'Options for question {{number}}',
    label: 'Option {{number}}',
    placeholder: 'Option {{number}}',
    remove: 'Remove option {{number}}',
    add: 'Add option',
  },
  recipients: {
    legend: 'Recipient email groups',
    count_one: '{{count}} recipient',
    count_other: '{{count}} recipients',
    unavailable: {
      title: 'Email groups unavailable',
      description: 'Could not load the email groups.',
    },
  },
  preview: {
    title: 'Preview',
    description: 'This is how the form looks to respondents.',
    close: 'Close preview',
    untitled: 'Untitled form',
    untitledQuestion: 'Untitled question {{number}}',
    answerPlaceholder: 'Answer',
    untitledOption: 'Option {{number}}',
  },
} as const satisfies Translations['forms'];

export const communication = {
  eyebrow: 'Communication',
  dashboard: {
    title: 'Emails',
    subtitle: 'Recipient groups and email sending.',
    cards: {
      groups: {
        title: 'Email groups',
        description: 'Lists of accounts that receive the emails.',
        details_one: '{{count}} recipient in total',
        details_other: '{{count}} recipients in total',
        open: 'Open groups',
      },
    },
  },
  actions: {
    retry: 'Try again',
    edit: 'Edit',
    delete: 'Delete',
    menu: 'More actions',
    menuNamed: 'Actions for the group {{name}}',
  },
  notices: {
    invalidData: {
      title: 'Data rejected',
      description: 'Review the highlighted fields and try again.',
    },
    conflict: {
      title: 'Could not save',
      description: 'The group was changed by someone else. Reload and try again.',
    },
    notFound: {
      title: 'Group not found',
      description: 'The group no longer exists or was deleted.',
    },
    accessDenied: {
      title: 'Access denied',
      description: 'Your account is not allowed to manage email groups.',
    },
    unavailable: {
      title: 'Service unavailable',
      description: 'Could not reach the server. Please try again shortly.',
    },
  },
  list: {
    back: 'Back to Emails',
    title: 'Email groups',
    subtitle: 'Choose which accounts receive each kind of communication, such as forms.',
    create: 'New group',
    empty: 'No email groups created yet.',
    recipientCount_one: '{{count}} recipient',
    recipientCount_other: '{{count}} recipients',
  },
  deleteDialog: {
    close: 'Close',
    title: 'Delete email group',
    description:
      'The group "{{name}}" will be permanently deleted. Forms that use it will need another group to be saved again.',
    cancel: 'Cancel',
    confirm: 'Delete',
    confirming: 'Deleting…',
    success: {
      title: 'Group deleted',
      description: 'The group "{{name}}" was deleted.',
    },
  },
  validation: {
    nameRequired: 'Enter the group name.',
    nameTooLong: 'Use at most 80 characters.',
    descriptionTooLong: 'Use at most 300 characters.',
    invalid: 'Value rejected by the server. Check it and try again.',
  },
  editor: {
    back: 'Back to the list',
    backToList: 'Back to the list',
    createTitle: 'New email group',
    createSubtitle: 'Name the group and choose the accounts that receive the emails.',
    editTitle: 'Edit email group',
    sections: {
      general: {
        title: 'Group details',
        description: 'Name and description shown when choosing the recipients of a form.',
      },
      recipients: {
        title: 'Recipients',
        description:
          'Accounts with a verified email, members or not. Check accounts and move them between the lists, one by one or all at once.',
      },
    },
    cancel: 'Cancel',
    submit: 'Save group',
    submitting: 'Saving…',
    success: {
      createTitle: 'Group created',
      editTitle: 'Group updated',
      description: 'The group "{{name}}" was saved.',
    },
    invalid: {
      title: 'Review the group',
      description: 'Some fields have problems. Fix the highlighted items and save again.',
    },
  },
  fields: {
    name: 'Name',
    namePlaceholder: 'E.g.: Cell group leaders',
    description: 'Description (optional)',
    descriptionPlaceholder: 'What this group is for',
  },
  recipients: {
    available: 'Available accounts',
    selected: 'In the group',
    searchPlaceholder: 'Search by name or email',
    searchLabel: 'Search in {{list}}',
    empty: 'No accounts in this list.',
    noMatches: 'No accounts found.',
    count_one: '{{count}} account',
    count_other: '{{count}} accounts',
    filteredCount: '{{shown}} of {{total}}',
    addChecked: 'Add checked',
    addAll: 'Add all',
    removeChecked: 'Remove checked',
    removeAll: 'Remove all',
    memberBadge: 'Member',
    unavailable: {
      title: 'Accounts unavailable',
      description: 'Could not load the accounts that can join the group.',
    },
    unavailableAccounts: {
      title: 'Accounts that no longer receive emails',
      description_one:
        '{{count}} account in the group was suspended or lost its verified email and is not shown in the lists.',
      description_other:
        '{{count}} accounts in the group were suspended or lost their verified email and are not shown in the lists.',
      remove: 'Remove from group',
    },
  },
} as const satisfies Translations['communication'];
