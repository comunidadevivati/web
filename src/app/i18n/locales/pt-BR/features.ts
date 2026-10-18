// Textos das features, um namespace por feature.
export const auth = {
  login: {
    tagline: 'Um ambiente criado para conectar pessoas, ministérios e propósitos.',
    title: 'Bem-vindo',
    subtitle: 'Entre com seu e-mail e senha para acessar sua conta.',
    email: 'E-mail',
    emailPlaceholder: 'nome@exemplo.com',
    password: 'Senha',
    submit: 'Entrar',
    submitting: 'Entrando…',
    success: {
      title: 'Login realizado',
      description: 'Bem-vindo(a) de volta à Comunidade Viva.',
    },
    forgotPassword: 'Esqueci minha senha',
    noAccount: 'Ainda não tem conta?',
    createAccount: 'Criar conta',
    validation: {
      emailRequired: 'Informe o seu e-mail.',
      emailInvalid: 'Informe um e-mail válido.',
      passwordRequired: 'Informe a sua senha.',
    },
    notices: {
      expired: {
        title: 'Sua sessão expirou',
        description: 'Por segurança, entre novamente para continuar.',
      },
      invalidCredentials: {
        title: 'E-mail ou senha incorretos',
        description: 'Confira os dados informados e tente novamente.',
      },
      tooManyAttempts: {
        title: 'Muitas tentativas de login',
        description: 'Aguarde alguns instantes antes de tentar novamente.',
      },
      unavailable: {
        title: 'Login indisponível no momento',
        description:
          'Não foi possível conectar ao serviço de autenticação. Tente novamente em instantes.',
      },
    },
  },
  forgotPassword: {
    title: 'Recuperar senha',
    description: 'Informe o e-mail da sua conta para receber um link de troca de senha.',
    close: 'Fechar',
    email: 'E-mail',
    emailPlaceholder: 'nome@exemplo.com',
    submit: 'Enviar',
    submitting: 'Enviando…',
    success: {
      title: 'Solicitação enviada',
      description:
        'Se existir uma conta vinculada a {{email}}, o link chegará em alguns minutos. Confira também a caixa de spam.',
    },
    validation: {
      emailRequired: 'Informe o seu e-mail.',
      emailTooLong: 'O e-mail deve ter no máximo 254 caracteres.',
      emailInvalid: 'Informe um e-mail válido.',
    },
    notices: {
      tooManyAttempts: {
        title: 'Muitas solicitações',
        description: 'Aguarde alguns instantes antes de tentar novamente.',
      },
      unavailable: {
        title: 'Envio indisponível no momento',
        description: 'Não foi possível conectar ao serviço. Tente novamente em instantes.',
      },
    },
  },
  resetPassword: {
    tagline: 'Sua conta protegida para você continuar conectado à nossa comunidade.',
    title: 'Criar nova senha',
    description: 'Defina uma senha segura e diferente da anterior.',
    password: 'Nova senha',
    confirmPassword: 'Confirmação da nova senha',
    submit: 'Redefinir senha',
    submitting: 'Redefinindo…',
    submitHint: 'Preencha os dois campos corretamente para redefinir a senha.',
    backToLogin: 'Voltar para o login',
    success: {
      title: 'Senha redefinida',
      description: 'Sua senha foi redefinida. Entre novamente para continuar.',
    },
    validation: {
      passwordRequired: 'Crie uma nova senha.',
      passwordTooShort: 'A senha deve ter pelo menos 8 caracteres.',
      passwordTooLong: 'A senha deve ter no máximo 64 caracteres.',
      passwordEdgeWhitespace: 'A senha não pode começar nem terminar com espaço.',
      passwordWeak:
        'Senha fraca. Combine letras maiúsculas e minúsculas, números e símbolos, sem sequências óbvias.',
      confirmPasswordRequired: 'Confirme a nova senha.',
      passwordMismatch: 'As senhas não conferem.',
    },
    notices: {
      invalidLink: {
        title: 'Link inválido ou expirado',
        description: 'Solicite um novo link na tela de login para redefinir sua senha.',
      },
      tooManyAttempts: {
        title: 'Muitas tentativas',
        description: 'Aguarde alguns instantes antes de tentar novamente.',
      },
      unavailable: {
        title: 'Redefinição indisponível no momento',
        description: 'Não foi possível conectar ao serviço. Tente novamente em instantes.',
      },
    },
  },
  register: {
    title: 'Criar conta',
    description:
      'Preencha os seus dados para se cadastrar na Comunidade Viva. Todos os campos são obrigatórios.',
    close: 'Fechar',
    submit: 'Criar conta',
    submitting: 'Criando conta…',
    success: {
      title: 'Conta criada',
      description: 'Bem-vindo(a) à Comunidade Viva.',
    },
    submitHint: 'Preencha todos os campos corretamente para criar a conta.',
    fullName: 'Nome completo',
    fullNamePlaceholder: 'Ex.: Maria da Silva',
    phone: 'Telefone com DDD',
    phonePlaceholder: '(67) 99999-9999',
    email: 'E-mail',
    emailPlaceholder: 'nome@exemplo.com',
    password: 'Senha',
    confirmPassword: 'Confirmação de senha',
    validation: {
      fullNameRequired: 'Informe o seu nome completo.',
      fullNameTooLong: 'O nome deve ter no máximo 120 caracteres.',
      fullNameInvalidCharacters: 'Use apenas letras, espaços, apóstrofo, ponto e hífen.',
      fullNameIncomplete: 'Informe nome e sobrenome.',
      phoneRequired: 'Informe o seu telefone com DDD.',
      phoneIncomplete: 'Telefone incompleto. Informe o DDD e o número.',
      phoneInvalidAreaCode: 'DDD inválido.',
      phoneInvalidNumber: 'Número inválido. Celulares têm 9 dígitos e começam com 9.',
      emailRequired: 'Informe o seu e-mail.',
      emailTooLong: 'O e-mail deve ter no máximo 254 caracteres.',
      emailInvalid: 'Informe um e-mail válido.',
      emailTaken: 'Já existe uma conta com este e-mail.',
      passwordRequired: 'Crie uma senha.',
      passwordTooShort: 'A senha deve ter pelo menos 8 caracteres.',
      passwordTooLong: 'A senha deve ter no máximo 64 caracteres.',
      passwordEdgeWhitespace: 'A senha não pode começar nem terminar com espaço.',
      passwordWeak:
        'Senha fraca. Combine letras maiúsculas e minúsculas, números e símbolos, sem dados pessoais ou sequências óbvias.',
      confirmPasswordRequired: 'Confirme a sua senha.',
      passwordMismatch: 'As senhas não conferem.',
    },
    notices: {
      invalidData: {
        title: 'Não foi possível concluir o cadastro',
        description: 'Alguns dados foram recusados. Confira as informações e tente novamente.',
      },
      tooManyAttempts: {
        title: 'Muitas tentativas de cadastro',
        description: 'Aguarde alguns instantes antes de tentar novamente.',
      },
      unavailable: {
        title: 'Cadastro indisponível no momento',
        description: 'Não foi possível conectar ao serviço. Tente novamente em instantes.',
      },
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
  states: {
    error: {
      title: 'Não foi possível carregar o dashboard',
      description: 'Verifique a conexão e tente novamente.',
      retry: 'Tentar novamente',
    },
  },
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
    empty: 'Nenhum evento previsto.',
  },
  recentActivities: {
    title: 'Atividades recentes',
    description: 'Últimas movimentações registradas',
    empty: 'Nenhuma atividade recente.',
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
