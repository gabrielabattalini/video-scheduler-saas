'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/lib/i18n/language-context';

export default function PaymentsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleProviderClick = () => {
    alert(t.payments.note);
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              {t.payments.title}
            </h1>
            <p style={{ color: '#475569' }}>{t.payments.description}</p>
          </div>
          <button
            onClick={() => router.push('/pricing')}
            style={{
              border: '1px solid #e2e8f0',
              background: 'white',
              borderRadius: '10px',
              padding: '0.55rem 1rem',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            {t.common.back}
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.payments.mercadoTitle}</h2>
              <p style={{ color: '#475569', marginBottom: '1rem' }}>{t.payments.mercadoSubtitle}</p>
              <button
                onClick={handleProviderClick}
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '0.7rem 1.1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t.payments.mercadoCta}
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.payments.stripeTitle}</h2>
              <p style={{ color: '#475569', marginBottom: '1rem' }}>{t.payments.stripeSubtitle}</p>
              <button
                onClick={handleProviderClick}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  padding: '0.7rem 1.1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t.payments.stripeCta}
              </button>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{t.payments.methodsTitle}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {t.payments.methods.map((method) => (
                <span
                  key={method}
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '999px',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: '0.85rem',
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
            <p style={{ marginTop: '0.9rem', color: '#64748b', fontSize: '0.9rem' }}>{t.payments.note}</p>
          </div>
        </div>
      </div>
    </>
  );
}
