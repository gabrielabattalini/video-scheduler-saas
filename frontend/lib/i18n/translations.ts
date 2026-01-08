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
      loading: "Загрузка...",
      error: "Ошибка",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      connect: "Подключить",
      disconnect: "Отключить",
      back: "Назад",
      next: "Далее",
      confirm: "Подтвердить",
    },
    navbar: {
      hello: "Привет",
      linkSocialNetworks: "Подключить соцсети",
      newPost: "+ Новый пост",
      logout: "Выйти",
    },
    login: {
      title: "Вход",
      email: "Email",
      password: "Пароль",
      login: "Войти",
      register: "Создать аккаунт",
      forgotPassword: "Забыли пароль?",
      continueWithGoogle: "Продолжить с Google",
      passwordMin: "Минимум 6 символов",
      or: "или",
    },
    dashboard: {
      title: "Панель",
      subtitle: "Управляйте постами и контентом",
      welcome: "С возвращением!",
      connectAccounts: "Подключите аккаунты",
      connectAccountsDescription: "Свяжите свои соцсети, чтобы начать публиковать.",
      connectedAccounts: "подключенных аккаунтов",
      noConnections: "Нет подключенных аккаунтов",
      manageConnections: "Управлять подключениями",
      stats: "Статистика",
      recentPosts: "Последние посты",
      noPosts: "Нет постов",
      createFirstPost: "Создайте свой первый пост",
      posts: "Посты",
      scheduled: "Запланировано",
      published: "Опубликовано",
      drafts: "Черновики",
    },
    connections: {
      title: "Подключения",
      subtitle: "Управляйте несколькими аккаунтами по рабочим группам",
      loading: "Загрузка подключений...",
      connected: "Подключено",
      connectedAs: "Подключено как",
      disconnect: "Отключить",
      connecting: "Подключение...",
      colorLabel: "Цвет",
      addAccount: "Добавить другой аккаунт",
      accountCount: "{count} подключенных аккаунтов",
      platformDescriptions: {
        youtube: "Публикуйте видео на YouTube",
        instagram: "Делитесь фото и видео в Instagram",
        tiktok: "Создавайте короткие видео в TikTok",
        facebook: "Публикуйте посты в Facebook",
        twitter: "Делитесь постами в X",
        kawai: "Подключайтесь к платформе Kawai",
      },
    },
    newPost: {
      title: "Новый пост",
      createPost: "Создать пост",
      selectPlatform: "Выберите платформу",
      content: "Контент",
      schedule: "Расписание",
      publishNow: "Опубликовать сейчас",
      scheduledFor: "Запланировано на",
      selectDate: "Выберите дату",
      selectTime: "Выберите время",
      addMedia: "Добавить медиа",
      postContent: "Содержимое поста",
      charactersRemaining: "символов осталось",
      saveDraft: "Сохранить черновик",
      publish: "Опубликовать",
    },
    workspaces: {
      confirmSwitchMessage: "Переключиться на {workspace}?",
      confirmSwitchTitle: "Выбрать рабочее пространство",
      choose: "Выберите рабочее пространство",
      active: "Активно",
      noWorkspaces: "Рабочие пространства не найдены",
      goManage: "Управлять рабочими пространствами",
      create: "Создать рабочее пространство",
      keepCurrent: "Оставить текущее",
      placeholder: "Название рабочего пространства",
    },
    landing: {
      heroTitle: "Планируйте и публикуйте видео",
      heroHighlight: "на нескольких платформах",
      heroSubtitle:
        "Полная платформа для планирования, редактирования и публикации видео на YouTube, TikTok, Instagram и других сервисах.",
      ctaPrimary: "Начать бесплатно",
      ctaSecondary: "Посмотреть возможности",
      noCard: "Начать сейчас",
      footerTagline: "Полная платформа для планирования и публикации видео.",
      footerTemplates: "Шаблоны",
    },
  },
  zh: {
    common: {
      loading: "加载中...",
      error: "错误",
      save: "保存",
      cancel: "取消",
      delete: "删除",
      edit: "编辑",
      connect: "连接",
      disconnect: "断开连接",
      back: "返回",
      next: "下一步",
      confirm: "确认",
    },
    navbar: {
      hello: "你好",
      linkSocialNetworks: "连接社交账号",
      newPost: "+ 新建帖子",
      logout: "退出",
    },
    login: {
      title: "登录",
      email: "邮箱",
      password: "密码",
      login: "登录",
      register: "注册",
      forgotPassword: "忘记密码？",
      continueWithGoogle: "使用 Google 继续",
      passwordMin: "至少 6 个字符",
      or: "或",
    },
    dashboard: {
      title: "仪表盘",
      subtitle: "管理你的帖子和内容",
      welcome: "欢迎回来！",
      connectAccounts: "连接账号",
      connectAccountsDescription: "绑定社交账号以开始发布。",
      connectedAccounts: "已连接账号",
      noConnections: "暂无连接",
      manageConnections: "管理连接",
      stats: "统计",
      recentPosts: "最近帖子",
      noPosts: "暂无帖子",
      createFirstPost: "创建你的第一个帖子",
      posts: "帖子",
      scheduled: "已计划",
      published: "已发布",
      drafts: "草稿",
    },
    connections: {
      title: "连接",
      subtitle: "按工作区管理多个账号",
      loading: "正在加载连接...",
      connected: "已连接",
      connectedAs: "连接身份",
      disconnect: "断开连接",
      connecting: "正在连接...",
      colorLabel: "颜色",
      addAccount: "添加其他账号",
      accountCount: "已连接 {count} 个账号",
      platformDescriptions: {
        youtube: "在 YouTube 发布视频",
        instagram: "在 Instagram 分享照片和视频",
        tiktok: "在 TikTok 创建短视频",
        facebook: "在 Facebook 发布帖子",
        twitter: "在 X 分享帖子",
        kawai: "连接到 Kawai 平台",
      },
    },
    newPost: {
      title: "新建帖子",
      createPost: "创建帖子",
      selectPlatform: "选择平台",
      content: "内容",
      schedule: "计划",
      publishNow: "立即发布",
      scheduledFor: "计划时间",
      selectDate: "选择日期",
      selectTime: "选择时间",
      addMedia: "添加媒体",
      postContent: "帖子内容",
      charactersRemaining: "剩余字符",
      saveDraft: "保存草稿",
      publish: "发布",
    },
    workspaces: {
      confirmSwitchMessage: "确定切换到 {workspace}？",
      confirmSwitchTitle: "选择工作区",
      choose: "请选择工作区",
      active: "已选择",
      noWorkspaces: "没有可用的工作区",
      goManage: "管理工作区",
      create: "创建工作区",
      keepCurrent: "保持当前",
      placeholder: "输入工作区名称",
    },
    landing: {
      heroTitle: "安排并发布视频",
      heroHighlight: "在多个平台",
      heroSubtitle:
        "一体化平台，支持在 YouTube、TikTok、Instagram 等平台安排、编辑并发布视频。",
      ctaPrimary: "免费开始",
      ctaSecondary: "查看功能",
      noCard: "立即开始",
      footerTagline: "一站式视频安排与发布平台。",
      footerTemplates: "模板",
    },
  },
};
