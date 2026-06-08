import { readFileSync } from 'fs';
import path from 'path';
import { isAuthenticated, loginAction } from './actions';
import AdminClient from './AdminClient';
import type { SiteContent } from '@/types';
import styles from './admin.module.css';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authed = await isAuthenticated();

  if (!authed) {
    const isBlocked       = params.error === 'blocked';
    const isMisconfigured = params.error === 'misconfigured';

    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>NEXUS<span>.</span>AI</div>
          <p className={styles.loginSub}>// admin access</p>

          {isMisconfigured && (
            <p className={styles.loginError}>
              Admin não configurado. Defina ADMIN_PASSWORD em .env.local
            </p>
          )}

          {isBlocked ? (
            <p className={styles.loginError}>
              Muitas tentativas. Aguarde 15 minutos.
            </p>
          ) : (
            !isMisconfigured && (
              <>
                {params.error === '1' && (
                  <p className={styles.loginError}>Senha incorreta.</p>
                )}
                <form action={loginAction} className={styles.loginForm}>
                  <input
                    name="password"
                    type="password"
                    placeholder="senha"
                    className={styles.loginInput}
                    autoFocus
                  />
                  <button type="submit" className={styles.loginBtn}>
                    Entrar
                  </button>
                </form>
              </>
            )
          )}
        </div>
      </div>
    );
  }

  const filePath = path.join(process.cwd(), 'src/data/content.json');
  const content: SiteContent = JSON.parse(readFileSync(filePath, 'utf-8'));

  return <AdminClient initialContent={content} />;
}
