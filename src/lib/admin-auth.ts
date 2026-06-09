/**
 * Admin authentication utilities.
 * Uses `jose` which works in both Edge Runtime (middleware) and Node.js (API routes).
 */
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

const SESSION_COOKIE = 'fbv_admin_session';
const SESSION_TTL    = '8h';

function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_SECRET || 'fbv-dev-secret-change-in-production';
  return new TextEncoder().encode(raw);
}

// ── Token ────────────────────────────────────────────────────────────────────

export interface SessionPayload {
  userId:   string;
  username: string;
  role:     'admin' | 'editor';
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecret()) as Promise<string>;
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ── Password ─────────────────────────────────────────────────────────────────

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt ?? crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(
    password,
    s + (process.env.ADMIN_SECRET || 'fbv-dev-secret-change-in-production'),
    100_000, 64, 'sha512',
  ).toString('hex');
  return { hash, salt: s };
}

export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  const { hash } = hashPassword(password, storedSalt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

// ── Env admin (always exists) ─────────────────────────────────────────────────

export function checkEnvAdmin(username: string, password: string): boolean {
  const envUser = process.env.ADMIN_USERNAME || 'admin';
  const envPass = process.env.ADMIN_PASSWORD || '';
  if (!envPass) return false;
  // Simple safe comparison (same length enforced before timingSafeEqual)
  if (username.length !== envUser.length || password.length !== envPass.length) return false;
  const uMatch = crypto.timingSafeEqual(Buffer.from(username), Buffer.from(envUser));
  const pMatch = crypto.timingSafeEqual(Buffer.from(password), Buffer.from(envPass));
  return uMatch && pMatch;
}

export { SESSION_COOKIE };
