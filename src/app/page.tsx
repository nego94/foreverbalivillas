import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import HomeAmenities from '@/components/home/HomeAmenities';
import HomeFeatures from '@/components/home/HomeFeatures';
import HomeGallery from '@/components/home/HomeGallery';
import HomeJournal from '@/components/home/HomeJournal';
import { storageGet } from '@/lib/storage';
import { getPosts } from '@/lib/admin-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Forever Bali Villas — Where Tradition Meets Modern Luxury',
  description:
    'Discover two exquisite private villas in Bali. Forever Santai and Forever Pandawa — your luxury escape awaits.',
};

export default async function HomePage() {
  const [siteContent, allPosts] = await Promise.all([
    storageGet<Record<string, unknown>>('fbv:site-content', 'site-content.json'),
    getPosts(),
  ]);
  const hp = (siteContent?.homepage as Record<string, unknown>) ?? {};
  const journalPosts = allPosts.filter(p => p.published !== false).slice(0, 3);

  return (
    <>
      {/* 1. Hero — video/image fullscreen with headline */}
      <HomeHero heroImage={hp.heroImage as string | undefined} />

      {/* 2. About Us — cream, icons, description */}
      <HomeAmenities
        heading={(hp.about as Record<string, unknown>)?.heading as string | undefined}
        body={(hp.about as Record<string, unknown>)?.body as string | undefined}
        amenities={(hp.about as Record<string, unknown>)?.amenities as { label: string; icon: string }[] | undefined}
      />

      {/* 3. Key Features Per Villas — feature table */}
      <HomeFeatures
        features={(hp.features as Record<string, unknown>)?.items as { label: string; col: string }[] | undefined}
        spaMenuUrl={(hp.features as Record<string, unknown>)?.spaMenuUrl as string | undefined}
        foodMenuUrl={(hp.features as Record<string, unknown>)?.foodMenuUrl as string | undefined}
      />

      {/* 4. Photo Gallery — 2×2 image grid */}
      <HomeGallery galleryImages={hp.galleryImages as string[] | undefined} />

      {/* 5. The Journal — banner + Art of Slowing Down + Blog #1/#2 */}
      <HomeJournal posts={journalPosts} />

    </>
  );
}
