// Textos das features, um namespace por feature.
export const auth = {
  login: {
    tagline: 'Um ambiente criado para conectar pessoas, ministérios e propósitos.',
    title: 'Bem-vindo',
    subtitle: 'Entre com suas credenciais para acessar sua conta.',
    email: 'E-mail',
    emailPlaceholder: 'seuemail@exemplo.com',
    password: 'Senha',
    passwordPlaceholder: 'Digite sua senha',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    submit: 'Entrar',
    validation: {
      emailRequired: 'Informe o e-mail.',
      emailInvalid: 'Informe um e-mail válido.',
      passwordRequired: 'Informe a senha.',
    },
  },
} as const;

export const home = {
  carouselLabel: 'Fotos da Comunidade Viva',
  slides: {
    mg1387: 'Congregação com as mãos levantadas durante o louvor',
    mg0579: 'Homens abraçados em oração',
    mg0390: 'Oração em grupo em frente ao palco',
    mg9923: 'Mulher com a mão levantada em adoração',
    mg1023: 'Jovens em momento de oração',
    mg1339: 'Homem e mulher orando juntos',
    mg1211: 'Oração com imposição de mãos',
    mg1232: 'Homem em adoração próximo ao palco',
  },
} as const;

export const dashboard = {
  title: 'Dashboard',
  subtitle: 'Visão geral da Comunidade Viva.',
  summaries: {
    members: {
      label: 'Membros',
      description: 'Membros cadastrados',
    },
    visitors: {
      label: 'Visitantes',
      description: 'Visitantes no período',
    },
    events: {
      label: 'Eventos',
      description: 'Próximos eventos',
    },
    ministries: {
      label: 'Ministérios',
      description: 'Ministérios ativos',
    },
  },
  upcomingEvents: {
    title: 'Próximos eventos',
    description: 'Agenda prevista da comunidade',
    badge: 'Evento',
    next: 'Próximo',
    items: {
      celebration: 'Culto de Celebração',
      leaders: 'Encontro de Líderes',
      families: 'Conferência de Famílias',
    },
  },
  recentActivities: {
    title: 'Atividades recentes',
    description: 'Últimas movimentações registradas',
    items: {
      newMember: 'Novo membro cadastrado',
      newVisitor: 'Novo visitante registrado',
      eventUpdated: 'Evento atualizado',
    },
  },
} as const;

export const contact = {
  eyebrow: 'Fale conosco',
  title: 'Contato',
  description:
    'Quer conhecer a Comunidade Viva ou tirar uma dúvida? Fale com a gente por um dos canais abaixo.',
  channels: {
    address: {
      title: 'Endereço',
      mapAction: 'Ver no mapa',
      mapAriaLabel: 'Ver o endereço no Google Maps (abre em nova aba)',
    },
    phone: {
      title: 'Telefone e WhatsApp',
      whatsAppAction: 'WhatsApp',
      whatsAppAriaLabel: 'Conversar pelo WhatsApp (abre em nova aba)',
      callAction: 'Ligar',
      callAriaLabel: 'Ligar para {{phone}}',
    },
    email: {
      title: 'E-mail',
      sendAction: 'Enviar e-mail',
      sendAriaLabel: 'Enviar e-mail para {{email}}',
    },
  },
  social: {
    title: 'Redes sociais',
    description: 'Acompanhe a Comunidade Viva e fique por dentro das novidades.',
    linkAriaLabel: '{{name}} da Comunidade Viva (abre em nova aba)',
  },
} as const;

export const guestWifi = {
  eyebrow: 'Wi-Fi VIVA - Visitantes',
  title: 'Bem-vindo à Comunidade Viva!',
  intro:
    'Que alegria ter você aqui. Para usar a internet, aceite os termos de uso e informe seu nome e telefone.',
  unavailable: {
    title: 'Acesso indisponível',
    description:
      'Esta página é aberta automaticamente quando você se conecta à rede Wi-Fi "VIVA - Visitantes". Conecte-se à rede e aguarde a página abrir.',
    goToSite: 'Ir para o site da Comunidade Viva',
  },
  steps: {
    label: 'Etapas',
    terms: 'Termos',
    data: 'Seus dados',
  },
  terms: {
    title: 'Termos de uso e política de privacidade',
    updatedAt: 'Última atualização: {{date}}',
    accept:
      'Li e aceito os termos de uso, a política de privacidade e a autorização de uso de imagem e voz.',
    continue: 'Continuar',
  },
  form: {
    title: 'Seus dados',
    description: 'Preencha para liberar o acesso à internet.',
    fullName: 'Nome completo',
    fullNamePlaceholder: 'Seu nome e sobrenome',
    phone: 'Telefone (WhatsApp)',
    phonePlaceholder: '(67) 99999-9999',
    backToTerms: 'Voltar aos termos',
    connect: 'Conectar',
    validation: {
      fullNameRequired: 'Informe seu nome completo.',
      fullNameTooLong: 'O nome deve ter no máximo 120 caracteres.',
      fullNameIncomplete: 'Informe seu nome e sobrenome.',
      phoneRequired: 'Informe seu telefone.',
      phoneInvalid: 'Informe um telefone válido com DDD.',
    },
  },
  error: {
    title: 'Não foi possível liberar o acesso',
    description:
      'Verifique se você ainda está conectado à rede "VIVA - Visitantes" e tente novamente. Se o problema continuar, procure a recepção.',
    code: 'Código do erro: {{code}}',
  },
  success: {
    title: 'Você está conectado!',
    description: 'A internet foi liberada. Aproveite e seja muito bem-vindo à Comunidade Viva.',
    continue: 'Continuar navegando',
    redirect_one: 'Você será levado ao site em {{count}} segundo.',
    redirect_other: 'Você será levado ao site em {{count}} segundos.',
  },
} as const;
