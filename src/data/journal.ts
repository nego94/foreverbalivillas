import postsData from './posts.json';

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  gallery?: string[];
  date: string;
  category?: string;
  published?: boolean;
}

// Static JSON import — works in both server and client components.
// Add/edit posts via the admin panel (/admin/blog), which writes to posts.json.
export const POSTS: JournalPost[] = postsData as JournalPost[];

export const HOME_FEATURED_SLUGS = [
  POSTS[0]?.slug ?? '',
  POSTS[1]?.slug ?? '',
  POSTS[2]?.slug ?? '',
];

export function getHomeFeaturedPosts(): JournalPost[] {
  return HOME_FEATURED_SLUGS
    .map(slug => POSTS.find(p => p.slug === slug))
    .filter((p): p is JournalPost => Boolean(p));
}
