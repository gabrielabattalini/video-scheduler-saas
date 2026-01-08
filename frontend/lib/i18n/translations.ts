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
      next: "PrÃ³ximo",
      confirm: "Confirmar",
    },
    navbar: {
      hello: "OlÃ¡",
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
      passwordMin: "MÃ­nimo de 6 caracteres",
      or: "ou",
    },
    dashboard: {
      title: "Painel",
      subtitle: "Gerencie seus posts e conteÃºdo",
      welcome: "Bem-vindo de volta!",
      connectAccounts: "Conectar contas",
      connectAccountsDescription: "Vincule suas redes sociais para começar a publicar.",
      stats: "EstatÃ­sticas",
      recentPosts: "Posts Recentes",
      noPosts: "Nenhum post encontrado",
      createFirstPost: "Crie seu primeiro post",
      posts: "Posts",
      scheduled: "Agendados",
      published: "Publicados",
      drafts: "Rascunhos",
    },
    connections: {
      title: "ConexÃµes",
      subtitle: "Gerencie mÃºltiplas contas organizadas por grupos de trabalho",
      loading: "Carregando conexÃµes...",
      connected: "Conectado",
      connectedAs: "Conectado como",
      disconnect: "Desconectar",
      connecting: "Conectando...",
      colorLabel: "Cor",
      addAccount: "Adicionar outra conta",
      accountCount: "{count} conta(s) conectada(s)",
      platformDescriptions: {
        youtube: "Publique vÃ­deos no YouTube",
        instagram: "Compartilhe fotos e vÃ­deos no Instagram",
        tiktok: "Crie vÃ­deos curtos no TikTok",
        facebook: "Publique posts no Facebook",
        twitter: "Compartilhe posts no X",
        kawai: "Conecte-se com a plataforma Kawai",
      },
    },
    newPost: {
      title: "Novo Post",
      createPost: "Criar post",
      selectPlatform: "Selecione a plataforma",
      content: "ConteÃºdo",
      schedule: "Agendar",
      publishNow: "Publicar agora",
      scheduledFor: "Agendado para",
      selectDate: "Selecione a data",
      selectTime: "Selecione a hora",
      addMedia: "Adicionar mÃ­dia",
      postContent: "ConteÃºdo do post",
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
      heroTitle: "Agende e publique vÃ­deos",
      heroHighlight: "em mÃºltiplas plataformas",
      heroSubtitle:
        "A plataforma completa para agendar, editar e publicar vÃ­deos no YouTube, TikTok, Instagram e mais. Tudo em um sÃ³ lugar.",
      ctaPrimary: "Comece grÃ¡tis",
      ctaSecondary: "Ver recursos",
      noCard: "Comece agora",
      footerTagline: "A plataforma completa para agendamento e publicaÃ§Ã£o de vÃ­deos.",
      footerTemplates: "Modelos",
    },
  },
  ru: {
    common: {
      loading: "Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ°...",
      error: "ÐžÑˆÐ¸Ð±ÐºÐ°",
      save: "Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ",
      cancel: "ÐžÑ‚Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ",
      delete: "Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ",
      edit: "Ð ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ",
      connect: "ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ",
      disconnect: "ÐžÑ‚ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ",
      back: "ÐÐ°Ð·Ð°Ð´",
      next: "Ð”Ð°Ð»ÐµÐµ",
      confirm: "ÐŸÐ¾Ð´Ñ‚Ð²ÐµÑ€Ð´Ð¸Ñ‚ÑŒ",
    },
    navbar: {
      hello: "ÐŸÑ€Ð¸Ð²ÐµÑ‚",
      linkSocialNetworks: "ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ ÑÐ¾Ñ†ÑÐµÑ‚Ð¸",
      newPost: "+ ÐÐ¾Ð²Ñ‹Ð¹ Ð¿Ð¾ÑÑ‚",
      logout: "Ð’Ñ‹Ð¹Ñ‚Ð¸",
    },
    login: {
      title: "Ð’Ñ…Ð¾Ð´",
      email: "Email",
      password: "ÐŸÐ°Ñ€Ð¾Ð»ÑŒ",
      login: "Ð’Ð¾Ð¹Ñ‚Ð¸",
      register: "Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚",
      forgotPassword: "Ð—Ð°Ð±Ñ‹Ð»Ð¸ Ð¿Ð°Ñ€Ð¾Ð»ÑŒ?",
      continueWithGoogle: "ÐŸÑ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚ÑŒ Ñ Google",
      passwordMin: "ÐœÐ¸Ð½Ð¸Ð¼ÑƒÐ¼ 6 ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²",
      or: "Ð¸Ð»Ð¸",
    },
    dashboard: {
      title: "ÐŸÐ°Ð½ÐµÐ»ÑŒ",
      subtitle: "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÐ¹Ñ‚Ðµ Ð¿Ð¾ÑÑ‚Ð°Ð¼Ð¸ Ð¸ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð¾Ð¼",
      welcome: "Ð Ð°Ð´Ñ‹ Ð²Ð¸Ð´ÐµÑ‚ÑŒ ÑÐ½Ð¾Ð²Ð°!",
      connectAccounts: "Подключите аккаунты",
      connectAccountsDescription: "Свяжите свои соцсети, чтобы начать публиковать.",
      stats: "Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ°",
      recentPosts: "ÐÐµÐ´Ð°Ð²Ð½Ð¸Ðµ Ð¿Ð¾ÑÑ‚Ñ‹",
      noPosts: "ÐÐµÑ‚ Ð¿Ð¾ÑÑ‚Ð¾Ð²",
      createFirstPost: "Ð¡Ð¾Ð·Ð´Ð°Ð¹Ñ‚Ðµ Ð¿ÐµÑ€Ð²Ñ‹Ð¹ Ð¿Ð¾ÑÑ‚",
      posts: "ÐŸÐ¾ÑÑ‚Ñ‹",
      scheduled: "Ð—Ð°Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ",
      published: "ÐžÐ¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½Ð½Ñ‹Ðµ",
      drafts: "Ð§ÐµÑ€Ð½Ð¾Ð²Ð¸ÐºÐ¸",
    },
    connections: {
      title: "ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ",
      subtitle: "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÐ¹Ñ‚Ðµ Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¸Ð¼Ð¸ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°Ð¼Ð¸ Ð¿Ð¾ Ñ€Ð°Ð±Ð¾Ñ‡Ð¸Ð¼ Ð³Ñ€ÑƒÐ¿Ð¿Ð°Ð¼",
      loading: "Ð—Ð°Ð³Ñ€ÑƒÐ¶Ð°ÐµÐ¼ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ...",
      connected: "ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¾",
      connectedAs: "ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð¾ ÐºÐ°Ðº",
      disconnect: "ÐžÑ‚ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ",
      connecting: "ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡Ð°ÐµÐ¼...",
      colorLabel: "Ð¦Ð²ÐµÑ‚",
      addAccount: "Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ ÐµÑ‰Ðµ Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚",
      accountCount: "{count} Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð½Ñ‹Ñ… Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð¾Ð²",
      platformDescriptions: {
        youtube: "ÐŸÑƒÐ±Ð»Ð¸ÐºÑƒÐ¹Ñ‚Ðµ Ð²Ð¸Ð´ÐµÐ¾ Ð½Ð° YouTube",
        instagram: "Ð”ÐµÐ»Ð¸Ñ‚ÐµÑÑŒ Ñ„Ð¾Ñ‚Ð¾ Ð¸ Ð²Ð¸Ð´ÐµÐ¾ Ð² Instagram",
        tiktok: "Ð¡Ð¾Ð·Ð´Ð°Ð²Ð°Ð¹Ñ‚Ðµ ÐºÐ¾Ñ€Ð¾Ñ‚ÐºÐ¸Ðµ Ð²Ð¸Ð´ÐµÐ¾ Ð² TikTok",
        facebook: "ÐŸÑƒÐ±Ð»Ð¸ÐºÑƒÐ¹Ñ‚Ðµ Ð¿Ð¾ÑÑ‚Ñ‹ Ð² Facebook",
        twitter: "Ð”ÐµÐ»Ð¸Ñ‚ÐµÑÑŒ Ð¿Ð¾ÑÑ‚Ð°Ð¼Ð¸ Ð² X",
        kawai: "ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÐµÑÑŒ Ðº Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ðµ Kawai",
      },
    },
    newPost: {
      title: "ÐÐ¾Ð²Ñ‹Ð¹ Ð¿Ð¾ÑÑ‚",
      createPost: "Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ Ð¿Ð¾ÑÑ‚",
      selectPlatform: "Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñƒ",
      content: "ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚",
      schedule: "Ð—Ð°Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ",
      publishNow: "ÐžÐ¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ñ‚ÑŒ ÑÐµÐ¹Ñ‡Ð°Ñ",
      scheduledFor: "Ð—Ð°Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¾ Ð½Ð°",
      selectDate: "Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð´Ð°Ñ‚Ñƒ",
      selectTime: "Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð²Ñ€ÐµÐ¼Ñ",
      addMedia: "Ð”Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ Ð¼ÐµÐ´Ð¸Ð°",
      postContent: "Ð¡Ð¾Ð´ÐµÑ€Ð¶Ð¸Ð¼Ð¾Ðµ Ð¿Ð¾ÑÑ‚Ð°",
      charactersRemaining: "ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð² Ð¾ÑÑ‚Ð°Ð»Ð¾ÑÑŒ",
      saveDraft: "Ð¡Ð¾Ñ…Ñ€Ð°Ð½Ð¸Ñ‚ÑŒ Ñ‡ÐµÑ€Ð½Ð¾Ð²Ð¸Ðº",
      publish: "ÐžÐ¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ñ‚ÑŒ",
    },
    workspaces: {
      confirmSwitchMessage: "ÐŸÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒÑÑ Ð½Ð° {workspace}?",
      confirmSwitchTitle: "Ð’Ñ‹Ð±Ñ€Ð°Ñ‚ÑŒ workspace",
      choose: "Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ workspace",
      active: "ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ð¹",
      noWorkspaces: "Ð Ð°Ð±Ð¾Ñ‡Ð¸Ðµ Ð¿Ñ€Ð¾ÑÑ‚Ñ€Ð°Ð½ÑÑ‚Ð²Ð° Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ñ‹",
      goManage: "Ð£Ð¿Ñ€Ð°Ð²Ð»ÑÑ‚ÑŒ workspaces",
      create: "Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ workspace",
      keepCurrent: "ÐžÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹",
      placeholder: "ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ Ñ€Ð°Ð±Ð¾Ñ‡ÐµÐ³Ð¾ Ð¿Ñ€Ð¾ÑÑ‚Ñ€Ð°Ð½ÑÑ‚Ð²Ð°",
    },
    landing: {
      heroTitle: "ÐŸÐ»Ð°Ð½Ð¸Ñ€ÑƒÐ¹Ñ‚Ðµ Ð¸ Ð¿ÑƒÐ±Ð»Ð¸ÐºÑƒÐ¹Ñ‚Ðµ Ð²Ð¸Ð´ÐµÐ¾",
      heroHighlight: "Ð½Ð° Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¸Ñ… Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð°Ñ…",
      heroSubtitle:
        "ÐŸÐ¾Ð»Ð½Ð°Ñ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð° Ð´Ð»Ñ Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ, Ñ€ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸ Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ†Ð¸Ð¸ Ð²Ð¸Ð´ÐµÐ¾ Ð½Ð° YouTube, TikTok, Instagram Ð¸ Ð´Ñ€ÑƒÐ³Ð¸Ñ….",
      ctaPrimary: "ÐÐ°Ñ‡Ð°Ñ‚ÑŒ Ð±ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ð¾",
      ctaSecondary: "ÐŸÐ¾ÑÐ¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸",
      noCard: "ÐÐ°Ñ‡Ð°Ñ‚ÑŒ ÑÐµÐ¹Ñ‡Ð°Ñ",
      footerTagline: "ÐŸÐ¾Ð»Ð½Ð°Ñ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð° Ð´Ð»Ñ Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸ Ð¿ÑƒÐ±Ð»Ð¸ÐºÐ°Ñ†Ð¸Ð¸ Ð²Ð¸Ð´ÐµÐ¾.",
      footerTemplates: "Ð¨Ð°Ð±Ð»Ð¾Ð½Ñ‹",
    },
  },
  zh: {
    common: {
      loading: "åŠ è½½ä¸­...",
      error: "é”™è¯¯",
      save: "ä¿å­˜",
      cancel: "å–æ¶ˆ",
      delete: "åˆ é™¤",
      edit: "ç¼–è¾‘",
      connect: "è¿žæŽ¥",
      disconnect: "æ–­å¼€è¿žæŽ¥",
      back: "è¿”å›ž",
      next: "ä¸‹ä¸€æ­¥",
      confirm: "ç¡®è®¤",
    },
    navbar: {
      hello: "ä½ å¥½",
      linkSocialNetworks: "è¿žæŽ¥ç¤¾äº¤è´¦å·",
      newPost: "+ æ–°å»ºå¸–å­",
      logout: "é€€å‡º",
    },
    login: {
      title: "ç™»å½•",
      email: "é‚®ç®±",
      password: "å¯†ç ",
      login: "ç™»å½•",
      register: "æ³¨å†Œ",
      forgotPassword: "å¿˜è®°å¯†ç ï¼Ÿ",
      continueWithGoogle: "ä½¿ç”¨ Google ç»§ç»­",
      passwordMin: "è‡³å°‘ 6 ä¸ªå­—ç¬¦",
      or: "æˆ–",
    },
    dashboard: {
      title: "ä»ªè¡¨ç›˜",
      subtitle: "ç®¡ç†ä½ çš„å¸–å­å’Œå†…å®¹",
      welcome: "æ¬¢è¿Žå›žæ¥ï¼",
      connectAccounts: "连接账号",
      connectAccountsDescription: "绑定社交账号以开始发布。",
      stats: "ç»Ÿè®¡",
      recentPosts: "æœ€æ–°å¸–å­",
      noPosts: "æ²¡æœ‰å¸–å­",
      createFirstPost: "åˆ›å»ºä½ çš„ç¬¬ä¸€ä¸ªå¸–å­",
      posts: "å¸–å­",
      scheduled: "å·²è®¡åˆ’",
      published: "å·²å‘å¸ƒ",
      drafts: "è‰ç¨¿",
    },
    connections: {
      title: "è¿žæŽ¥",
      subtitle: "æŒ‰å·¥ä½œåŒºç®¡ç†å¤šä¸ªè´¦å·",
      loading: "æ­£åœ¨åŠ è½½è¿žæŽ¥...",
      connected: "å·²è¿žæŽ¥",
      connectedAs: "è¿žæŽ¥èº«ä»½",
      disconnect: "æ–­å¼€è¿žæŽ¥",
      connecting: "æ­£åœ¨è¿žæŽ¥...",
      colorLabel: "é¢œè‰²",
      addAccount: "æ·»åŠ å…¶ä»–è´¦å·",
      accountCount: "å·²è¿žæŽ¥ {count} ä¸ªè´¦å·",
      platformDescriptions: {
        youtube: "åœ¨ YouTube å‘å¸ƒè§†é¢‘",
        instagram: "åœ¨ Instagram åˆ†äº«ç…§ç‰‡å’Œè§†é¢‘",
        tiktok: "åœ¨ TikTok åˆ›å»ºçŸ­è§†é¢‘",
        facebook: "åœ¨ Facebook å‘å¸ƒå¸–å­",
        twitter: "åœ¨ X åˆ†äº«å¸–å­",
        kawai: "è¿žæŽ¥åˆ° Kawai å¹³å°",
      },
    },
    newPost: {
      title: "æ–°å»ºå¸–å­",
      createPost: "åˆ›å»ºå¸–å­",
      selectPlatform: "é€‰æ‹©å¹³å°",
      content: "å†…å®¹",
      schedule: "è®¡åˆ’",
      publishNow: "ç«‹å³å‘å¸ƒ",
      scheduledFor: "è®¡åˆ’æ—¶é—´",
      selectDate: "é€‰æ‹©æ—¥æœŸ",
      selectTime: "é€‰æ‹©æ—¶é—´",
      addMedia: "æ·»åŠ åª’ä½“",
      postContent: "å¸–å­å†…å®¹",
      charactersRemaining: "å‰©ä½™å­—ç¬¦",
      saveDraft: "ä¿å­˜è‰ç¨¿",
      publish: "å‘å¸ƒ",
    },
    workspaces: {
      confirmSwitchMessage: "ç¡®å®šåˆ‡æ¢åˆ° {workspace}ï¼Ÿ",
      confirmSwitchTitle: "é€‰æ‹©å·¥ä½œåŒº",
      choose: "è¯·é€‰æ‹©å·¥ä½œåŒº",
      active: "å·²é€‰æ‹©",
      noWorkspaces: "æ²¡æœ‰å¯ç”¨çš„å·¥ä½œåŒº",
      goManage: "ç®¡ç†å·¥ä½œåŒº",
      create: "åˆ›å»ºå·¥ä½œåŒº",
      keepCurrent: "ä¿æŒå½“å‰",
      placeholder: "è¾“å…¥å·¥ä½œåŒºåç§°",
    },
    landing: {
      heroTitle: "å®‰æŽ’å¹¶å‘å¸ƒè§†é¢‘",
      heroHighlight: "åˆ°å¤šä¸ªå¹³å°",
      heroSubtitle:
        "åœ¨ YouTubeã€TikTokã€Instagram ç­‰å¹³å°ä¸Šå®‰æŽ’ã€ç¼–è¾‘å’Œå‘å¸ƒè§†é¢‘çš„ä¸€ä½“åŒ–å¹³å°ã€‚",
      ctaPrimary: "å…è´¹å¼€å§‹",
      ctaSecondary: "æŸ¥çœ‹åŠŸèƒ½",
      noCard: "ç«‹å³å¼€å§‹",
      footerTagline: "ä¸€ç«™å¼è§†é¢‘å®‰æŽ’å’Œå‘å¸ƒå¹³å°ã€‚",
      footerTemplates: "æ¨¡æ¿",
    },
  },
};
