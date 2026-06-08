'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { writeFileSync } from 'fs';
import path from 'path';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import type { SiteContent } from '@/types';

const COOKIE = 'nx_admin';

// Admin is fully inaccessible if ADMIN_PASSWORD is not set in .env.local
function getPassword(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

function hashPw(s: string): Buffer {
  return createHash('sha256').update(s).digest();
}

// ── Session store ─────────────────────────────────────────────────────────────
// Each successful login gets a unique random token.
// Tokens live until logout or server restart — logout truly invalidates them.
const validSessions = new Set<string>();

// ── Rate limiting ─────────────────────────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

async function getClientIp(): Promise<string> {
  try {
    const hdrs = await headers();
    return (
      hdrs.get('x-forwarded-for')?.split(',')[0].trim() ??
      hdrs.get('x-real-ip') ??
      'local'
    );
  } catch {
    return 'local';
  }
}

function checkRateLimit(ip: string): 'ok' | 'blocked' {
  const entry = loginAttempts.get(ip);
  if (!entry) return 'ok';
  if (Date.now() > entry.resetAt) { loginAttempts.delete(ip); return 'ok'; }
  return entry.count >= MAX_ATTEMPTS ? 'blocked' : 'ok';
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOCKOUT_MS });
  } else {
    loginAttempts.set(ip, { ...entry, count: entry.count + 1 });
  }
}

// ── Public actions ────────────────────────────────────────────────────────────
export async function isAuthenticated(): Promise<boolean> {
  if (!getPassword()) return false;
  const jar   = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  return validSessions.has(token);
}

export async function loginAction(formData: FormData) {
  const password = getPassword();
  if (!password) redirect('/admin?error=misconfigured');

  const ip = await getClientIp();
  if (checkRateLimit(ip) === 'blocked') redirect('/admin?error=blocked');

  const pw = (formData.get('password') as string) ?? '';

  // Timing-safe: compare SHA-256 digests (always 32 bytes — no length leak)
  const match = timingSafeEqual(hashPw(pw), hashPw(password));

  if (match) {
    loginAttempts.delete(ip); // clear failed-attempt counter on success

    const token = randomBytes(32).toString('hex'); // unique per session
    validSessions.add(token);

    const jar = await cookies();
    jar.set(COOKIE, token, {
      httpOnly:  true,
      secure:    process.env.NODE_ENV === 'production',
      maxAge:    60 * 60 * 8, // 8 hours
      sameSite:  'strict',
      path:      '/',
    });
    redirect('/admin');
  }

  recordFailure(ip);
  redirect('/admin?error=1');
}

export async function logoutAction() {
  const jar   = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) validSessions.delete(token); // true invalidation — token is gone
  jar.delete(COOKIE);
  redirect('/admin');
}

export async function saveContentAction(content: SiteContent) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const filePath = path.join(process.cwd(), 'src/data/content.json');
  writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  revalidatePath('/');
}
