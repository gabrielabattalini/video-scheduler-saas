'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { connectionsApi, PlatformConnection } from '@/lib/connections-api';
import { workspacesApi, Workspace } from '@/lib/workspaces-api';
import { Navbar } from '@/components/Navbar';
import { PlatformIcon, platformMeta, type PlatformKey } from '@/components/PlatformIcon';
import { useLanguage } from '@/lib/i18n/language-context';

const platforms = [
  { id: 'youtube', name: platformMeta.youtube.label, color: platformMeta.youtube.color },
  { id: 'instagram', name: platformMeta.instagram.label, color: platformMeta.instagram.color },
  { id: 'tiktok', name: platformMeta.tiktok.label, color: platformMeta.tiktok.color },
  { id: 'facebook', name: platformMeta.facebook.label, color: platformMeta.facebook.color },
  { id: 'twitter', name: platformMeta.twitter.label, color: platformMeta.twitter.color },
  { id: 'kawai', name: platformMeta.kawai.label, color: platformMeta.kawai.color },
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '52px',
                        height: '52px',
                        flexShrink: 0,
                        borderRadius: '14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                    {(() => {
                      return <PlatformIcon platform={platform.id as PlatformKey} size={34} />;
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




