import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'node:crypto';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: number;
  avatarColor: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

const DB_DIR = path.resolve('data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const SESSIONS_FILE = path.join(DB_DIR, 'sessions.json');

const AVATAR_COLORS = ['#22c55e','#60a5fa','#f59e0b','#a78bfa','#f472b6','#fb923c','#34d399','#f87171'];

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, '[]', 'utf-8');
}

function readUsers(): User[] {
  ensureDb();
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); }
  catch { return []; }
}

function writeUsers(users: User[]) {
  ensureDb();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function readSessions(): Session[] {
  ensureDb();
  try { return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8')); }
  catch { return []; }
}

function writeSessions(sessions: Session[]) {
  ensureDb();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

export function getUserById(id: string): User | null {
  return readUsers().find(u => u.id === id) ?? null;
}

export function getUserByEmail(email: string): User | null {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getUserByUsername(username: string): User | null {
  return readUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export async function createUser(username: string, email: string, password: string, displayName: string): Promise<User> {
  const existing = getUserByEmail(email) || getUserByUsername(username);
  if (existing) throw new Error('User already exists with this email or username');

  const passwordHash = await bcrypt.hash(password, 12);
  const user: User = {
    id: randomBytes(16).toString('hex'),
    username,
    email,
    passwordHash,
    displayName: displayName || username,
    createdAt: Date.now(),
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
  };

  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
}

export async function verifyLogin(email: string, password: string): Promise<User | null> {
  const user = getUserByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export function createSession(userId: string): string {
  const token = randomBytes(32).toString('hex');
  const sessions = readSessions();

  // Clean expired sessions
  const now = Date.now();
  const valid = sessions.filter(s => s.expiresAt > now);
  valid.push({
    token,
    userId,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  writeSessions(valid);
  return token;
}

export function validateSession(token: string): User | null {
  if (!token) return null;
  const sessions = readSessions();
  const session = sessions.find(s => s.token === token && s.expiresAt > Date.now());
  if (!session) return null;
  return getUserById(session.userId);
}

export function deleteSession(token: string) {
  const sessions = readSessions();
  const filtered = sessions.filter(s => s.token !== token);
  writeSessions(filtered);
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
