// Textos compartilhados por toda a aplicação (shell, navegação, preferências e estados globais).
export const common = {
  app: {
    name: 'Comunidade Viva',
    fullName: 'Comunidade Viva e Eficaz',
  },
  pageTitles: {
    home: 'Home',
    history: 'História',
    events: 'Eventos',
    contact: 'Contato',
    login: 'Login',
    resetPassword: 'Redefinir senha',
    verifyEmail: 'Verificar e-mail',
    dashboard: 'Dashboard',
    guestWifi: 'Wi-Fi Visitantes',
    organization: 'Organização',
    congregations: 'Congregações',
    users: 'Usuários',
  },
  navigation: {
    home: 'Home',
    history: 'História',
    events: 'Eventos',
    contact: 'Contato',
    dashboard: 'Dashboard',
    organization: 'Organização',
    congregations: 'Congregações',
    users: 'Usuários',
    login: 'Login',
    logout: 'Sair',
    emailNotVerified: 'Não verificado',
    resendVerification: 'Reenviar e-mail de verificação',
    accountMenu: 'Menu da conta',
    greeting: 'Olá, {{name}}',
    mainMenu: 'Menu principal',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    goToHome: 'Ir para a página inicial',
    goToDashboard: 'Ir para o dashboard',
    sidebar: 'Menu lateral',
    sidebarHeading: 'Navegação',
    showSidebar: 'Mostrar menu lateral',
    hideSidebar: 'Ocultar menu lateral',
    expandSidebar: 'Expandir menu lateral',
    collapseSidebar: 'Recolher menu lateral',
  },
  emailVerification: {
    resendDialog: {
      title: 'Reenviar e-mail de verificação',
      description: 'O e-mail de verificação será enviado para {{email}} do usuário {{name}}.',
      submit: 'Enviar',
      submitting: 'Enviando…',
      cancel: 'Cancelar',
    },
    resendSuccess: {
      title: 'E-mail enviado',
      description: 'Enviamos um novo link de verificação para o seu e-mail.',
    },
    resendErrors: {
      alreadyVerified: {
        title: 'E-mail já verificado',
        description: 'Este e-mail já foi verificado.',
      },
      tooManyAttempts: {
        title: 'Aguarde um pouco',
        description: 'Aguarde alguns instantes antes de solicitar um novo e-mail.',
      },
      unavailable: {
        title: 'Não foi possível enviar',
        description:
          'Não foi possível enviar o e-mail de verificação. Tente novamente em instantes.',
      },
    },
  },
  session: {
    logoutFailed: {
      title: 'Não foi possível sair',
      description: 'Sua sessão continua ativa. Verifique a conexão e tente sair novamente.',
    },
  },
  preferences: {
    label: 'Preferências',
    open: 'Abrir preferências de idioma e tema',
  },
  theme: {
    label: 'Tema',
    system: 'Tema do sistema',
    light: 'Tema claro',
    dark: 'Tema escuro',
  },
  language: {
    label: 'Idioma',
    ptBR: 'Português (Brasil)',
    ptBRShort: 'PT',
    enUS: 'English (US)',
    enUSShort: 'EN',
  },
  footer: {
    copyright: '© {{year}} Comunidade Viva.',
    rightsReserved: 'Todos os direitos reservados.',
    developedBy: 'Desenvolvido por',
    institution: 'IGREJA EVANGÉLICA VIVA E EFICAZ - CNPJ: 14.158.325/0001-01',
  },
  carousel: {
    roleDescription: 'carrossel',
    slideRoleDescription: 'slide',
    slidePosition: '{{current}} de {{total}}',
    previous: 'Imagem anterior',
    next: 'Próxima imagem',
    goTo: 'Ir para a imagem {{number}}',
  },
  loading: 'Carregando',
  processing: 'Processando, por favor aguarde',
  toast: {
    close: 'Fechar notificação',
    secondsLeft: '{{seconds}}s',
  },
  password: {
    show: 'Mostrar senha',
    hide: 'Ocultar senha',
  },
  passwordStrength: {
    label: 'Força da senha',
    summary: 'Força da senha: {{level}}',
    levels: {
      empty: 'não informada',
      weak: 'fraca',
      medium: 'média',
      strong: 'forte',
    },
    requirementsLabel: 'Requisitos da senha',
    requirements: {
      minLength: 'Pelo menos 8 caracteres',
      lowercase: 'Uma letra minúscula',
      uppercase: 'Uma letra maiúscula',
      number: 'Um número',
      symbol: 'Um símbolo (ex.: ! @ # $)',
    },
    met: 'atendido',
    notMet: 'pendente',
  },
  pwa: {
    title: 'Nova versão disponível',
    description: 'Uma nova versão da Comunidade Viva está disponível.',
    update: 'Atualizar',
  },
  routeError: {
    title: 'Não foi possível carregar esta página',
    description: 'Ocorreu um erro inesperado. Tente novamente.',
    retry: 'Tentar novamente',
    goHome: 'Voltar para o início',
  },
  statusPage: {
    goBack: 'Voltar',
    goHome: 'Ir para o início',
    notFound: {
      eyebrow: 'Erro 404',
      title: 'Página não encontrada',
      description:
        'O endereço que você tentou acessar não existe ou foi alterado. Você pode voltar para onde estava ou ir para a página inicial.',
    },
    underConstruction: {
      title: 'Página em construção',
      description:
        'Esta página ainda está sendo preparada e estará disponível em breve. Enquanto isso, você pode voltar para onde estava ou ir para a página inicial.',
    },
  },
} as const;
