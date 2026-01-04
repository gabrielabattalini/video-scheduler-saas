'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditPostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        const post = data.post || data;
        
        setTitle(post.title);
        setDescription(post.description || '');
        setVideoUrl(post.videoUrl);
        setPlatform(post.platform);
        setScheduledAt(post.scheduledAt ? post.scheduledAt.slice(0, 16) : '');
      } else {
        alert('Post não encontrado');
        router.push('/dashboard');
      }
    } catch (error) {
      alert('Erro ao carregar post');
      router.push('/dashboard');
    } finally {
      setLoadingPost(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          platform,
          scheduledAt: scheduledAt || null
        })
      });
      
      if (res.ok) {
        alert('Post atualizado com sucesso! ✅');
        router.push('/dashboard');
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar post');
      }
    } catch (error) {
      alert('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f3f4f6'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>⏳</div>
          <p style={{color:'#666'}}>Carregando post...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',background:'#f3f4f6',fontFamily:'sans-serif',padding:'2rem'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>
        <button 
          onClick={() => router.push('/dashboard')} 
          style={{marginBottom:'1.5rem',padding:'0.5rem 1rem',background:'white',border:'1px solid #ddd',borderRadius:'8px',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.5rem'}}>
          ← Voltar ao Dashboard
        </button>

        <div style={{background:'white',padding:'2.5rem',borderRadius:'16px',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <h1 style={{fontSize:'2rem',marginBottom:'0.5rem',color:'#333'}}>✏️ Editar Post</h1>
          <p style={{color:'#666',marginBottom:'2rem'}}>Atualize as informações do seu post</p>

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'1.5rem'}}>
              <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'600',color:'#374151'}}>
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ex: Meu vídeo incrível"
                style={{width:'100%',padding:'0.875rem',border:'2px solid #e5e7eb',borderRadius:'10px',fontSize:'1rem',outline:'none',transition:'border-color 0.3s',boxSizing:'border-box'}}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{marginBottom:'1.5rem'}}>
              <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'600',color:'#374151'}}>
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Descreva seu vídeo..."
                style={{width:'100%',padding:'0.875rem',border:'2px solid #e5e7eb',borderRadius:'10px',fontSize:'1rem',outline:'none',resize:'vertical',transition:'border-color 0.3s',fontFamily:'inherit',boxSizing:'border-box'}}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{marginBottom:'1.5rem'}}>
              <label style={{display:'block',marginBottom:'0.75rem',fontWeight:'600',color:'#374151'}}>
                URL do Vídeo *
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                placeholder="https://drive.google.com/file/d/... ou https://exemplo.com/video.mp4"
                style={{width:'100%',padding:'0.875rem',border:'2px solid #e5e7eb',borderRadius:'10px',fontSize:'1rem',outline:'none',transition:'border-color 0.3s',boxSizing:'border-box'}}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{marginBottom:'1.5rem'}}>
              <label style={{display:'block',marginBottom:'0.75rem',fontWeight:'600',color:'#374151'}}>
                📅 Agendar Publicação (opcional)
              </label>
              
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
                <div>
                  <label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',color:'#6b7280'}}>
                    Data
                  </label>
                  <input
                    type="date"
                    value={scheduledAt.split('T')[0] || ''}
                    onChange={(e) => {
                      const time = scheduledAt.split('T')[1] || '12:00';
                      setScheduledAt(e.target.value ? `${e.target.value}T${time}` : '');
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width:'100%',
                      padding:'0.875rem',
                      border:'2px solid #e5e7eb',
                      borderRadius:'10px',
                      fontSize:'1rem',
                      outline:'none',
                      transition:'border-color 0.3s',
                      boxSizing:'border-box',
                      cursor:'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',color:'#6b7280'}}>
                    Hora
                  </label>
                  <select
                    value={scheduledAt.split('T')[1]?.split(':')[0] || '12'}
                    onChange={(e) => {
                      const date = scheduledAt.split('T')[0] || new Date().toISOString().split('T')[0];
                      const minute = scheduledAt.split(':')[1] || '00';
                      setScheduledAt(`${date}T${e.target.value}:${minute}`);
                    }}
                    style={{
                      width:'100%',
                      padding:'0.875rem',
                      border:'2px solid #e5e7eb',
                      borderRadius:'10px',
                      fontSize:'1rem',
                      outline:'none',
                      cursor:'pointer',
                      background:'white',
                      boxSizing:'border-box'
                    }}>
                    {Array.from({length:24}, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}h
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.875rem',color:'#6b7280'}}>
                    Minutos
                  </label>
                  <select
                    value={scheduledAt.split(':')[1] || '00'}
                    onChange={(e) => {
                      const date = scheduledAt.split('T')[0] || new Date().toISOString().split('T')[0];
                      const hour = scheduledAt.split('T')[1]?.split(':')[0] || '12';
                      setScheduledAt(`${date}T${hour}:${e.target.value}`);
                    }}
                    style={{
                      width:'100%',
                      padding:'0.875rem',
                      border:'2px solid #e5e7eb',
                      borderRadius:'10px',
                      fontSize:'1rem',
                      outline:'none',
                      cursor:'pointer',
                      background:'white',
                      boxSizing:'border-box'
                    }}>
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                </div>
              </div>

              <div style={{marginTop:'1rem'}}>
                {scheduledAt ? (
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem',background:'#f0fdf4',borderRadius:'10px',border:'2px solid #86efac'}}>
                    <div>
                      <p style={{margin:0,fontSize:'0.875rem',color:'#166534',fontWeight:'600'}}>
                        📅 Agendado para:
                      </p>
                      <p style={{margin:'0.25rem 0 0 0',fontSize:'1rem',color:'#15803d',fontWeight:'bold'}}>
                        {new Date(scheduledAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })} às {new Date(scheduledAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScheduledAt('')}
                      style={{
                        padding:'0.5rem 1rem',
                        background:'#fee2e2',
                        color:'#991b1b',
                        border:'none',
                        borderRadius:'8px',
                        cursor:'pointer',
                        fontSize:'0.875rem',
                        fontWeight:'600'
                      }}>
                      ✕ Limpar
                    </button>
                  </div>
                ) : (
                  <div style={{padding:'1rem',background:'#fef3c7',borderRadius:'10px',border:'2px solid #fbbf24'}}>
                    <p style={{margin:0,fontSize:'0.875rem',color:'#92400e'}}>
                      <strong>⚡ Sem agendamento:</strong> Publique imediatamente ou defina uma data
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={{marginBottom:'2rem'}}>
              <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'600',color:'#374151'}}>
                Plataforma *
              </label>
              <div style={{display:'flex',gap:'1rem'}}>
                <label style={{
                  flex:1,
                  padding:'1rem',
                  border:`3px solid ${platform === 'youtube' ? '#667eea' : '#e5e7eb'}`,
                  borderRadius:'10px',
                  background:platform === 'youtube' ? '#f0f4ff' : 'white',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  gap:'0.5rem',
                  fontWeight:'600'
                }}>
                  <input 
                    type="radio" 
                    name="platform" 
                    value="youtube" 
                    checked={platform === 'youtube'}
                    onChange={(e) => setPlatform(e.target.value)}
                    style={{display:'none'}}
                  />
                  📺 YouTube
                </label>
                <label style={{
                  flex:1,
                  padding:'1rem',
                  border:`3px solid ${platform === 'tiktok' ? '#667eea' : '#e5e7eb'}`,
                  borderRadius:'10px',
                  background:platform === 'tiktok' ? '#f0f4ff' : 'white',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  gap:'0.5rem',
                  fontWeight:'600'
                }}>
                  <input 
                    type="radio" 
                    name="platform" 
                    value="tiktok" 
                    checked={platform === 'tiktok'}
                    onChange={(e) => setPlatform(e.target.value)}
                    style={{display:'none'}}
                  />
                  🎵 TikTok
                </label>
              </div>
            </div>

            <div style={{display:'flex',gap:'1rem'}}>
              <button 
                type="button"
                onClick={() => router.push('/dashboard')}
                style={{flex:1,padding:'1rem',border:'2px solid #e5e7eb',borderRadius:'10px',background:'white',color:'#374151',fontSize:'1rem',fontWeight:'bold',cursor:'pointer'}}>
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={loading}
                style={{
                  flex:1,
                  padding:'1rem',
                  border:'none',
                  borderRadius:'10px',
                  background:loading ? '#9ca3af' : 'linear-gradient(135deg,#667eea,#764ba2)',
                  color:'white',
                  fontSize:'1rem',
                  fontWeight:'bold',
                  cursor:loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? 'Salvando...' : '💾 Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}