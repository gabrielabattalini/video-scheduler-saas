'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { authService, type User } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/language-context';
import { translations } from '@/lib/i18n/translations';

export default function AccountPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const accountTexts = t.account || translations.en.account!;

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    const stored = authService.getUser();
    setUser(stored);
    setName(stored?.name || '');
  }, [router]);

  const handleProfileSave = async () => {
    try {
      setLoadingProfile(true);
      setProfileMessage(null);
      const updated = await authService.updateProfile(name.trim());
      setUser(updated);
      setProfileMessage(accountTexts.saveName + ' ✓');
    } catch (error: any) {
      setProfileMessage(error?.message || t.common.error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordError(accountTexts.passwordMismatch);
      return;
    }
    if (!currentPassword || !newPassword) {
      setPasswordError(t.common.error);
      return;
    }
    try {
      await authService.changePassword(currentPassword, newPassword);
      setPasswordMessage(accountTexts.passwordUpdated);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error?.message || t.common.error);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    const confirmed = window.confirm(accountTexts.deleteWarning);
    if (!confirmed) return;
    try {
      setDeleting(true);
      await authService.deleteAccount();
    } catch (error: any) {
      alert(error?.message || t.common.error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1.25rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800, color: '#0f172a' }}>
          {accountTexts.title}
        </h1>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>{accountTexts.description}</p>

        <section style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            {accountTexts.profile}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: '420px' }}>
            <label style={{ fontWeight: 600, color: '#334155' }}>{accountTexts.nameLabel}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={user?.name || user?.email || ''}
              style={{
                padding: '0.75rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
              }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={handleProfileSave}
                disabled={loadingProfile}
                style={{
                  padding: '0.65rem 1.1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: loadingProfile ? 0.7 : 1,
                }}
              >
                {loadingProfile ? accountTexts.saveName + '...' : accountTexts.saveName}
              </button>
              {profileMessage && <span style={{ color: '#475569', fontSize: '0.9rem' }}>{profileMessage}</span>}
            </div>
          </div>
        </section>

        <section style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            {accountTexts.password}
          </h2>
          <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '420px' }}>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={accountTexts.currentPassword}
              style={{ padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={accountTexts.newPassword}
              style={{ padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={accountTexts.confirmPassword}
              style={{ padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            {passwordError && <span style={{ color: '#dc2626', fontSize: '0.9rem' }}>{passwordError}</span>}
            {passwordMessage && <span style={{ color: '#16a34a', fontSize: '0.9rem' }}>{passwordMessage}</span>}
            <button
              onClick={handlePasswordChange}
              style={{
                width: 'fit-content',
                padding: '0.65rem 1.2rem',
                background: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {accountTexts.password}
            </button>
          </div>
        </section>

        <section style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #fee2e2' }}>
          <h2 style={{ margin: 0, marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700, color: '#b91c1c' }}>
            {accountTexts.delete}
          </h2>
          <p style={{ color: '#991b1b', marginBottom: '0.9rem' }}>{accountTexts.deleteWarning}</p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '0.65rem 1.2rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? '...' : accountTexts.deleteCta}
          </button>
        </section>
      </div>
    </>
  );
}
