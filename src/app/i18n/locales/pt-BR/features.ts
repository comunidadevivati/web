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
      description: 'Senha redefinida com sucesso.',
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
      weakPassword: {
        title: 'Senha não aceita',
        description: 'A nova senha não atende aos requisitos de segurança.',
      },
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
  verifyEmail: {
    tagline: 'Confirme seu e-mail para aproveitar tudo o que a comunidade preparou para você.',
    title: 'Verificação de e-mail',
    verifying: 'Verificando seu e-mail…',
    goToApp: 'Ir para a aplicação',
    success: {
      title: 'E-mail verificado',
      description: 'E-mail verificado com sucesso.',
    },
    notices: {
      invalidLink: {
        title: 'Link inválido ou expirado',
        description:
          'Entre na aplicação e use "Reenviar e-mail de verificação", no menu da conta, para receber um novo link.',
      },
      unavailable: {
        title: 'Verificação indisponível no momento',
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
  unverified: {
    title: 'Conta não verificada',
    description:
      'Confirme seu e-mail pelo link que enviamos para liberar as informações da aplicação. Não recebeu? Use "Reenviar e-mail de verificação" no menu da conta.',
  },
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

export const organization = {
  status: {
    ACTIVE: 'Ativa',
    INACTIVE: 'Inativa',
    DRAFT: 'Rascunho',
  },
  actions: {
    edit: 'Editar',
    activate: 'Ativar',
    deactivate: 'Inativar',
    retry: 'Tentar novamente',
  },
  fields: {
    legalName: 'Razão social',
    tradeName: 'Nome fantasia',
    name: 'Nome',
    code: 'Código institucional',
    codeHint: 'Letras, números e hífen (ex.: CG-NORTE). Não pode ser alterado depois.',
    cnpj: 'CNPJ',
    phone: 'Telefone',
    email: 'E-mail',
    optional: '{{label}} (opcional)',
    street: 'Logradouro',
    number: 'Número',
    complement: 'Complemento',
    district: 'Bairro',
    city: 'Cidade',
    state: 'UF',
    postalCode: 'CEP',
    cnpjPlaceholder: '00.000.000/0000-00',
    phonePlaceholder: '(67) 99999-9999',
    emailPlaceholder: 'contato@exemplo.com',
    postalCodePlaceholder: '00000-000',
    statePlaceholder: 'MS',
  },
  details: {
    contact: 'Contato',
    address: 'Endereço',
    region: '{{city}}/{{state}} · CEP {{postalCode}}',
    notInformed: 'Não informado',
  },
  validation: {
    required: 'Preencha este campo.',
    tooLong: 'O texto está maior que o permitido.',
    invalid: 'Valor recusado pelo servidor. Confira e tente novamente.',
    cnpjInvalid: 'Informe um CNPJ válido.',
    postalCodeInvalid: 'Informe um CEP com 8 dígitos.',
    stateInvalid: 'Informe a sigla de uma UF brasileira (ex.: MS).',
    emailInvalid: 'Informe um e-mail válido.',
    codeInvalid: 'Use de 2 a 20 letras, números ou hífen, sem hífen nas pontas.',
    phoneIncomplete: 'Informe o telefone completo com DDD.',
    phoneInvalidAreaCode: 'Informe um DDD válido.',
    phoneInvalidNumber: 'Informe um número de telefone válido.',
  },
  notices: {
    invalidData: {
      title: 'Dados recusados',
      description: 'Confira os campos destacados e tente novamente.',
    },
    conflict: {
      title: 'Não foi possível concluir',
      description: 'Os dados foram alterados por outra operação. Recarregue e tente novamente.',
    },
    notFound: {
      title: 'Registro não encontrado',
      description: 'O registro pode ter sido removido. Atualize a página.',
    },
    accessDenied: {
      title: 'Acesso não liberado',
      description: 'Confirme o seu e-mail para acessar os dados da organização.',
    },
    unavailable: {
      title: 'Serviço indisponível',
      description: 'Não foi possível conectar ao serviço. Tente novamente em instantes.',
    },
  },
  statusDialog: {
    activateTitle: 'Ativar {{name}}?',
    deactivateTitle: 'Inativar {{name}}?',
    organizationActivate:
      'A organização voltará a permitir o registro e a ativação de congregações.',
    organizationDeactivate:
      'Com a organização inativa, nenhuma congregação poderá ser registrada ou ativada.',
    congregationActivate: 'A congregação passará a funcionar normalmente.',
    congregationDeactivate: 'A congregação deixará de funcionar até ser reativada.',
    cancel: 'Cancelar',
    confirming: 'Salvando…',
    success: {
      activate: 'Ativação concluída',
      deactivate: 'Inativação concluída',
      description: '{{name}} agora está com a situação "{{status}}".',
    },
  },
  organizationPage: {
    title: 'Organização',
    subtitle: 'Dados institucionais da Igreja Evangélica Viva e Eficaz (Matriz).',
    edit: 'Editar dados',
  },
  organizationForm: {
    title: 'Editar organização',
    description: 'Atualize os dados institucionais da Matriz.',
    close: 'Fechar',
    submit: 'Salvar',
    submitting: 'Salvando…',
    success: {
      title: 'Organização atualizada',
      description: 'Os dados da organização foram salvos.',
    },
  },
  congregationsPage: {
    title: 'Congregações',
    subtitle: 'Igrejas locais vinculadas à organização.',
    create: 'Nova congregação',
    filterLabel: 'Filtrar por situação',
    filters: {
      ALL: 'Todas',
      ACTIVE: 'Ativas',
      DRAFT: 'Rascunhos',
      INACTIVE: 'Inativas',
    },
    headquarters: 'Sede',
    empty: 'Nenhuma congregação encontrada.',
    loadMore: 'Carregar mais',
    loadingMore: 'Carregando…',
    editLabel: 'Editar {{name}}',
    activateLabel: 'Ativar {{name}}',
    deactivateLabel: 'Inativar {{name}}',
  },
  congregationForm: {
    createTitle: 'Nova congregação',
    createDescription: 'A congregação é registrada como rascunho e pode ser ativada em seguida.',
    editTitle: 'Editar congregação',
    editDescription: 'Atualize os dados de {{name}}.',
    close: 'Fechar',
    submit: 'Salvar',
    submitting: 'Salvando…',
    success: {
      createTitle: 'Congregação registrada',
      createDescription: '{{name}} foi registrada como rascunho.',
      editTitle: 'Congregação atualizada',
      editDescription: 'Os dados de {{name}} foram salvos.',
    },
  },
} as const;

export const members = {
  status: {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    ARCHIVED: 'Arquivado',
  },
  membershipStatus: {
    PENDING: 'Pendente',
    ACTIVE: 'Ativo',
    INACTIVE: 'Encerrado',
  },
  actions: {
    activate: 'Ativar',
    deactivate: 'Inativar',
    archive: 'Arquivar',
    restore: 'Restaurar',
    end: 'Encerrar',
    retry: 'Tentar novamente',
  },
  fields: {
    fullName: 'Nome completo',
    birthDate: 'Data de nascimento',
    phone: 'Telefone',
    email: 'E-mail',
    congregation: 'Congregação',
    congregationPlaceholder: 'Selecione a congregação',
    primary: 'Vínculo principal',
    primaryHint: 'A congregação de referência do membro. Só pode haver um vínculo principal ativo.',
  },
  validation: {
    congregationRequired: 'Selecione a congregação.',
    invalid: 'Valor recusado pelo servidor. Confira e tente novamente.',
  },
  notices: {
    invalidData: {
      title: 'Dados recusados',
      description: 'Confira os campos destacados e tente novamente.',
    },
    conflict: {
      title: 'Não foi possível concluir',
      description: 'Os dados foram alterados por outra operação. Recarregue e tente novamente.',
    },
    notFound: {
      title: 'Registro não encontrado',
      description: 'O registro pode ter sido removido. Volte para a lista de membros.',
    },
    accessDenied: {
      title: 'Acesso não liberado',
      description: 'Confirme o seu e-mail para acessar os dados de membros.',
    },
    unavailable: {
      title: 'Serviço indisponível',
      description: 'Não foi possível conectar ao serviço. Tente novamente em instantes.',
    },
  },
  listPage: {
    title: 'Membros',
    subtitle: 'Pessoas da comunidade e seus vínculos com as congregações.',
    create: 'Criar membro',
    searchLabel: 'Buscar por nome',
    searchPlaceholder: 'Digite parte do nome',
    search: 'Buscar',
    statusFilterLabel: 'Filtrar por situação',
    filters: {
      ALL: 'Todos',
      ACTIVE: 'Ativos',
      INACTIVE: 'Inativos',
      ARCHIVED: 'Arquivados',
    },
    congregationLabel: 'Congregação',
    allCongregations: 'Todas as congregações',
    empty: 'Nenhum membro encontrado.',
    loadMore: 'Carregar mais',
    loadingMore: 'Carregando…',
    birthDate: 'Nascimento: {{date}}',
  },
  detailPage: {
    back: 'Voltar para membros',
    profile: 'Dados pessoais',
    notInformed: 'Não informado',
    memberships: 'Vínculos com congregações',
    membershipsDescription: 'Histórico completo, inclusive vínculos encerrados.',
    addMembership: 'Novo vínculo',
    membershipsEmpty: 'Nenhum vínculo registrado.',
    primary: 'Principal',
    startedOn: 'Início: {{date}}',
    endedOn: 'Encerramento: {{date}}',
    removedCongregation: 'Congregação não encontrada',
    inactiveHint: 'Somente membros ativos podem receber novos vínculos.',
  },
  memberCreate: {
    title: 'Criar membro',
    description:
      'Usuários com conta verificada que ainda não são membros. Ao vincular, a conta vira Pessoa (com os dados da conta) e a Pessoa vira membro; os vínculos com congregações são adicionados depois, na ficha.',
    close: 'Fechar',
    selected_one: '{{count}} usuário selecionado',
    selected_other: '{{count}} usuários selecionados',
    linkAll: 'Vincular todos',
    linking: 'Vinculando…',
    link: 'Vincular',
    linkUser: 'Vincular {{name}} como membro',
    selectAll: 'Selecionar todos os usuários da lista',
    select: 'Selecionar {{name}}',
    empty: 'Nenhum usuário com conta verificada aguardando para virar membro.',
    columns: {
      user: 'Usuário',
      phone: 'Telefone',
      action: 'Ação',
    },
    success: {
      title_one: 'Membro criado',
      title_other: 'Membros criados',
      description_one: '{{name}} agora é membro.',
      description_other: '{{count}} usuários agora são membros.',
    },
    failure: {
      title: 'Nenhum membro criado',
      not_found: 'A conta de {{name}} não foi encontrada. Ela pode ter sido excluída.',
      unverified: 'A conta de {{name}} não está com o e-mail verificado.',
      rejected:
        'Os dados da conta de {{name}} foram recusados pelo cadastro de membros. Corrija o nome ou o telefone em Usuários.',
      unavailable: 'Não foi possível converter {{name}} agora. Tente novamente em instantes.',
    },
    partial: {
      title: 'Conversão parcial',
      description_one:
        '{{created}} de {{count}} usuário virou membro. Confira os que continuam na lista.',
      description_other:
        '{{created}} de {{count}} usuários viraram membros. Confira os que continuam na lista.',
    },
  },
  membershipForm: {
    title: 'Novo vínculo',
    description: 'O vínculo de {{name}} é registrado como pendente e pode ser ativado em seguida.',
    close: 'Fechar',
    submit: 'Registrar vínculo',
    submitting: 'Registrando…',
    noCongregations: 'Não há congregação ativa disponível para vínculo.',
    success: {
      title: 'Vínculo registrado',
      description: 'Vínculo com {{congregation}} registrado como pendente.',
    },
  },
  confirm: {
    cancel: 'Cancelar',
    confirming: 'Salvando…',
    member: {
      activate: {
        title: 'Ativar {{name}}?',
        description: 'O membro volta a participar normalmente e pode receber novos vínculos.',
      },
      deactivate: {
        title: 'Inativar {{name}}?',
        description: 'O membro deixa de participar. Encerre antes os vínculos ativos ou pendentes.',
      },
      archive: {
        title: 'Arquivar {{name}}?',
        description:
          'O membro sai das listas do dia a dia e fica somente leitura. O histórico é preservado.',
      },
      restore: {
        title: 'Restaurar {{name}}?',
        description: 'O membro volta como inativo e pode ser editado e reativado.',
      },
    },
    membership: {
      activate: {
        title: 'Ativar o vínculo com {{congregation}}?',
        description: 'A data de hoje fica registrada como início do vínculo.',
      },
      deactivate: {
        title: 'Encerrar o vínculo com {{congregation}}?',
        description:
          'A data de hoje fica registrada como encerramento. O vínculo encerrado não pode ser reaberto.',
      },
    },
    success: {
      member: {
        activate: 'Membro ativado',
        deactivate: 'Membro inativado',
        archive: 'Membro arquivado',
        restore: 'Membro restaurado',
      },
      membership: {
        activate: 'Vínculo ativado',
        deactivate: 'Vínculo encerrado',
      },
    },
  },
} as const;

export const users = {
  status: {
    ACTIVE: 'Ativa',
    SUSPENDED: 'Suspensa',
    suspendedAt: 'Suspensa em {{dateTime}}',
  },
  verification: {
    verified: 'Verificada',
    unverified: 'Não verificada',
  },
  actions: {
    suspend: 'Suspender',
    reactivate: 'Reativar',
    delete: 'Excluir',
    retry: 'Tentar novamente',
  },
  notices: {
    invalidData: {
      title: 'Dados recusados',
      description: 'Confira os campos e tente novamente.',
    },
    emailTaken: {
      title: 'E-mail já cadastrado',
      description: 'Já existe uma conta com este e-mail.',
    },
    conflict: {
      title: 'Não foi possível concluir',
      description: 'A operação não é permitida para esta conta.',
    },
    notFound: {
      title: 'Usuário não encontrado',
      description: 'A conta pode ter sido excluída. Atualize a lista.',
    },
    accessDenied: {
      title: 'Acesso não liberado',
      description: 'Confirme o seu e-mail para gerenciar usuários.',
    },
    unavailable: {
      title: 'Serviço indisponível',
      description: 'Não foi possível conectar ao serviço. Tente novamente em instantes.',
    },
  },
  listPage: {
    title: 'Usuários',
    subtitle: 'Contas de acesso cadastradas na plataforma.',
    create: 'Novo usuário',
    searchLabel: 'Buscar por nome ou e-mail',
    searchPlaceholder: 'Digite parte do nome ou do e-mail',
    search: 'Buscar',
    filtersLabel: 'Filtrar contas',
    removeFilter: 'Remover o filtro {{filter}}',
    filters: {
      ALL: 'Todas',
      ACTIVE: 'Ativas',
      SUSPENDED: 'Suspensas',
      VERIFIED: 'Verificadas',
      UNVERIFIED: 'Não verificadas',
    },
    columns: {
      user: 'Usuário',
      phone: 'Telefone',
      verification: 'E-mail',
      status: 'Situação',
      createdAt: 'Cadastro',
      actions: 'Ações',
    },
    you: 'Você',
    notInformed: 'Não informado',
    createdAt: 'Cadastro: {{date}}',
    dateTime: '{{date}} às {{time}}',
    empty: 'Nenhum usuário encontrado.',
    loadMore: 'Carregar mais',
    loadingMore: 'Carregando…',
    actionLabels: {
      edit: 'Editar {{name}}',
      suspend: 'Suspender {{name}}',
      reactivate: 'Reativar {{name}}',
      delete: 'Excluir {{name}}',
    },
  },
  createForm: {
    title: 'Novo usuário',
    description:
      'Os mesmos dados do cadastro da tela de login. A pessoa recebe um link para confirmar o e-mail.',
    close: 'Fechar',
    submit: 'Cadastrar',
    submitting: 'Cadastrando…',
    success: {
      title: 'Usuário cadastrado',
      description: 'Enviamos o link de verificação para {{email}}.',
    },
  },
  editForm: {
    title: 'Editar usuário',
    description: 'Atualize os dados de {{name}}. A senha é trocada pela recuperação de senha.',
    emailAlertTitle: 'O e-mail precisará ser verificado de novo',
    emailHint:
      'Ao salvar, a conta volta a ficar não verificada e um novo link é enviado para o endereço novo.',
    close: 'Fechar',
    submit: 'Salvar',
    submitting: 'Salvando…',
    success: {
      title: 'Usuário atualizado',
      description: 'Os dados de {{name}} foram salvos.',
      emailChanged: 'Enviamos um novo link de verificação para {{email}}.',
    },
  },
  confirm: {
    cancel: 'Cancelar',
    confirming: 'Salvando…',
    suspend: {
      title: 'Suspender {{name}}?',
      description:
        'A pessoa não consegue mais entrar e as sessões abertas são encerradas. A conta pode ser reativada depois.',
    },
    reactivate: {
      title: 'Reativar {{name}}?',
      description: 'A pessoa volta a poder entrar com e-mail e senha.',
    },
    delete: {
      title: 'Excluir {{name}} definitivamente?',
      description:
        'A conta nunca confirmou o e-mail e será apagada sem possibilidade de recuperação.',
    },
    success: {
      suspend: 'Usuário suspenso',
      reactivate: 'Usuário reativado',
      delete: 'Usuário excluído',
      description: 'Operação concluída para {{name}}.',
    },
  },
} as const;

export const gallery = {
  status: {
    DRAFT: 'Rascunho',
    PUBLISHED: 'Publicado',
    ARCHIVED: 'Arquivado',
  },
  photoStatus: {
    PROCESSING: 'Processando',
    READY: 'Pronta',
    FAILED: 'Falhou',
  },
  photoFailure: {
    invalid_image: 'O arquivo não é uma imagem válida.',
    processing_error: 'Não foi possível processar a foto. Exclua e envie de novo.',
  },
  actions: {
    edit: 'Editar',
    retry: 'Tentar novamente',
    addPhotos: 'Adicionar fotos',
    delete: 'Excluir foto',
  },
  fields: {
    title: 'Título',
    titlePlaceholder: 'Ex.: Culto de Domingo',
    occurredOn: 'Data do culto ou evento',
    description: 'Descrição (opcional)',
    descriptionPlaceholder: 'Um resumo do culto ou evento.',
  },
  validation: {
    titleRequired: 'Informe o título.',
    titleInvalid: 'Use até 120 caracteres.',
    occurredOnInvalid: 'Informe uma data válida, de 2000 até hoje.',
    descriptionInvalid: 'Use até 2000 caracteres.',
    invalid: 'Valor recusado pelo servidor. Confira e tente novamente.',
  },
  notices: {
    invalidData: {
      title: 'Dados recusados',
      description: 'Confira os campos destacados e tente novamente.',
    },
    conflict: {
      title: 'Não foi possível concluir',
      description: 'Os dados foram alterados por outra operação. Recarregue e tente novamente.',
    },
    notFound: {
      title: 'Álbum não encontrado',
      description: 'O álbum pode ter sido removido. Volte para a lista de álbuns.',
    },
    accessDenied: {
      title: 'Acesso não liberado',
      description: 'Confirme o seu e-mail para gerenciar a galeria.',
    },
    unavailable: {
      title: 'Serviço indisponível',
      description: 'Não foi possível conectar ao serviço. Tente novamente em instantes.',
    },
  },
  listPage: {
    title: 'Álbuns',
    subtitle: 'Fotos dos cultos e eventos. As fotos enviadas ficam privadas até serem publicadas.',
    create: 'Novo álbum',
    empty: 'Nenhum álbum criado.',
    loadMore: 'Carregar mais',
    loadingMore: 'Carregando…',
    photoCount_one: '{{count}} foto',
    photoCount_other: '{{count}} fotos',
  },
  detailPage: {
    back: 'Voltar para álbuns',
    photos: 'Fotos',
    photosDescription: 'Somente fotos publicadas aparecerão na seção Fotos do site.',
    empty: 'Nenhuma foto enviada ainda.',
    hint: 'JPEG, PNG ou WebP, até 25 MB cada. As fotos são otimizadas e perdem a localização (GPS).',
    publicAddress: 'Endereço no site: /fotos/{{slug}}',
    photoAlt: 'Foto {{position}} do álbum {{title}}',
  },
  publication: {
    summary: 'Publicadas no site: {{published}} de {{total}}',
    photo: {
      badge: 'Publicada',
      publish: 'Publicar',
      unpublish: 'Despublicar',
      publishFor: 'Publicar no site: {{alt}}',
      unpublishFor: 'Tirar do site: {{alt}}',
      published: 'Foto publicada no site',
      unpublished: 'Foto retirada do site',
    },
    cover: {
      badge: 'Capa',
      set: 'Usar como capa',
      setFor: 'Usar como capa do álbum: {{alt}}',
      success: 'Capa do álbum atualizada',
    },
    publishAll: {
      label_one: 'Publicar {{count}} foto',
      label_other: 'Publicar {{count}} fotos',
      progress_one: 'Publicando… {{count}} foto',
      progress_other: 'Publicando… {{count}} fotos',
      success_one: '{{count}} foto publicada',
      success_other: '{{count}} fotos publicadas',
    },
    status: {
      publish: {
        label: 'Publicar álbum',
        hint: 'Publique ao menos uma foto para publicar o álbum.',
        success: 'Álbum publicado no site',
      },
      unpublish: {
        label: 'Despublicar álbum',
        success: 'Álbum retirado do site. As fotos continuam publicadas.',
      },
      archive: {
        label: 'Arquivar',
        success: 'Álbum arquivado',
      },
      restore: {
        label: 'Restaurar',
        success: 'Álbum restaurado como rascunho',
      },
    },
  },
  uploads: {
    title: 'Envios',
    clear: 'Limpar concluídos',
    retry: 'Tentar novamente',
    retryFile: 'Tentar enviar {{name}} novamente',
    stage: {
      waiting: 'Na fila',
      sending: 'Enviando {{percent}}%',
      confirming: 'Confirmando…',
      done: 'Enviada. Processando no servidor…',
      failed: 'Falhou',
    },
    failure: {
      invalidType: 'Formato não aceito. Use JPEG, PNG ou WebP.',
      tooLarge: 'Arquivo maior que 25 MB.',
      rejected: 'Envio recusado pelo servidor.',
      transfer: 'Falha ao enviar o arquivo. Verifique a conexão e tente de novo.',
      unavailable: 'Serviço indisponível. Tente novamente em instantes.',
    },
    success: {
      title_one: 'Foto enviada',
      title_other: 'Fotos enviadas',
      description_one: 'A foto está sendo otimizada e aparece no álbum em instantes.',
      description_other: '{{count}} fotos estão sendo otimizadas e aparecem no álbum em instantes.',
    },
    partial: {
      title: 'Alguns envios falharam',
      description_one:
        '{{failed}} de {{count}} arquivo não foi enviado. Confira a lista de envios.',
      description_other:
        '{{failed}} de {{count}} arquivos não foram enviados. Confira a lista de envios.',
    },
  },
  albumForm: {
    createTitle: 'Novo álbum',
    createDescription: 'O álbum nasce como rascunho e não aparece no site.',
    editTitle: 'Editar álbum',
    editDescription: 'Atualize os dados de {{title}}. O endereço no site não muda.',
    close: 'Fechar',
    submit: 'Salvar',
    submitting: 'Salvando…',
    success: {
      createTitle: 'Álbum criado',
      createDescription: 'Agora é só adicionar as fotos de {{title}}.',
      editTitle: 'Álbum atualizado',
      editDescription: 'Os dados de {{title}} foram salvos.',
    },
  },
  confirmDelete: {
    title: 'Excluir esta foto?',
    description:
      'O arquivo enviado e as versões otimizadas são apagados definitivamente. Não é possível desfazer.',
    close: 'Fechar',
    cancel: 'Cancelar',
    confirm: 'Excluir',
    confirming: 'Excluindo…',
    success: 'Foto excluída',
  },
} as const;

export const photos = {
  eyebrow: 'Galeria',
  title: 'Fotos',
  description: 'Momentos dos cultos e eventos da Comunidade Viva e Eficaz.',
  empty: 'Nenhum álbum publicado ainda.',
  loadMore: 'Carregar mais',
  loadingMore: 'Carregando…',
  retry: 'Tentar novamente',
  back: 'Voltar para os álbuns',
  photoCount_one: '{{count}} foto',
  photoCount_other: '{{count}} fotos',
  photoAlt: 'Foto {{position}} do álbum {{title}}',
  openPhoto: 'Abrir a foto {{position}}',
  lightbox: {
    close: 'Fechar',
    previous: 'Foto anterior',
    next: 'Próxima foto',
    position: '{{position}} de {{total}}',
  },
  notices: {
    notFound: {
      title: 'Álbum não encontrado',
      description: 'O álbum pode ter sido removido ou ainda não foi publicado.',
    },
    unavailable: {
      title: 'Fotos indisponíveis',
      description: 'Não foi possível carregar as fotos. Tente novamente em instantes.',
    },
  },
} as const;

export const profile = {
  page: {
    title: 'Meu perfil',
    subtitle: 'Seus dados pessoais, endereço, redes sociais e as configurações da sua conta.',
  },
  avatar: {
    alt: 'Foto de {{name}}',
    change: 'Alterar foto',
    add: 'Adicionar foto',
    remove: 'Remover foto',
    uploading: 'Enviando…',
    hint: 'JPEG, PNG ou WebP de até 10 MB. A foto é recortada em formato quadrado.',
  },
  sections: {
    personal: {
      title: 'Dados pessoais',
      description: 'Como você aparece para a comunidade e como podemos falar com você.',
    },
    address: {
      title: 'Endereço',
      description: 'Opcional. Se informar, preencha o endereço completo.',
    },
    social: {
      title: 'Redes sociais',
      description: 'Links dos seus perfis. Todos são opcionais.',
    },
    security: {
      title: 'Segurança',
      description: 'Senha e e-mail de acesso. As duas alterações pedem a sua senha atual.',
    },
    subscriptions: {
      title: 'Inscrições',
      description: 'Escolha o que você quer receber da comunidade.',
    },
  },
  fields: {
    optional: '{{label}} (opcional)',
    fullName: 'Nome completo',
    sex: 'Sexo',
    sexes: {
      none: 'Não informado',
      MALE: 'Masculino',
      FEMALE: 'Feminino',
    },
    birthDate: 'Data de nascimento',
    phone: 'Telefone 1',
    secondaryPhone: 'Telefone 2',
    email: 'E-mail principal',
    emailHint: 'É o seu e-mail de acesso, já verificado. Para trocá-lo, use Segurança.',
    secondaryEmail: 'E-mail secundário',
    secondaryEmailHint: 'Não precisa ser verificado.',
    postalCode: 'CEP',
    postalCodePlaceholder: '00000-000',
    street: 'Logradouro',
    number: 'Número',
    complement: 'Complemento',
    district: 'Bairro',
    city: 'Cidade',
    state: 'Estado',
    statePlaceholder: 'UF',
    country: 'País',
    reference: 'Ponto de referência',
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    twitter: 'X (Twitter)',
    youtube: 'YouTube',
    socialPlaceholders: {
      instagram: 'https://instagram.com/seu-usuario',
      facebook: 'https://facebook.com/seu-usuario',
      linkedin: 'https://linkedin.com/in/seu-usuario',
      twitter: 'https://x.com/seu-usuario',
      youtube: 'https://youtube.com/@seu-canal',
    },
  },
  actions: {
    save: 'Salvar alterações',
    saving: 'Salvando…',
    discard: 'Descartar alterações',
    retry: 'Tentar novamente',
  },
  success: {
    saved: {
      title: 'Perfil atualizado',
      description: 'Seus dados foram salvos.',
    },
    avatarSaved: {
      title: 'Foto atualizada',
      description: 'A nova foto já aparece no seu perfil.',
    },
    avatarRemoved: {
      title: 'Foto removida',
      description: 'Seu perfil voltou a mostrar as iniciais do seu nome.',
    },
    subscriptions: {
      title: 'Inscrições atualizadas',
      on: 'Você vai receber as notícias da comunidade por e-mail.',
      off: 'Você não vai mais receber as notícias da comunidade por e-mail.',
    },
  },
  notices: {
    invalidData: {
      title: 'Confira os dados',
      description: 'Alguns campos foram recusados. Corrija os campos destacados e salve de novo.',
    },
    conflict: {
      title: 'Perfil alterado em outro lugar',
      description: 'Recarregamos os dados mais recentes. Confira e salve de novo.',
    },
    accessDenied: {
      title: 'Perfil indisponível',
      description: 'Somente membros têm perfil.',
    },
    unavailable: {
      title: 'Perfil indisponível no momento',
      description: 'Não foi possível conectar ao serviço. Tente novamente em instantes.',
    },
    avatarType: {
      title: 'Formato não aceito',
      description: 'Escolha uma foto JPEG, PNG ou WebP.',
    },
    avatarSize: {
      title: 'Foto muito grande',
      description: 'Escolha uma foto de até 10 MB.',
    },
    avatarTransfer: {
      title: 'Não foi possível enviar a foto',
      description: 'O envio foi interrompido. Verifique a conexão e tente novamente.',
    },
  },
  security: {
    accessEmail: 'E-mail de acesso',
    password: 'Senha',
    passwordHint: 'Ao trocar a senha, as outras sessões abertas da sua conta são encerradas.',
    changePassword: 'Alterar senha',
    changeEmail: 'Alterar e-mail',
  },
  changePassword: {
    title: 'Alterar senha',
    description: 'Informe a senha atual e escolha uma nova senha segura.',
    close: 'Fechar',
    currentPassword: 'Senha atual',
    newPassword: 'Nova senha',
    confirmPassword: 'Confirmação da nova senha',
    submit: 'Alterar senha',
    submitting: 'Alterando…',
    cancel: 'Cancelar',
    success: {
      title: 'Senha alterada',
      description: 'As outras sessões da sua conta foram encerradas.',
    },
  },
  changeEmail: {
    title: 'Alterar e-mail de acesso',
    description:
      'Enviaremos um link de confirmação para o novo e-mail. O e-mail atual continua valendo até você abrir o link.',
    close: 'Fechar',
    newEmail: 'Novo e-mail',
    newEmailPlaceholder: 'nome@exemplo.com',
    currentPassword: 'Senha atual',
    submit: 'Enviar link',
    submitting: 'Enviando…',
    cancel: 'Cancelar',
    success: {
      title: 'Confirme o novo e-mail',
      description: 'Enviamos um link para {{email}}. Confira também a caixa de spam.',
    },
  },
  securityNotices: {
    invalidPassword: {
      title: 'Senha atual incorreta',
      description: 'Confira a senha atual e tente novamente.',
    },
    weakPassword: {
      title: 'Senha não aceita',
      description: 'A nova senha não atende aos requisitos de segurança ou é igual à atual.',
    },
    sameEmail: {
      title: 'Mesmo e-mail',
      description: 'Este já é o seu e-mail de acesso.',
    },
    emailTaken: {
      title: 'E-mail em uso',
      description: 'Já existe uma conta com este e-mail.',
    },
    tooManyAttempts: {
      title: 'Muitas solicitações',
      description: 'Aguarde alguns instantes antes de tentar novamente.',
    },
    invalidLink: {
      title: 'Link inválido ou expirado',
      description: 'Peça a troca de e-mail de novo pelo seu perfil.',
    },
    unavailable: {
      title: 'Serviço indisponível no momento',
      description: 'Não foi possível concluir a operação. Tente novamente em instantes.',
    },
  },
  subscriptions: {
    news: 'Receber notícias da comunidade por e-mail',
    newsHint: 'Avisos, eventos e novidades, no seu e-mail de acesso.',
  },
  confirmEmailChange: {
    tagline: 'Sua conta protegida para você continuar conectado à nossa comunidade.',
    title: 'Confirmar novo e-mail',
    confirming: 'Confirmando o seu novo e-mail…',
    goToApp: 'Ir para o meu perfil',
    success: {
      title: 'E-mail alterado',
      description: 'A partir de agora, entre com o novo e-mail.',
    },
  },
  validation: {
    required: 'Preencha este campo.',
    tooLong: 'Texto maior que o permitido.',
    invalid: 'Valor inválido.',
    fullNameInvalid: 'Use somente letras, espaços, apóstrofo, ponto e hífen.',
    birthDateInvalid: 'Informe uma data entre 1900 e hoje.',
    emailInvalid: 'Informe um e-mail válido.',
    postalCodeInvalid: 'Informe um CEP com 8 dígitos.',
    stateInvalid: 'Informe a sigla de um estado (ex.: MS).',
    socialLinkInvalid: 'Informe o link do seu perfil nesta rede.',
    phoneIncomplete: 'Informe o telefone completo, com DDD.',
    phoneInvalidAreaCode: 'DDD inválido.',
    phoneInvalidNumber: 'Número de telefone inválido.',
    passwordRequired: 'Informe a senha.',
    passwordTooShort: 'A senha deve ter pelo menos 8 caracteres.',
    passwordTooLong: 'A senha deve ter no máximo 64 caracteres.',
    passwordEdgeWhitespace: 'A senha não pode começar nem terminar com espaço.',
    passwordWeak: 'Senha fraca. Siga os requisitos abaixo.',
    passwordMismatch: 'As senhas não conferem.',
    passwordSameAsCurrent: 'A nova senha precisa ser diferente da atual.',
  },
} as const;

export const departments = {
  eyebrow: 'Departamentos',
  leadership: {
    title: 'Liderança',
    subtitle: 'Ferramentas e acompanhamento do departamento de Liderança.',
    cards: {
      forms: {
        title: 'Formulários',
        description: 'Pesquisas e avaliações enviadas por e-mail.',
        details: '{{published}} publicado(s) · {{draft}} não publicado(s)',
        open: 'Abrir formulários',
      },
    },
  },
} as const;

export const forms = {
  report: {
    title: 'Relatório',
    toResponses: 'Ver respostas por pessoa',
    exportCsv: 'Exportar CSV (Excel)',
    openPdf: 'Abrir PDF',
    anonymous:
      'Os resultados são consolidados: não há como saber o que cada pessoa respondeu. O CSV não traz nomes nem datas.',
    empty: 'Ainda não há respostas pelo link para consolidar.',
    paperNote:
      'Respostas em papel contam na participação, mas o conteúdo delas está nos anexos e não entra nos resultados abaixo.',
    summary: {
      invited: 'Convidados',
      answered: 'Responderam',
      digital: 'Pelo link',
      paper: 'Em papel',
      pending: 'Pendentes',
    },
    rating: {
      title: 'Nota geral',
      label: 'Nota geral {{value}} de {{max}}',
    },
    answeredCount_one: '{{count}} resposta',
    answeredCount_other: '{{count}} respostas',
    barValue: '{{count}} · {{percent}}%',
    chartLabel: 'Resultado da pergunta {{title}}',
    scaleAverage: 'média (de {{max}})',
    stats: {
      average: 'Média',
      minimum: 'Mínimo',
      maximum: 'Máximo',
    },
    searchLabel: 'Buscar nas respostas da pergunta {{title}}',
    searchPlaceholder: 'Buscar nas respostas',
    noMatches: 'Nenhuma resposta encontrada.',
    purged: {
      title: 'Respostas apagadas',
      description:
        'O conteúdo das respostas foi apagado em {{date}} (LGPD). Ficaram só os números de participação.',
    },
  },
  settings: {
    anonymous: 'Pesquisa anônima',
    anonymousHint:
      'O painel mostra quem respondeu, mas nunca o que cada pessoa respondeu: as respostas aparecem só no relatório consolidado. Não pode ser alterado depois da primeira resposta.',
    allowAnswerEdit: 'Permitir alterar a resposta',
    allowAnswerEditHint: 'Quem respondeu pelo link pode mudar a resposta até o fim do período.',
    allowAnswerEditAnonymous:
      'Indisponível em pesquisa anônima (a resposta não fica ligada à pessoa).',
    consent: 'Texto de consentimento (LGPD)',
    consentHint:
      'Opcional. Quando preenchido, quem responde precisa marcar "Li e aceito" antes de enviar.',
    consentPlaceholder:
      'Ex.: Autorizo o uso das minhas respostas pela liderança para planejamento dos ministérios.',
  },
  scale: {
    groupLabel: 'Configuração da escala da pergunta {{number}}',
    min: 'Começa em',
    max: 'Termina em',
    minLabel: 'Rótulo do início (opcional)',
    maxLabel: 'Rótulo do fim (opcional)',
    minLabelPlaceholder: 'Ex.: Discordo totalmente',
    maxLabelPlaceholder: 'Ex.: Concordo totalmente',
    namedPoints: 'Dar um nome para cada ponto',
    pointLabel: 'Nome do {{value}}',
    preset: {
      apply: 'Usar Péssimo, Ruim, Regular, Bom, Ótimo',
      terrible: 'Péssimo',
      bad: 'Ruim',
      fair: 'Regular',
      good: 'Bom',
      excellent: 'Ótimo',
    },
  },
  duplicate: {
    success: {
      title: 'Formulário duplicado',
      description: 'A cópia "{{title}}" foi criada como não publicada.',
    },
  },
  templates: {
    label: 'Começar a partir de um formulário existente (modelo)',
    placeholder: 'Escolha um formulário',
    hint: 'Cria uma cópia não publicada com as perguntas, as configurações e a imagem. Convites e respostas não são copiados.',
    use: 'Usar como modelo',
    success: {
      title: 'Cópia criada',
      description: 'O formulário "{{title}}" foi criado a partir do modelo.',
    },
  },
  status: {
    DRAFT: 'Não publicado',
    PUBLISHED: 'Publicado',
    FINISHED: 'Finalizado',
    CANCELLED: 'Cancelado',
  },
  fieldTypes: {
    INPUT: 'Texto curto (input)',
    TEXTAREA: 'Texto longo (textarea)',
    CHECKBOX: 'Múltipla escolha (checkbox)',
    RADIO: 'Escolha única (radio)',
    SELECT: 'Lista suspensa (select)',
    SCALE: 'Escala (ex.: 1 a 5)',
    DATE: 'Data',
    NUMBER: 'Número',
  },
  actions: {
    retry: 'Tentar novamente',
    edit: 'Editar',
    duplicate: 'Duplicar',
    report: 'Relatório',
    view: 'Visualizar',
    delete: 'Excluir',
    preview: 'Pré-visualizar formulário',
    previewNamed: 'Pré-visualizar o formulário {{title}}',
    menu: 'Mais ações',
    menuNamed: 'Ações do formulário {{title}}',
    responses: 'Respostas',
  },
  statusActions: {
    publish: {
      label: 'Publicar',
      title: 'Publicar formulário',
      description:
        'O formulário "{{title}}" será publicado. Para avisar as pessoas, use depois "Enviar e-mails do grupo".',
      confirm: 'Publicar',
      success: {
        title: 'Formulário publicado',
        description: 'O formulário "{{title}}" foi publicado.',
      },
    },
    unpublish: {
      label: 'Despublicar',
      title: 'Despublicar formulário',
      description:
        'O formulário "{{title}}" volta a ficar não publicado e deixa de receber respostas até ser publicado de novo.',
      confirm: 'Despublicar',
      success: {
        title: 'Formulário despublicado',
        description: 'O formulário "{{title}}" voltou a ficar não publicado.',
      },
    },
    finish: {
      label: 'Concluir',
      title: 'Concluir formulário',
      description:
        'O formulário "{{title}}" será finalizado: não receberá mais respostas nem poderá ser editado. Esta ação não pode ser desfeita.',
      confirm: 'Concluir',
      success: {
        title: 'Formulário concluído',
        description: 'O formulário "{{title}}" foi finalizado.',
      },
    },
    cancel: {
      label: 'Cancelar formulário',
      title: 'Cancelar formulário',
      description:
        'O formulário "{{title}}" será cancelado: não receberá mais respostas nem poderá ser editado. Esta ação não pode ser desfeita.',
      confirm: 'Cancelar formulário',
      success: {
        title: 'Formulário cancelado',
        description: 'O formulário "{{title}}" foi cancelado.',
      },
    },
    sendEmails: {
      label: 'Enviar e-mails do grupo',
      title: 'Enviar e-mails do grupo',
      description:
        'Cada pessoa dos grupos de "{{title}}" receberá um e-mail com um link pessoal para responder. Durante o envio, o formulário fica bloqueado.',
      confirm: 'Enviar e-mails',
      success: {
        title: 'Envio iniciado',
        description: 'Os e-mails de "{{title}}" estão sendo enviados.',
      },
    },
    remindPending: {
      label: 'Enviar lembrete aos pendentes',
      title: 'Lembrete aos pendentes',
      description:
        'Quem ainda não respondeu "{{title}}" recebe um lembrete com um novo link (o anterior deixa de valer). Durante o envio, o formulário fica bloqueado.',
      confirm: 'Enviar lembrete',
      success: {
        title: 'Lembrete iniciado',
        description: 'Os lembretes de "{{title}}" estão sendo enviados.',
      },
    },
    purgeAnswers: {
      label: 'Apagar respostas',
      title: 'Apagar respostas (LGPD)',
      description:
        'O conteúdo das respostas de "{{title}}" será apagado: respostas pelo link, respostas anônimas e anexos das respostas em papel. Fica registrado apenas quem respondeu e por qual canal. Esta ação não pode ser desfeita.',
      confirm: 'Apagar respostas',
      success: {
        title: 'Respostas apagadas',
        description: 'O conteúdo das respostas de "{{title}}" foi apagado.',
      },
    },
    resendEmails: {
      label: 'Reenviar e-mails do grupo',
      title: 'Reenviar e-mails do grupo',
      description:
        'Quem ainda não respondeu "{{title}}" recebe um novo link (o anterior deixa de valer), e quem entrou nos grupos depois recebe o primeiro. Quem já respondeu não recebe de novo.',
      confirm: 'Reenviar e-mails',
      success: {
        title: 'Reenvio iniciado',
        description: 'Os e-mails de "{{title}}" estão sendo enviados.',
      },
    },
  },
  responses: {
    title: 'Respostas',
    toReport: 'Ver relatório consolidado',
    anonymous: {
      title: 'Pesquisa anônima',
      description:
        'Aqui aparece só quem respondeu. O que cada pessoa respondeu não fica ligado a ela e aparece apenas no relatório consolidado.',
    },
    summary: '{{answered}} de {{invited}} responderam',
    empty: 'Nenhum convite enviado ainda. Use "Enviar e-mails do grupo" no menu do formulário.',
    menuNamed: 'Ações de {{name}}',
    sentAt: 'Convite enviado em {{date}}',
    answeredAt: 'Respondido em {{date}}',
    delivery: {
      SENT: 'E-mail enviado',
      DELAYED: 'Entrega do e-mail atrasada',
      DELIVERED: 'E-mail entregue',
      OPENED: 'E-mail aberto',
      CLICKED: 'Link do e-mail clicado',
      BOUNCED: 'E-mail devolvido (endereço inválido)',
      COMPLAINED: 'E-mail marcado como spam',
      FAILED: 'Falha no envio do e-mail',
    },
    states: {
      PENDING: 'Pendente',
      DIGITAL: 'Respondido pelo link',
      PAPER: 'Respondido em papel',
    },
    actions: {
      viewAnswers: 'Ver respostas',
      markPaper: 'Marcar como respondido em papel',
      attach: 'Anexar formulário preenchido',
      replaceAttachment: 'Trocar anexo',
      openPdf: 'Abrir PDF',
      openImage: 'Abrir imagem',
      unmark: 'Desfazer resposta em papel',
    },
    answersDialog: {
      close: 'Fechar',
      description: '{{email}} · respondido em {{date}}',
      noAnswer: 'Sem resposta',
      print: 'Abrir PDF',
    },
    print: {
      blocked: {
        title: 'Nova aba bloqueada',
        description: 'Permita janelas pop-up para este site e tente de novo.',
      },
    },
    paper: {
      close: 'Fechar',
      title: 'Resposta em papel',
      description:
        'Registre que {{name}} respondeu a versão impressa. Se quiser, anexe o formulário preenchido digitalizado.',
      attachTitle: 'Anexo da resposta em papel',
      attachDescription: 'Anexe o formulário preenchido por {{name}} (substitui o anexo atual).',
      fileOptional: 'Formulário preenchido (opcional)',
      fileRequired: 'Formulário preenchido',
      dropzone: {
        idle: 'PDF, JPG, JPEG ou PNG, até 2 MB.',
        hover: 'Clique aqui para selecionar o arquivo',
        drag: 'Solte aqui para anexar o arquivo',
      },
      replaceHint: 'Já existe um anexo. Escolha outro arquivo para substituí-lo.',
      selectedHint: 'Para trocar, solte outro arquivo sobre ele ou clique nele.',
      issues: {
        type: 'Use um arquivo PDF, JPG, JPEG ou PNG.',
        size: 'O arquivo passa de 2 MB.',
      },
      cancel: 'Cancelar',
      confirm: 'Salvar',
      confirming: 'Salvando…',
      success: {
        title: 'Resposta em papel registrada',
        description: 'A resposta de {{name}} foi registrada.',
      },
    },
    unmark: {
      close: 'Fechar',
      title: 'Desfazer resposta em papel',
      description:
        'A resposta em papel de {{name}} deixa de constar, e o anexo é apagado. O convite volta a ficar pendente.',
      cancel: 'Cancelar',
      confirm: 'Desfazer',
      confirming: 'Desfazendo…',
      success: {
        title: 'Resposta em papel desfeita',
        description: 'O convite de {{name}} voltou a ficar pendente.',
      },
    },
  },
  emailDispatch: {
    sending: 'Enviando e-mails do grupo',
    menuLocked: 'Aguarde o fim do envio dos e-mails',
    editorLocked: 'O formulário fica bloqueado até o fim do envio dos e-mails aos grupos.',
    sent: { title: 'E-mails enviados' },
    failed: { title: 'Falha no envio dos e-mails' },
    result: '"{{title}}": {{sent}} enviado(s), {{failed}} com falha.',
  },
  answer: {
    fields: {
      name: 'Nome',
      email: 'E-mail',
    },
    submit: 'Enviar respostas',
    update: 'Atualizar respostas',
    requiredSr: '(obrigatória)',
    requiredLegend: '* Pergunta obrigatória',
    selectPlaceholder: 'Selecione uma opção',
    sendCopy: 'Receber uma cópia das respostas em PDF em {{email}}',
    draftRestored: 'Recuperamos o rascunho que você começou neste navegador.',
    consent: {
      label: 'Li e aceito',
    },
    anonymous: {
      title: 'Respostas anônimas',
      description:
        'Seu nome aparece só para registrar que você respondeu. As respostas não ficam ligadas a você.',
    },
    submitting: 'Enviando…',
    success: {
      title: 'Respostas enviadas',
      description: 'Obrigado! Suas respostas foram registradas.',
      withCopy: 'Obrigado! Suas respostas foram registradas, e a cópia em PDF segue por e-mail.',
    },
    answered: {
      title: 'Formulário respondido',
      description:
        'Suas respostas foram registradas em {{date}}. Veja abaixo o que você respondeu.',
      paperDescription: 'Sua resposta na versão impressa foi registrada em {{date}}.',
      anonymousDescription:
        'Sua resposta anônima foi registrada em {{date}}. Por ser anônima, ela não pode ser exibida de volta.',
      editableDescription:
        'Suas respostas foram registradas em {{date}}. Você pode alterá-las abaixo até o fim do período.',
    },
    availability: {
      NOT_STARTED: {
        title: 'Ainda não começou',
        description: 'Este formulário recebe respostas de {{period}}.',
      },
      ENDED: {
        title: 'Prazo encerrado',
        description: 'Este formulário recebeu respostas de {{period}}.',
      },
      CLOSED: {
        title: 'Formulário fechado',
        description: 'Este formulário não está recebendo respostas.',
      },
      OPEN: {
        title: 'Formulário aberto',
        description: 'Responda até o fim do período ({{period}}).',
      },
    },
    validation: {
      tooLong: 'A resposta passou do limite de caracteres.',
      empty: 'Responda ao menos uma pergunta antes de enviar.',
      required: 'Esta pergunta é obrigatória.',
      invalidNumber: 'Informe um número válido.',
      invalidDate: 'Informe uma data válida.',
      consent: 'Marque "Li e aceito" para enviar.',
    },
    notices: {
      invalidLink: {
        title: 'Link inválido',
        description:
          'Este link não existe ou foi substituído por um envio mais recente. Use o link do último e-mail recebido.',
      },
      invalidAnswers: {
        title: 'Revise as respostas',
        description: 'Há respostas com problemas. Corrija os itens marcados e envie de novo.',
      },
      conflict: {
        title: 'Não foi possível enviar',
        description: 'O formulário já foi respondido por este link ou não está mais aberto.',
      },
      unavailable: {
        title: 'Serviço indisponível',
        description: 'Não foi possível carregar o formulário. Tente novamente em instantes.',
      },
    },
  },
  statusDialog: {
    message: 'Mensagem no e-mail (opcional)',
    messagePlaceholder: 'Ex.: Contamos com a sua participação até sexta-feira!',
    messageHint: 'Aparece no corpo do e-mail, antes do botão de resposta.',
    close: 'Fechar',
    back: 'Voltar',
    confirming: 'Salvando…',
  },
  notices: {
    invalidData: {
      title: 'Dados recusados',
      description: 'Revise os campos marcados e tente novamente.',
    },
    conflict: {
      title: 'Não foi possível salvar',
      description:
        'O formulário foi alterado ou não permite esta ação. Recarregue e tente de novo.',
    },
    notFound: {
      title: 'Formulário não encontrado',
      description: 'O formulário não existe mais ou foi excluído.',
    },
    accessDenied: {
      title: 'Acesso negado',
      description: 'Sua conta não tem permissão para gerenciar formulários.',
    },
    unavailable: {
      title: 'Serviço indisponível',
      description: 'Não foi possível falar com o servidor. Tente novamente em instantes.',
    },
  },
  list: {
    back: 'Voltar para Liderança',
    title: 'Formulários',
    subtitle: 'Pesquisas, avaliações de desempenho e outros formulários da Liderança.',
    create: 'Novo formulário',
    statusFilter: 'Status',
    allStatuses: 'Todos os status',
    empty: 'Nenhum formulário criado ainda.',
    emptyFiltered: 'Nenhum formulário com este status.',
    period: '{{start}} a {{end}}',
    questionCount_one: '{{count}} pergunta',
    questionCount_other: '{{count}} perguntas',
    recipientGroupCount_one: '{{count}} grupo de e-mail',
    recipientGroupCount_other: '{{count}} grupos de e-mail',
    emailSummary: 'E-mails enviados em {{date}} · {{answered}} de {{invited}} responderam',
    answersPurged: 'Respostas apagadas em {{date}} (LGPD)',
    loadMore: 'Carregar mais',
    loadingMore: 'Carregando…',
  },
  deleteDialog: {
    close: 'Fechar',
    title: 'Excluir formulário',
    description:
      'O formulário "{{title}}" será excluído definitivamente. Esta ação não pode ser desfeita.',
    cancel: 'Cancelar',
    confirm: 'Excluir',
    confirming: 'Excluindo…',
    success: {
      title: 'Formulário excluído',
      description: 'O formulário "{{title}}" foi excluído.',
    },
  },
  validation: {
    titleRequired: 'Informe o nome do formulário.',
    titleTooLong: 'Use no máximo 120 caracteres.',
    descriptionTooLong: 'Use no máximo 2.000 caracteres.',
    dateInvalid: 'Informe uma data válida.',
    endsBeforeStart: 'A data de fim não pode ser anterior à data de início.',
    endsInPast: 'Para publicar, a data de fim não pode ter passado.',
    questionsRequired: 'Adicione ao menos uma pergunta.',
    questionsTooMany: 'Use no máximo 50 perguntas.',
    questionTitleRequired: 'Informe o nome da pergunta.',
    questionTitleTooLong: 'Use no máximo 200 caracteres.',
    questionDescriptionTooLong: 'Use no máximo 500 caracteres.',
    recipientsRequired: 'Para publicar, selecione ao menos um grupo de e-mail.',
    optionRequired: 'Informe o texto da opção.',
    optionTooLong: 'Use no máximo 100 caracteres.',
    optionsTooFew: 'Adicione ao menos 1 opção.',
    optionsTooMany: 'Use no máximo 20 opções.',
    optionsDuplicated: 'As opções precisam ser diferentes entre si.',
    scaleInvalid: 'A escala começa em 0 ou 1 e termina depois do início, até 10.',
    scaleLabelTooLong: 'Use no máximo 40 caracteres.',
    scalePointRequired: 'Dê um nome para este ponto.',
    scalePointsDuplicated: 'Use um nome diferente em cada ponto.',
    consentTooLong: 'Use no máximo 1.000 caracteres.',
    anonymousEdit: 'Pesquisa anônima não permite alterar a resposta.',
    invalid: 'Valor recusado pelo servidor.',
  },
  editor: {
    back: 'Voltar para Formulários',
    createTitle: 'Novo formulário',
    createSubtitle: 'Monte o formulário, escolha quem recebe e publique quando estiver pronto.',
    editTitle: 'Editar formulário',
    preview: 'Pré-visualizar',
    readOnly: {
      title: 'Somente leitura',
      description: 'Formulários com status "{{status}}" não podem mais ser alterados.',
    },
    sections: {
      general: {
        title: 'Informações gerais',
        description: 'Imagem do cabeçalho, nome, descrição, validade e status.',
      },
      questions: {
        title: 'Perguntas',
        description: 'As perguntas aparecem nesta ordem para quem responde.',
      },
      recipients: {
        title: 'Destinatários',
        description:
          'Grupos de e-mail que recebem o formulário pela ação "Enviar e-mails do grupo".',
      },
      settings: {
        title: 'Configurações das respostas',
        description: 'Anonimato, alteração da resposta e consentimento.',
      },
    },
    cancel: 'Cancelar',
    backToList: 'Voltar para a lista',
    submit: 'Salvar formulário',
    submitting: 'Salvando…',
    success: {
      createTitle: 'Formulário criado',
      editTitle: 'Formulário atualizado',
      description: 'O formulário "{{title}}" foi salvo.',
    },
    imageFailure: {
      title: 'Imagem não salva',
      description:
        'O formulário "{{title}}" foi salvo, mas a imagem do cabeçalho não. Escolha a imagem e salve de novo.',
    },
    invalid: {
      title: 'Revise o formulário',
      description: 'Há campos com problemas. Corrija os itens marcados e salve novamente.',
    },
  },
  fields: {
    title: 'Nome do formulário',
    titlePlaceholder: 'Ex.: Avaliação de desempenho dos líderes',
    description: 'Descrição (opcional)',
    descriptionPlaceholder: 'Explique o objetivo do formulário para quem vai responder.',
    startsOn: 'Data de início',
    endsOn: 'Data de fim',
    status: 'Status',
    statusHint:
      'Publicado envia o formulário aos grupos selecionados. Finalizado e cancelado não podem ser alterados depois.',
  },
  headerImage: {
    label: 'Imagem do cabeçalho (opcional)',
    previewAlt: 'Prévia da imagem do cabeçalho',
    remove: 'Remover imagem',
    dropzone: {
      idle: 'PNG, JPG, JPEG ou WebP, até 2 MB.',
      hover: 'Clique aqui para selecionar uma imagem',
      drag: 'Solte aqui para anexar a imagem',
    },
    hint: 'Aparece acima do título, ajustada à tela até 800 x 600 px.',
    replaceHint: 'Para trocar, solte outra imagem sobre ela ou clique nela.',
    details: '{{name}} · {{width}} x {{height}} px · {{size}}',
    savedDetails: 'Imagem salva · {{width}} x {{height}} px · {{size}}',
    issues: {
      type: 'Formato não aceito. Use PNG, JPG, JPEG ou WebP.',
      size: 'A imagem passa de 2 MB. Escolha um arquivo menor.',
      unreadable: 'Não foi possível ler a imagem. Escolha outro arquivo.',
    },
  },
  questions: {
    groupLabel: 'Pergunta {{number}}',
    number: 'Pergunta {{number}}',
    moveUp: 'Mover a pergunta {{number}} para cima',
    moveDown: 'Mover a pergunta {{number}} para baixo',
    remove: 'Remover a pergunta {{number}}',
    duplicate: 'Duplicar a pergunta {{number}}',
    drag: 'Arraste para reordenar',
    required: 'Obrigatória',
    title: 'Nome da pergunta',
    titlePlaceholder: 'Ex.: O que podemos melhorar?',
    fieldType: 'Tipo de campo',
    description: 'Descrição (opcional)',
    descriptionPlaceholder: 'Orientação exibida abaixo do nome da pergunta.',
    add: 'Adicionar pergunta',
  },
  options: {
    title: 'Opções de resposta',
    hints: {
      CHECKBOX: 'Quem responde pode marcar várias opções.',
      RADIO: 'Quem responde pode marcar apenas uma opção.',
      SELECT: 'Quem responde escolhe uma opção numa lista.',
    },
    groupLabel: 'Opções da pergunta {{number}}',
    label: 'Opção {{number}}',
    placeholder: 'Opção {{number}}',
    remove: 'Remover a opção {{number}}',
    add: 'Adicionar opção',
  },
  recipients: {
    legend: 'Grupos de e-mail destinatários',
    count_one: '{{count}} destinatário',
    count_other: '{{count}} destinatários',
    unavailable: {
      title: 'Grupos de e-mail indisponíveis',
      description: 'Não foi possível carregar os grupos de e-mail.',
    },
  },
  preview: {
    title: 'Pré-visualização',
    description: 'Assim o formulário aparece para quem vai responder.',
    close: 'Fechar pré-visualização',
    untitled: 'Formulário sem nome',
    untitledQuestion: 'Pergunta {{number}} sem nome',
    answerPlaceholder: 'Resposta',
    untitledOption: 'Opção {{number}}',
  },
} as const;

export const communication = {
  eyebrow: 'Comunicação',
  dashboard: {
    title: 'E-mails',
    subtitle: 'Grupos de destinatários e envios por e-mail.',
    cards: {
      groups: {
        title: 'Grupos de e-mails',
        description: 'Listas de contas que recebem os e-mails.',
        details_one: '{{count}} destinatário no total',
        details_other: '{{count}} destinatários no total',
        open: 'Abrir grupos',
      },
    },
  },
  actions: {
    retry: 'Tentar novamente',
    edit: 'Editar',
    delete: 'Excluir',
    menu: 'Mais ações',
    menuNamed: 'Ações do grupo {{name}}',
  },
  notices: {
    invalidData: {
      title: 'Dados recusados',
      description: 'Revise os campos marcados e tente novamente.',
    },
    conflict: {
      title: 'Não foi possível salvar',
      description: 'O grupo foi alterado por outra pessoa. Recarregue e tente de novo.',
    },
    notFound: {
      title: 'Grupo não encontrado',
      description: 'O grupo não existe mais ou foi excluído.',
    },
    accessDenied: {
      title: 'Acesso negado',
      description: 'Sua conta não tem permissão para gerenciar grupos de e-mails.',
    },
    unavailable: {
      title: 'Serviço indisponível',
      description: 'Não foi possível falar com o servidor. Tente novamente em instantes.',
    },
  },
  list: {
    back: 'Voltar para E-mails',
    title: 'Grupos de e-mails',
    subtitle: 'Escolha quais contas recebem cada tipo de comunicação, como os formulários.',
    create: 'Novo grupo',
    empty: 'Nenhum grupo de e-mails criado ainda.',
    recipientCount_one: '{{count}} destinatário',
    recipientCount_other: '{{count}} destinatários',
  },
  deleteDialog: {
    close: 'Fechar',
    title: 'Excluir grupo de e-mails',
    description:
      'O grupo "{{name}}" será excluído definitivamente. Formulários que o usam precisarão de outro grupo para serem salvos de novo.',
    cancel: 'Cancelar',
    confirm: 'Excluir',
    confirming: 'Excluindo…',
    success: {
      title: 'Grupo excluído',
      description: 'O grupo "{{name}}" foi excluído.',
    },
  },
  validation: {
    nameRequired: 'Informe o nome do grupo.',
    nameTooLong: 'Use no máximo 80 caracteres.',
    descriptionTooLong: 'Use no máximo 300 caracteres.',
    invalid: 'Valor recusado pelo servidor. Confira e tente novamente.',
  },
  editor: {
    back: 'Voltar para a lista',
    backToList: 'Voltar para a lista',
    createTitle: 'Novo grupo de e-mails',
    createSubtitle: 'Dê um nome ao grupo e escolha as contas que recebem os e-mails.',
    editTitle: 'Editar grupo de e-mails',
    sections: {
      general: {
        title: 'Dados do grupo',
        description: 'Nome e descrição exibidos ao escolher os destinatários de um formulário.',
      },
      recipients: {
        title: 'Destinatários',
        description:
          'Contas com e-mail verificado, membros ou não. Marque as contas e mova-as entre as listas, uma a uma ou todas de uma vez.',
      },
    },
    cancel: 'Cancelar',
    submit: 'Salvar grupo',
    submitting: 'Salvando…',
    success: {
      createTitle: 'Grupo criado',
      editTitle: 'Grupo atualizado',
      description: 'O grupo "{{name}}" foi salvo.',
    },
    invalid: {
      title: 'Revise o grupo',
      description: 'Há campos com problemas. Corrija os itens marcados e salve novamente.',
    },
  },
  fields: {
    name: 'Nome',
    namePlaceholder: 'Ex.: Líderes de célula',
    description: 'Descrição (opcional)',
    descriptionPlaceholder: 'Para que serve este grupo',
  },
  recipients: {
    available: 'Contas disponíveis',
    selected: 'No grupo',
    searchPlaceholder: 'Buscar por nome ou e-mail',
    searchLabel: 'Buscar em {{list}}',
    empty: 'Nenhuma conta nesta lista.',
    noMatches: 'Nenhuma conta encontrada.',
    count_one: '{{count}} conta',
    count_other: '{{count}} contas',
    filteredCount: '{{shown}} de {{total}}',
    addChecked: 'Adicionar marcadas',
    addAll: 'Adicionar todas',
    removeChecked: 'Remover marcadas',
    removeAll: 'Remover todas',
    memberBadge: 'Membro',
    unavailable: {
      title: 'Contas indisponíveis',
      description: 'Não foi possível carregar as contas que podem entrar no grupo.',
    },
    unavailableAccounts: {
      title: 'Contas que não recebem mais e-mails',
      description_one:
        '{{count}} conta do grupo foi suspensa ou deixou de ter e-mail verificado e não aparece nas listas.',
      description_other:
        '{{count}} contas do grupo foram suspensas ou deixaram de ter e-mail verificado e não aparecem nas listas.',
      remove: 'Tirar do grupo',
    },
  },
} as const;
