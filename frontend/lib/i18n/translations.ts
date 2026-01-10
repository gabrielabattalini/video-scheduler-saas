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
    workspaceLabel: string;
    workspacePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    videoLinkLabel: string;
    videoLinkPlaceholder: string;
    uploadVideoLabel: string;
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
  account: {
    title: string;
    description: string;
    profile: string;
    nameLabel: string;
    saveName: string;
    password: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    passwordMismatch: string;
    passwordUpdated: string;
    delete: string;
    deleteWarning: string;
    deleteCta: string;
    deleteSuccess: string;
  };
  payments: {
    title: string;
    description: string;
    mercadoTitle: string;
    mercadoSubtitle: string;
    mercadoCta: string;
    stripeTitle: string;
    stripeSubtitle: string;
    stripeCta: string;
    methodsTitle: string;
    methods: string[];
    note: string;
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
    workspaceLabel: "Workspace",
    workspacePlaceholder: "Current workspace",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Describe your post",
    videoLinkLabel: "Video link",
    videoLinkPlaceholder: "Paste a video URL (optional)",
    uploadVideoLabel: "Upload video",
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
  account: {
    title: "Account settings",
    description: "Manage your profile information, password and account lifecycle.",
    profile: "Profile",
    nameLabel: "Display name",
    saveName: "Save profile",
    password: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    passwordMismatch: "Passwords do not match.",
    passwordUpdated: "Password updated successfully.",
    delete: "Delete account",
    deleteWarning: "This action permanently removes your account, workspaces, posts and connections.",
    deleteCta: "Delete my account",
    deleteSuccess: "Account deleted successfully.",
  },
  payments: {
    title: "Payments",
    description: "Choose your preferred payment provider to continue.",
    mercadoTitle: "Mercado Pago",
    mercadoSubtitle: "Best for Brazil with PIX, boleto and local cards.",
    mercadoCta: "Pay with Mercado Pago",
    stripeTitle: "Stripe",
    stripeSubtitle: "Ideal for international cards and subscriptions.",
    stripeCta: "Pay with Stripe",
    methodsTitle: "Accepted methods",
    methods: ["Credit card", "Debit card", "PIX", "Bank slip (boleto)", "International card"],
    note: "You'll be redirected to a secure checkout. Availability depends on your region.",
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
      email: "Email",
      password: "Senha",
      login: "Entrar",
      register: "Cadastrar",
      forgotPassword: "Esqueceu a senha?",
      continueWithGoogle: "Continuar com Google",
      passwordMin: "Mínimo de 6 caracteres",
      or: "ou",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Gerencie seus posts e conteúdo",
      welcome: "Bem-vindo de volta!",
      connectAccounts: "Conecte contas",
      connectAccountsDescription: "Vincule perfis sociais para começar a publicar.",
      connectedAccounts: "conta(s) conectada(s)",
      noConnections: "Nenhuma conexão ainda",
      manageConnections: "Gerenciar conexões",
      stats: "Estatísticas",
      recentPosts: "Posts recentes",
      noPosts: "Nenhum post encontrado",
      createFirstPost: "Crie seu primeiro post",
      posts: "Posts",
      scheduled: "Agendados",
      published: "Publicados",
      drafts: "Rascunhos",
    },
    connections: {
      title: "Conexões",
      subtitle: "Gerencie múltiplas contas organizadas por workspace",
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
        kawai: "Conecte-se à plataforma Kawai",
      },
    },
    newPost: {
      title: "Novo Post",
      createPost: "Criar Post",
      selectPlatform: "Selecionar plataforma",
      workspaceLabel: "Workspace",
      workspacePlaceholder: "Workspace atual",
      descriptionLabel: \"Descricao\",
      descriptionPlaceholder: \"Descreva o post\",
      videoLinkLabel: \"Link do video\",
      videoLinkPlaceholder: \"Cole o link do video (opcional)\",
      uploadVideoLabel: \"Enviar video\",
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
    account: {
      title: "Configurações da conta",
      description: "Atualize nome, senha e opções da conta.",
      profile: "Perfil",
      nameLabel: "Nome de exibição",
      saveName: "Salvar perfil",
      password: "Alterar senha",
      currentPassword: "Senha atual",
      newPassword: "Nova senha",
      confirmPassword: "Confirmar nova senha",
      passwordMismatch: "As senhas não coincidem.",
      passwordUpdated: "Senha atualizada com sucesso.",
      delete: "Excluir conta",
      deleteWarning: "Essa ação remove sua conta, workspaces, posts e conexões de forma permanente.",
      deleteCta: "Excluir minha conta",
      deleteSuccess: "Conta excluída com sucesso.",
    },
    payments: {
      title: "Pagamentos",
      description: "Escolha o provedor de pagamento para continuar.",
      mercadoTitle: "Mercado Pago",
      mercadoSubtitle: "Melhor para o Brasil com PIX, boleto e cartões locais.",
      mercadoCta: "Pagar com Mercado Pago",
      stripeTitle: "Stripe",
      stripeSubtitle: "Ideal para cartões internacionais e assinaturas.",
      stripeCta: "Pagar com Stripe",
      methodsTitle: "Métodos aceitos",
      methods: ["Cartão de crédito", "Cartão de débito", "PIX", "Boleto", "Cartão internacional"],
      note: "Você será redirecionado para um checkout seguro. A disponibilidade varia por região.",
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
  // For now, ru and zh reuse english to avoid broken encoding; replace with native translations if desired.
  ru: english,
  zh: english,
};
