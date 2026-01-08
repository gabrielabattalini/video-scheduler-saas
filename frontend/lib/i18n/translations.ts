export type Language = 'pt' | 'en' | 'ru' | 'zh';

export interface Translations {
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    connect: string;
    disconnect: string;
    back: string;
    next: string;
    confirm: string;
  };
  navbar: {
    hello: string;
    linkSocialNetworks: string;
    newPost: string;
    logout: string;
  };
  login: {
    title: string;
    email: string;
    password: string;
    login: string;
    register: string;
    forgotPassword: string;
    continueWithGoogle: string;
    passwordMin: string;
    or: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    welcome: string;
    connectAccounts: string;
    connectAccountsDescription: string;
    connectedAccounts: string;
    noConnections: string;
    manageConnections: string;
    stats: string;
    recentPosts: string;
    noPosts: string;
    createFirstPost: string;
    posts: string;
    scheduled: string;
    published: string;
    drafts: string;
  };
  connections: {
    title: string;
    subtitle: string;
    loading: string;
    connected: string;
    connectedAs: string;
    disconnect: string;
    connecting: string;
    colorLabel: string;
    addAccount: string;
    accountCount: string;
    platformDescriptions: {
      youtube: string;
      instagram: string;
      tiktok: string;
      facebook: string;
      twitter: string;
      kawai: string;
    };
  };
  newPost: {
    title: string;
    createPost: string;
    selectPlatform: string;
    content: string;
    schedule: string;
    publishNow: string;
    scheduledFor: string;
    selectDate: string;
    selectTime: string;
    addMedia: string;
    postContent: string;
    charactersRemaining: string;
    saveDraft: string;
    publish: string;
  };
  workspaces: {
    confirmSwitchMessage: string;
    confirmSwitchTitle: string;
    choose: string;
    active: string;
    noWorkspaces: string;
    goManage: string;
    create: string;
    keepCurrent: string;
    placeholder: string;
  };
  landing: {
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    noCard: string;
    footerTagline: string;
    footerTemplates: string;
  };
}

const english: Translations = {
  common: {
    loading: "Loading...",
    error: "Error",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    connect: "Connect",
    disconnect: "Disconnect",
    back: "Back",
    next: "Next",
    confirm: "Confirm",
  },
  navbar: {
    hello: "Hello",
    linkSocialNetworks: "Link Social Networks",
    newPost: "+ New Post",
    logout: "Logout",
  },
  login: {
    title: "Login",
    email: "Email",
    password: "Password",
    login: "Sign In",
    register: "Sign Up",
    forgotPassword: "Forgot password?",
    continueWithGoogle: "Continue with Google",
    passwordMin: "Minimum 6 characters",
    or: "or",
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Manage your posts and content",
    welcome: "Welcome back!",
    connectAccounts: "Connect accounts",
    connectAccountsDescription: "Link your social profiles to start publishing.",
    connectedAccounts: "connected account(s)",
    noConnections: "No connections yet",
    manageConnections: "Manage connections",
    stats: "Statistics",
    recentPosts: "Recent Posts",
    noPosts: "No posts found",
    createFirstPost: "Create your first post",
    posts: "Posts",
    scheduled: "Scheduled",
    published: "Published",
    drafts: "Drafts",
  },
  connections: {
    title: "Connections",
    subtitle: "Manage multiple accounts grouped by workspace",
    loading: "Loading connections...",
    connected: "Connected",
    connectedAs: "Connected as",
    disconnect: "Disconnect",
    connecting: "Connecting...",
    colorLabel: "Color",
    addAccount: "Add another account",
    accountCount: "{count} connected account(s)",
    platformDescriptions: {
      youtube: "Publish videos on YouTube",
      instagram: "Share photos and videos on Instagram",
      tiktok: "Create short videos on TikTok",
      facebook: "Publish posts on Facebook",
      twitter: "Share posts on X",
      kawai: "Connect with the Kawai platform",
    },
  },
  newPost: {
    title: "New Post",
    createPost: "Create Post",
    selectPlatform: "Select platform",
    content: "Content",
    schedule: "Schedule",
    publishNow: "Publish Now",
    scheduledFor: "Scheduled for",
    selectDate: "Select date",
    selectTime: "Select time",
    addMedia: "Add Media",
    postContent: "Post Content",
    charactersRemaining: "characters remaining",
    saveDraft: "Save Draft",
    publish: "Publish",
  },
  workspaces: {
    confirmSwitchMessage: "Are you sure you want to switch to {workspace}?",
    confirmSwitchTitle: "Select workspace",
    choose: "Choose a workspace",
    active: "Active",
    noWorkspaces: "No workspaces found",
    goManage: "Manage workspaces",
    create: "Create workspace",
    keepCurrent: "Keep current",
    placeholder: "Workspace name",
  },
  landing: {
    heroTitle: "Schedule and publish videos",
    heroHighlight: "across multiple platforms",
    heroSubtitle:
      "The complete platform for scheduling, editing, and publishing videos on YouTube, TikTok, Instagram and more. Everything you need in one place.",
    ctaPrimary: "Start for free",
    ctaSecondary: "See features",
    noCard: "Start now",
    footerTagline: "The complete platform for scheduling and publishing videos.",
    footerTemplates: "Templates",
  },
};

export const translations: Record<Language, Translations> = {
  en: english,
  pt: {
    common: {
      loading: "Carregando...",
      error: "Erro",
      save: "Salvar",
      cancel: "Cancelar",
      delete: "Excluir",
      edit: "Editar",
      connect: "Conectar",
      disconnect: "Desconectar",
      back: "Voltar",
      next: "Próximo",
      confirm: "Confirmar",
    },
    navbar: {
      hello: "Olá",
      linkSocialNetworks: "Vincular Redes Sociais",
      newPost: "+ Novo Post",
      logout: "Sair",
    },
    login: {
      title: "Entrar",
      email: "E-mail",
      password: "Senha",
      login: "Entrar",
      register: "Cadastrar",
      forgotPassword: "Esqueceu a senha?",
      continueWithGoogle: "Continuar com Google",
      passwordMin: "Mínimo de 6 caracteres",
      or: "ou",
    },
    dashboard: {
      title: "Painel",
      subtitle: "Gerencie seus posts e conteúdo",
      welcome: "Bem-vindo de volta!",
      connectAccounts: "Conectar contas",
      connectAccountsDescription: "Vincule suas redes sociais para começar a publicar.",
      connectedAccounts: "conta(s) conectada(s)",
      noConnections: "Nenhuma conexão",
      manageConnections: "Gerenciar conexões",
      stats: "Estatísticas",
      recentPosts: "Posts Recentes",
      noPosts: "Nenhum post encontrado",
      createFirstPost: "Crie seu primeiro post",
      posts: "Posts",
      scheduled: "Agendados",
      published: "Publicados",
      drafts: "Rascunhos",
    },
    connections: {
      title: "Conexões",
      subtitle: "Gerencie múltiplas contas organizadas por grupos de trabalho",
      loading: "Carregando conexões...",
      connected: "Conectado",
      connectedAs: "Conectado como",
      disconnect: "Desconectar",
      connecting: "Conectando...",
      colorLabel: "Cor",
      addAccount: "Adicionar outra conta",
      accountCount: "{count} conta(s) conectada(s)",
      platformDescriptions: {
        youtube: "Publique vídeos no YouTube",
        instagram: "Compartilhe fotos e vídeos no Instagram",
        tiktok: "Crie vídeos curtos no TikTok",
        facebook: "Publique posts no Facebook",
        twitter: "Compartilhe posts no X",
        kawai: "Conecte-se com a plataforma Kawai",
      },
    },
    newPost: {
      title: "Novo Post",
      createPost: "Criar post",
      selectPlatform: "Selecione a plataforma",
      content: "Conteúdo",
      schedule: "Agendar",
      publishNow: "Publicar agora",
      scheduledFor: "Agendado para",
      selectDate: "Selecione a data",
      selectTime: "Selecione a hora",
      addMedia: "Adicionar mídia",
      postContent: "Conteúdo do post",
      charactersRemaining: "caracteres restantes",
      saveDraft: "Salvar rascunho",
      publish: "Publicar",
    },
    workspaces: {
      confirmSwitchMessage: "Tem certeza de que deseja alternar para {workspace}?",
      confirmSwitchTitle: "Selecionar workspace",
      choose: "Escolha um workspace",
      active: "Ativo",
      noWorkspaces: "Nenhum workspace encontrado",
      goManage: "Gerenciar workspaces",
      create: "Criar workspace",
      keepCurrent: "Manter atual",
      placeholder: "Nome do workspace",
    },
    landing: {
      heroTitle: "Agende e publique vídeos",
      heroHighlight: "em múltiplas plataformas",
      heroSubtitle:
        "A plataforma completa para agendar, editar e publicar vídeos no YouTube, TikTok, Instagram e mais. Tudo em um só lugar.",
      ctaPrimary: "Comece grátis",
      ctaSecondary: "Ver recursos",
      noCard: "Comece agora",
      footerTagline: "A plataforma completa para agendamento e publicação de vídeos.",
      footerTemplates: "Modelos",
    },
  },
  ru: {
    common: {
      loading: "�-аг�?�fзка...",
      error: "�z�^ибка",
      save: "Со�.�?ани�,�O",
      cancel: "�z�,мени�,�O",
      delete: "Удали�,�O",
      edit: "Редак�,и�?ова�,�O",
      connect: "�Yодкл�Z�?и�,�O",
      disconnect: "�z�,кл�Z�?и�,�O",
      back: "Назад",
      next: "�"алее",
      confirm: "�Yод�,ве�?ди�,�O",
    },
    navbar: {
      hello: "�Y�?иве�,",
      linkSocialNetworks: "�Yодкл�Z�?и�,�O со�?се�,и",
      newPost: "+ Нов�<й пос�,",
      logout: "�'�<й�,и",
    },
    login: {
      title: "�'�.од",
      email: "Email",
      password: "�Yа�?ол�O",
      login: "�'ой�,и",
      register: "Созда�,�O акка�fн�,",
      forgotPassword: "�-аб�<ли па�?ол�O?",
      continueWithGoogle: "�Y�?одолжи�,�O с Google",
      passwordMin: "�oиним�fм 6 символов",
      or: "или",
    },
    dashboard: {
      title: "�Yанел�O",
      subtitle: "Уп�?авляй�,е пос�,ами и кон�,ен�,ом",
      welcome: "Рад�< виде�,�O снова!",
      connectAccounts: "?????????? ????????",
      connectAccountsDescription: "??????? ???? ???????, ????? ?????? ???????????.",
      connectedAccounts: "???????????? ?????????",
      noConnections: "??? ???????????? ?????????",
      manageConnections: "????????? ?????????????",
      stats: "С�,а�,ис�,ика",
      recentPosts: "Недавние пос�,�<",
      noPosts: "Не�, пос�,ов",
      createFirstPost: "Создай�,е пе�?в�<й пос�,",
      posts: "�Yос�,�<",
      scheduled: "�-аплани�?ованн�<е",
      published: "�zп�fбликованн�<е",
      drafts: "Че�?новики",
    },
    connections: {
      title: "�Yодкл�Z�?ения",
      subtitle: "Уп�?авляй�,е нескол�Oкими акка�fн�,ами по �?або�?им г�?�fппам",
      loading: "�-аг�?�fжаем подкл�Z�?ения...",
      connected: "�Yодкл�Z�?ено",
      connectedAs: "�Yодкл�Z�?ено как",
      disconnect: "�z�,кл�Z�?и�,�O",
      connecting: "�Yодкл�Z�?аем...",
      colorLabel: "Цве�,",
      addAccount: "�"обави�,�O е�?е акка�fн�,",
      accountCount: "{count} подкл�Z�?енн�<�. акка�fн�,ов",
      platformDescriptions: {
        youtube: "�Y�fблик�fй�,е видео на YouTube",
        instagram: "�"ели�,ес�O �"о�,о и видео в Instagram",
        tiktok: "Создавай�,е ко�?о�,кие видео в TikTok",
        facebook: "�Y�fблик�fй�,е пос�,�< в Facebook",
        twitter: "�"ели�,ес�O пос�,ами в X",
        kawai: "�Yодкл�Z�?и�,ес�O к пла�,�"о�?ме Kawai",
      },
    },
    newPost: {
      title: "Нов�<й пос�,",
      createPost: "Созда�,�O пос�,",
      selectPlatform: "�'�<бе�?и�,е пла�,�"о�?м�f",
      content: "�sон�,ен�,",
      schedule: "�-аплани�?ова�,�O",
      publishNow: "�zп�fбликова�,�O сей�?ас",
      scheduledFor: "�-аплани�?овано на",
      selectDate: "�'�<бе�?и�,е да�,�f",
      selectTime: "�'�<бе�?и�,е в�?емя",
      addMedia: "�"обави�,�O медиа",
      postContent: "Соде�?жимое пос�,а",
      charactersRemaining: "символов ос�,алос�O",
      saveDraft: "Со�.�?ани�,�O �?е�?новик",
      publish: "�zп�fбликова�,�O",
    },
    workspaces: {
      confirmSwitchMessage: "�Yе�?екл�Z�?и�,�Oся на {workspace}?",
      confirmSwitchTitle: "�'�<б�?а�,�O workspace",
      choose: "�'�<бе�?и�,е workspace",
      active: "Ак�,ивн�<й",
      noWorkspaces: "Рабо�?ие п�?ос�,�?анс�,ва не найден�<",
      goManage: "Уп�?авля�,�O workspaces",
      create: "Созда�,�O workspace",
      keepCurrent: "�zс�,ави�,�O �,ек�f�?ий",
      placeholder: "Название �?або�?его п�?ос�,�?анс�,ва",
    },
    landing: {
      heroTitle: "�Yлани�?�fй�,е и п�fблик�fй�,е видео",
      heroHighlight: "на нескол�Oки�. пла�,�"о�?ма�.",
      heroSubtitle:
        "�Yолная пла�,�"о�?ма для плани�?ования, �?едак�,и�?ования и п�fблика�?ии видео на YouTube, TikTok, Instagram и д�?�fги�..",
      ctaPrimary: "На�?а�,�O беспла�,но",
      ctaSecondary: "�Yосмо�,�?е�,�O возможнос�,и",
      noCard: "На�?а�,�O сей�?ас",
      footerTagline: "�Yолная пла�,�"о�?ма для плани�?ования и п�fблика�?ии видео.",
      footerTemplates: "Шаблон�<",
    },
  },
  zh: {
    common: {
      loading: "�S�载中...",
      error: "�"T误",
      save: "保�~",
      cancel: "�-�^",
      delete: "�^��T�",
      edit: "�-�'",
      connect: "�z�Z�",
      disconnect: "�-��?�z�Z�",
      back: "�"�>z",
      next: "�<�?步",
      confirm: "确认",
    },
    navbar: {
      hello: "你好",
      linkSocialNetworks: "�z�Z�社交账号",
      newPost: "+ �-�建�-子",
      logout: "�??�?�",
    },
    login: {
      title: "�T��.",
      email: "�,�箱",
      password: "�?码",
      login: "�T��.",
      register: "注�?O",
      forgotPassword: "�~记�?码�Y",
      continueWithGoogle: "使�"� Google 继续",
      passwordMin: "�?��' 6 个�-符",
      or: "�^-",
    },
    dashboard: {
      title: "仪表�>~",
      subtitle: "管�?你�s"�-子�'O�?.容",
      welcome: "欢�Z�>z来！",
      connectAccounts: "????",
      connectAccountsDescription: "????????????",
      connectedAccounts: "?????",
      noConnections: "????",
      manageConnections: "????",
      stats: "�Y计",
      recentPosts: "�o?�-��-子",
      noPosts: "没�o?�-子",
      createFirstPost: "�^>建你�s"第�?个�-子",
      posts: "�-子",
      scheduled: "已计�^'",
      published: "已�'�f",
      drafts: "�?稿",
    },
    connections: {
      title: "�z�Z�",
      subtitle: "�O?工�o�O�管�?�s个账号",
      loading: "正�o��S�载�z�Z�...",
      connected: "已�z�Z�",
      connectedAs: "�z�Z�身份",
      disconnect: "�-��?�z�Z�",
      connecting: "正�o��z�Z�...",
      colorLabel: "�o�?�",
      addAccount: "添�S��.��-账号",
      accountCount: "已�z�Z� {count} 个账号",
      platformDescriptions: {
        youtube: "�o� YouTube �'�f�?�'",
        instagram: "�o� Instagram �^?享�.��??�'O�?�'",
        tiktok: "�o� TikTok �^>建�Y��?�'",
        facebook: "�o� Facebook �'�f�-子",
        twitter: "�o� X �^?享�-子",
        kawai: "�z�Z��^� Kawai 平台",
      },
    },
    newPost: {
      title: "�-�建�-子",
      createPost: "�^>建�-子",
      selectPlatform: "�??�<�平台",
      content: "�?.容",
      schedule: "计�^'",
      publishNow: "�<即�'�f",
      scheduledFor: "计�^'�-��-�",
      selectDate: "�??�<��-��oY",
      selectTime: "�??�<��-��-�",
      addMedia: "添�S��'�"",
      postContent: "�-子�?.容",
      charactersRemaining: "�?��T�-符",
      saveDraft: "保�~�?稿",
      publish: "�'�f",
    },
    workspaces: {
      confirmSwitchMessage: "确�s�^?换�^� {workspace}�Y",
      confirmSwitchTitle: "�??�<�工�o�O�",
      choose: "请�??�<�工�o�O�",
      active: "已�??�<�",
      noWorkspaces: "没�o?可�"��s"工�o�O�",
      goManage: "管�?工�o�O�",
      create: "�^>建工�o�O�",
      keepCurrent: "保�O��"�?�",
      placeholder: "�"�.�工�o�O�名称",
    },
    landing: {
      heroTitle: "�?�Z'并�'�f�?�'",
      heroHighlight: "�^��s个平台",
      heroSubtitle:
        "�o� YouTube�?�TikTok�?�Instagram �?平台�S�?�Z'�?��-�'�'O�'�f�?�'�s"�?�"�O-平台�?,",
      ctaPrimary: "�.�费�?�<",
      ctaSecondary: "�Y��o<�SY�f�",
      noCard: "�<即�?�<",
      footerTagline: "�?�T式�?�'�?�Z'�'O�'�f平台�?,",
      footerTemplates: "模板",
    },
  },
};






