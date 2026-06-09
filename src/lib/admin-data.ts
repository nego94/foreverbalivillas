import { storageGet, storageSet } from './storage';

// ── Blog posts ────────────────────────────────────────────────────────────────

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  coverImage: string;
  gallery?: string[];
  date: string;
  category?: string;
  published?: boolean;
}

export async function getPosts(): Promise<Post[]> {
  return storageGet<Post[]>('fbv:posts', 'posts.json');
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find(p => p.slug === slug);
}

export async function createPost(post: Post): Promise<Post> {
  const posts = await getPosts();
  if (posts.find(p => p.slug === post.slug)) {
    throw new Error(`Post with slug "${post.slug}" already exists`);
  }
  posts.unshift(post);
  await storageSet('fbv:posts', 'posts.json', posts);
  return post;
}

export async function updatePost(slug: string, data: Partial<Post>): Promise<Post> {
  const posts = await getPosts();
  const idx = posts.findIndex(p => p.slug === slug);
  if (idx === -1) throw new Error(`Post "${slug}" not found`);
  const updated = { ...posts[idx], ...data };
  posts[idx] = updated;
  await storageSet('fbv:posts', 'posts.json', posts);
  return updated;
}

export async function deletePost(slug: string): Promise<void> {
  const posts = await getPosts();
  await storageSet('fbv:posts', 'posts.json', posts.filter(p => p.slug !== slug));
}

// ── Site settings ─────────────────────────────────────────────────────────────

export interface SiteSettings {
  contact: { email: string; phone: string; whatsapp: string };
  social: { instagram: string; facebook: string; youtube: string };
  booking: { url: string };
  hero: { scrollText: string };
  scripts?: { head?: string; body?: string };
}

export async function getSettings(): Promise<SiteSettings> {
  return storageGet<SiteSettings>('fbv:site-settings', 'site-settings.json');
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated: SiteSettings = {
    contact: { ...current.contact, ...data.contact },
    social:  { ...current.social,  ...data.social  },
    booking: { ...current.booking, ...data.booking },
    hero:    { ...current.hero,    ...data.hero    },
    scripts: { ...current.scripts, ...data.scripts },
  };
  await storageSet('fbv:site-settings', 'site-settings.json', updated);
  return updated;
}

// ── Site content (all page copy) ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SiteContent = Record<string, any>;

// ── Admin users ───────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'editor';
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export async function getUsers(): Promise<AdminUser[]> {
  return storageGet<AdminUser[]>('fbv:users', 'admin-users.json');
}

export async function getUser(username: string): Promise<AdminUser | undefined> {
  const users = await getUsers();
  return users.find(u => u.username === username);
}

export async function createUser(user: AdminUser): Promise<AdminUser> {
  const users = await getUsers();
  if (users.find(u => u.username === user.username)) {
    throw new Error(`User "${user.username}" already exists`);
  }
  users.push(user);
  await storageSet('fbv:users', 'admin-users.json', users);
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  const users = await getUsers();
  await storageSet('fbv:users', 'admin-users.json', users.filter(u => u.id !== id));
}

export async function updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
  const users = await getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) throw new Error('User not found');
  users[idx] = { ...users[idx], ...data };
  await storageSet('fbv:users', 'admin-users.json', users);
  return users[idx];
}
