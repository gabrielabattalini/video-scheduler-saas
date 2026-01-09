'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { connectionsApi, PlatformConnection } from '@/lib/connections-api';
import { workspacesApi, Workspace } from '@/lib/workspaces-api';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/lib/i18n/language-context';

// Componentes de ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cones SVG
const YouTubeIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ size = 40 }: { size?: number }) => {
  const gradientId = `instagram-gradient-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={`url(#${gradientId})`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E4405F" />
          <stop offset="50%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
};

const TikTokIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.09z"/>
  </svg>
);

const FacebookIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const KawaiIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF69B4">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    <circle cx="9" cy="9" r="1.5" fill="#FF69B4"/>
    <circle cx="15" cy="9" r="1.5" fill="#FF69B4"/>
    <path d="M12 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#FF69B4"/>
  </svg>
);

// Mapeamento de ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cones por plataforma
const platformIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  twitter: XIcon,
  kawai: KawaiIcon,
};

const platforms = [
  { id: 'youtube', name: 'YouTube', color: '#FF0000' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'twitter', name: 'X', color: '#000000' },
  { id: 'kawai', name: 'Kawai', color: '#FF69B4' },
];

export default function ConnectionsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceColor, setNewWorkspaceColor] = useState('#667eea');
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Verificar autenticaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Verificar se hÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ parÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢metros de sucesso/erro na URL
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const success = params.get('success');
    const error = params.get('error');

    if (connected && success === 'true') {
      const platformName = connected.charAt(0).toUpperCase() + connected.slice(1);
      setNotification({
        type: 'success',
        message: `${platformName} conectado com sucesso!`,
      });
      // Limpar URL
      window.history.replaceState({}, document.title, '/connections');
      // Remover notificaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o apÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s 4 segundos
      setTimeout(() => setNotification(null), 4000);
    } else if (error) {
      setNotification({
        type: 'error',
        message: decodeURIComponent(error),
      });
      // Limpar URL
      window.history.replaceState({}, document.title, '/connections');
      // Remover notificaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o apÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³s 5 segundos
      setTimeout(() => setNotification(null), 5000);
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (selectedWorkspace) {
      loadConnections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [workspacesData, connectionsData] = await Promise.all([
        workspacesApi.list(),
        connectionsApi.list(),
      ]);
      
      // Se nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o houver workspaces, mostrar modal para criar
      if (workspacesData.length === 0) {
        setShowNewWorkspace(true);
        setNewWorkspaceName('');
        setNewWorkspaceColor('#667eea');
      } else {
        setWorkspaces(workspacesData);
        // Sempre selecionar um workspace especÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­fico (nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o "Todos")
        if (!selectedWorkspace || selectedWorkspace === null) {
          setSelectedWorkspace(workspacesData[0].id);
        }
      }
      
      // Carregar conexÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes do workspace selecionado
      if (selectedWorkspace || workspacesData.length > 0) {
        const workspaceId = selectedWorkspace || workspacesData[0].id;
        const filteredConnections = await connectionsApi.list(workspaceId);
        setConnections(filteredConnections);
      } else {
        setConnections([]);
      }
      
      console.log('Dados carregados:', { workspaces: workspacesData, connections: connectionsData });
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Erro ao carregar dados',
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      if (!selectedWorkspace) {
        setConnections([]);
        return;
      }
      const data = await connectionsApi.list(selectedWorkspace);
      setConnections(data);
    } catch (error: any) {
      console.error('Erro ao carregar conexÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes:', error);
      setConnections([]);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) {
      setNotification({
        type: 'error',
        message: t.workspaces.choose,
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    try {
      const workspace = await workspacesApi.create({
        name: newWorkspaceName.trim(),
        color: newWorkspaceColor,
      });
      
      setWorkspaces([...workspaces, workspace]);
      setSelectedWorkspace(workspace.id);
      setShowNewWorkspace(false);
      setNewWorkspaceName('');
      setNewWorkspaceColor('#667eea');
      await loadConnections();
    } catch (error: any) {
      console.error('Erro ao criar workspace:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Erro ao criar workspace',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setEditWorkspaceName(workspace.name);
  };

  const handleSaveEditWorkspace = async () => {
    if (!editingWorkspace || !editWorkspaceName.trim()) {
      setNotification({
        type: 'error',
        message: 'Por favor, informe um nome vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lido',
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    try {
      const updated = await workspacesApi.update(editingWorkspace.id, {
        name: editWorkspaceName.trim(),
      });
      setWorkspaces(workspaces.map(w => w.id === updated.id ? updated : w));
      setEditingWorkspace(null);
      setEditWorkspaceName('');
    } catch (error: any) {
      console.error('Erro ao atualizar workspace:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Erro ao atualizar workspace',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDeleteWorkspace = async (workspace: Workspace) => {
    if (workspaces.length <= 1) {
      setNotification({
        type: 'error',
        message: 'Crie outro workspace antes de deletar este.',
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const connectionCount = workspace._count?.connections || 0;
    const message = connectionCount > 0
      ? `Tem certeza que deseja deletar o workspace "${workspace.name}"?\n\nIsso irÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ desconectar ${connectionCount} conta${connectionCount > 1 ? 's' : ''} vinculada${connectionCount > 1 ? 's' : ''} a este workspace.\n\nEsta aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o pode ser desfeita!`
      : `Tem certeza que deseja deletar o workspace "${workspace.name}"?\n\nEsta aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o pode ser desfeita!`;

    if (!confirm(message)) {
      return;
    }

    try {
      await workspacesApi.delete(workspace.id);
      
      // Remover o workspace da lista
      const remainingWorkspaces = workspaces.filter(w => w.id !== workspace.id);
      setWorkspaces(remainingWorkspaces);
      
      // Se o workspace deletado era o selecionado, selecionar outro
      if (selectedWorkspace === workspace.id) {
        if (remainingWorkspaces.length > 0) {
          setSelectedWorkspace(remainingWorkspaces[0].id);
        } else {
          setSelectedWorkspace(null);
          setConnections([]);
        }
      }
      
      // Recarregar conexÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
      if (remainingWorkspaces.length > 0 && selectedWorkspace === workspace.id) {
        // Se selecionamos um novo workspace, carregar suas conexÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
        const newSelectedId = remainingWorkspaces[0].id;
        setSelectedWorkspace(newSelectedId);
        const filteredConnections = await connectionsApi.list(newSelectedId);
        setConnections(filteredConnections);
      } else if (selectedWorkspace && selectedWorkspace !== workspace.id) {
        // Se outro workspace estava selecionado, recarregar suas conexÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
        await loadConnections();
      }
      
      setNotification({
        type: 'success',
        message: 'Workspace deletado com sucesso! Todas as contas vinculadas foram desconectadas.',
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (error: any) {
      console.error('Erro ao deletar workspace:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Erro ao deletar workspace',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleConnect = async (platformId: string) => {
    try {
      // Sempre exigir um workspace selecionado
      if (!selectedWorkspace) {
        setNotification({
          type: 'error',
          message: t.workspaces.choose,
        });
        setTimeout(() => setNotification(null), 4000);
        return;
      }

      const workspaceId = selectedWorkspace;

      // Verificar se jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ existe conexÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o da mesma plataforma em outro workspace
      const allConnections = await connectionsApi.list();
      const existingConnection = allConnections.find(
        (c) => c.platform === platformId && c.workspaceId && c.workspaceId !== workspaceId
      );

      if (existingConnection) {
        const otherWorkspace = workspaces.find(w => w.id === existingConnection.workspaceId);
        const platformName = platforms.find(p => p.id === platformId)?.name || platformId;
        const message = `VocÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âª jÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ tem uma conta ${platformName} conectada no workspace "${otherWorkspace?.name || 'outro workspace'}".\n\nDeseja conectar a mesma conta tambÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©m neste workspace?`;
        
        if (!confirm(message)) {
          return;
        }
      }

      setConnecting(platformId);
      console.log(`Tentando conectar ${platformId} no workspace ${workspaceId}...`);
      
      const { redirectUrl } = await connectionsApi.connect(platformId, workspaceId);
      
      if (!redirectUrl) {
        throw new Error('URL de redirecionamento nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o recebida');
      }

      console.log('Redirecionando para:', redirectUrl);
      // Redirecionar para a URL de autenticaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
      window.location.href = redirectUrl;
    } catch (error: any) {
      console.error('Erro ao conectar:', error);
      const errorMessage = error.message || error.response?.data?.error || 'Erro ao conectar com a plataforma';
      setNotification({
        type: 'error',
        message: errorMessage,
      });
      setTimeout(() => setNotification(null), 5000);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    if (!confirm('Tem certeza que deseja desconectar?')) return;

    try {
      console.log(`Desconectando ${platformId}...`);
      await connectionsApi.disconnect(platformId);
      const platformName = platformId.charAt(0).toUpperCase() + platformId.slice(1);
      setNotification({
        type: 'success',
        message: `${platformName} desconectado com sucesso!`,
      });
      setTimeout(() => setNotification(null), 4000);
      await loadConnections();
    } catch (error: any) {
      console.error('Erro ao desconectar:', error);
      const errorMessage = error.message || error.response?.data?.error || 'Erro ao desconectar';
      setNotification({
        type: 'error',
        message: errorMessage,
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const getConnectionsForPlatform = (platformId: string) => {
    return connections.filter((c) => c.platform === platformId);
  };

  const getWorkspaceName = (workspaceId: string | null | undefined) => {
    if (!workspaceId) return 'Sem workspace';
    const workspace = workspaces.find(w => w.id === workspaceId);
    return workspace?.name || 'Workspace desconhecido';
  };

  const workspaceColors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea'];
  const disableDeleteWorkspace = workspaces.length <= 1;

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>{t.connections.loading}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* NotificaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: notification.type === 'success' 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            minWidth: '300px',
            maxWidth: '90%',
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {notification.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
          </div>
          <span style={{
            fontSize: '0.9375rem',
            fontWeight: '600',
            flex: 1,
          }}>
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '6px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              padding: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {t.connections.title}
            </h1>
            <p style={{ color: '#666' }}>
              {t.connections.subtitle}
            </p>
          </div>
          <button
            onClick={() => setShowNewWorkspace(!showNewWorkspace)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            + {t.workspaces.create}
          </button>
        </div>

        {showNewWorkspace && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {t.workspaces.create}
            </h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {t.workspaces.choose}
                </label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder={t.workspaces.placeholder}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {t.connections.colorLabel}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {workspaceColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewWorkspaceColor(color)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        border: newWorkspaceColor === color ? '3px solid #333' : '2px solid #e5e7eb',
                        background: color,
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleCreateWorkspace}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                {t.workspaces.create}
              </button>
              <button
                onClick={() => {
                  setShowNewWorkspace(false);
                  setNewWorkspaceName('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#e5e7eb',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            {t.workspaces.active}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <button
                  onClick={() => setSelectedWorkspace(workspace.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedWorkspace === workspace.id ? workspace.color || '#667eea' : 'white',
                    color: selectedWorkspace === workspace.id ? 'white' : '#333',
                    border: `2px solid ${workspace.color || '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: selectedWorkspace === workspace.id ? '600' : '400',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {editingWorkspace?.id === workspace.id ? (
                    <input
                      type="text"
                      value={editWorkspaceName}
                      onChange={(e) => setEditWorkspaceName(e.target.value)}
                      onBlur={handleSaveEditWorkspace}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEditWorkspace();
                        } else if (e.key === 'Escape') {
                          setEditingWorkspace(null);
                          setEditWorkspaceName('');
                        }
                      }}
                      autoFocus
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: selectedWorkspace === workspace.id ? 'white' : '#333',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        outline: 'none',
                        minWidth: '100px',
                      }}
                    />
                  ) : (
                    workspace.name
                  )}
                  {workspace._count && (
                    <span style={{
                      fontSize: '0.75rem',
                      opacity: 0.8,
                      marginLeft: '0.25rem',
                    }}>
                      ({workspace._count.connections || 0})
                    </span>
                  )}
                </button>
                {editingWorkspace?.id !== workspace.id && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditWorkspace(workspace);
                      }}
                      style={{
                        padding: '0.375rem',
                        background: 'transparent',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                      title={t.common.edit}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkspace(workspace);
                      }}
                      disabled={disableDeleteWorkspace}
                      style={{
                        padding: '0.375rem',
                        background: 'transparent',
                        border: '1px solid #fee2e2',
                        borderRadius: '6px',
                        cursor: disableDeleteWorkspace ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#dc2626',
                        opacity: disableDeleteWorkspace ? 0.5 : 1,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (disableDeleteWorkspace) return;
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#fca5a5';
                      }}
                      onMouseLeave={(e) => {
                        if (disableDeleteWorkspace) return;
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#fee2e2';
                      }}
                      title={disableDeleteWorkspace ? 'Crie outro workspace para deletar este.' : t.common.delete}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {platforms.map((platform) => {
            const platformConnections = getConnectionsForPlatform(platform.id);
            const isConnecting = connecting === platform.id;

            return (
              <div
                key={platform.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  background: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    flexShrink: 0
                  }}>
                    {(() => {
                      const IconComponent = platformIcons[platform.id];
                      return IconComponent ? <IconComponent size={40} /> : null;
                    })()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                      {platform.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#666', margin: '0.25rem 0 0 0' }}>
                      {t.connections.platformDescriptions[platform.id as keyof typeof t.connections.platformDescriptions]}
                    </p>
                  </div>
                </div>

                {platformConnections.length > 0 ? (
                  <div>
                    <div style={{
                      padding: '0.75rem',
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                    }}>
                      <div style={{ fontSize: '0.875rem', color: '#166534', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {t.connections.accountCount.replace('{count}', platformConnections.length.toString())}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {platformConnections.map((conn) => (
                          <div key={conn.id} style={{
                            padding: '0.5rem',
                            background: 'white',
                            borderRadius: '6px',
                            border: '1px solid #86efac',
                          }}>
                            {conn.platformUsername && (
                              <div style={{ fontSize: '0.8125rem', color: '#15803d', fontWeight: '600' }}>
                                {conn.platformUsername}
                              </div>
                            )}
                            {conn.workspace && (
                              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                                {t.workspaces.active}: {conn.workspace.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting || !selectedWorkspace}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: isConnecting || !selectedWorkspace ? '#9ca3af' : platform.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isConnecting || !selectedWorkspace ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                      }}
                    >
                      + {t.connections.addAccount}
                    </button>
                    {!selectedWorkspace && (
                      <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.5rem', textAlign: 'center' }}>
                        {t.workspaces.choose}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting || !selectedWorkspace}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: isConnecting || !selectedWorkspace ? '#9ca3af' : platform.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isConnecting || !selectedWorkspace ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isConnecting && selectedWorkspace) {
                          e.currentTarget.style.opacity = '0.9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      {isConnecting ? t.connections.connecting : t.common.connect}
                    </button>
                    {!selectedWorkspace && (
                      <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.5rem', textAlign: 'center' }}>
                        {t.workspaces.choose}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}



