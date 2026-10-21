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
