import type { Metadata } from 'next';
import VillaPage from '@/components/VillaPage';
import type { VillaData } from '@/components/VillaPage';
import type { TestimonyData } from '@/components/VillaGalleryTestimonies';
import { storageGet } from '@/lib/storage';

export const revalidate = 60;

const PANDAWA_TESTIMONIES: TestimonyData[] = [
  {
    id: 1,
    rating: 5,
    text: "Forever Pandawa felt like our own private corner of Bali. The architecture is stunning and the team made us feel completely at home. Already planning our return.",
    author: "Nico B.",
    age: 29,
  },
  {
    id: 2,
    rating: 5,
    text: "We celebrated our anniversary here and it exceeded every expectation. The private pool, the sunset views, the breakfast spread — everything was flawless.",
    author: "James & Lisa",
    age: 41,
  },
  {
    id: 3,
    rating: 5,
    text: "The grandeur of Pandawa is unlike anything we've experienced. Six bedrooms, an infinity pool overlooking the ocean, and a team that treated us like family.",
    author: "Marcus T.",
    age: 38,
  },
  {
    id: 4,
    rating: 5,
    text: "From the seamless check-in to the thoughtful little touches throughout our stay — this is exactly what a luxury villa experience should feel like.",
    author: "Tom & Rachel",
    age: 45,
  },
  {
    id: 5,
    rating: 5,
    text: "The ocean views from the top level took our breath away every single morning. Pandawa is a once-in-a-lifetime stay that we will absolutely repeat.",
    author: "Chloe & David",
    age: 33,
  },
];

export const metadata: Metadata = {
  title: 'Forever Pandawa — Where Tradition Meets Modern Luxury',
  description:
    'Inspired by the Mahabharata, Forever Pandawa is a five-bedroom luxury villa in Bali offering grandeur, sweeping ocean views, and impeccable service.',
};

const pandawaData: VillaData = {
  slug: 'forever-pandawa',
  name: 'Forever Pandawa',
  tagline: 'Where Tradition Meets Modern Luxury',
  heroTagline: 'Forever Pandawa • Nusa Dua, Bali',
  heroDescription:
    'Forever Pandawa is a stylish luxury villa designed for relaxed coastal living near Pandawa Beach. The villa features six spacious bedrooms and six bathrooms, and ca also can sleep 12 to 14 with added beds offering comfort and privacy for families or groups.',
  description:
    'Open-plan living and dining areas connect seamlessly to the outdoor spaces, creating an easy indoor–outdoor flow.',
  longDescription:
    'Guests can enjoy a private swimming pool, sun loungers, a fully equipped kitchen, air-conditioned bedrooms, and high-speed Wi-Fi, all supported by attentive in-villa staff for a smooth, comfortable stay.',
  heroImage: '/images/villas/forever-pandawa/hero/hero.jpg',
  heroVideo: '/videos/villas/forever-pandawa/forever-pandawa-video.mp4',
  amenities: [
    { label: 'À la Carte', icon: '/images/icons/villas-icon/Breakfast.png' },
    { label: 'Bathroom', icon: '/images/icons/villas-icon/Bathtub.png' },
    { label: 'Dining Room', icon: '/images/icons/villas-icon/Food.png' },
    { label: 'Air Conditioning', icon: '/images/icons/villas-icon/AC.png' },
    { label: 'Bedrooms', icon: '/images/icons/villas-icon/Bed.png' },
    { label: 'Private Chef', icon: '/images/icons/villas-icon/Cook.png' },
    { label: 'Pool', icon: '/images/icons/villas-icon/Pool.png' },
    { label: 'Living Room', icon: '/images/icons/villas-icon/Sofa.png' },
    { label: 'BBQ Facility', icon: '/images/icons/villas-icon/Grill.png' },
    { label: '24/7 Security', icon: '/images/icons/villas-icon/Alarm.png' },
  ],
  rooms: [
    {
      id: 'ocean-suite-1',
      label: 'Ocean Suite 1',
      description: 'The epitome of modern Balinese luxury, Ocean Suite 1 offers uninterrupted ocean views directly from the bed. The experience is elevated by a sculptural marble bathtub and striking stone relief artwork, creating a serene and indulgent retreat.',
      images: [
        '/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-a.jpg',
        '/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-b.jpg',
        '/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-c.jpg',
        '/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-d.jpg',
        '/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-e.jpg'
      ],
    },
    {
      id: 'ocean-suite-2',
      label: 'Ocean Suite 2',
      description: 'Designed for added privacy, Ocean Suite 2 features a separate private entrance and a secluded balcony, perfect for quiet mornings overlooking the ocean. The suite also includes an outdoor bathtub set beside the tranquil turtle pond.',
      images: [
        '/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-a.jpg',
        '/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-b.jpg',
        '/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-c.jpg',
        '/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-d.jpg',
        '/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-e.jpg'
      ],
    },
    {
      id: 'garden-view-room',
      label: 'Garden View Room',
      description: 'Conveniently located near the living area and pool, the Garden View Room enjoys easy access to the villa’s social spaces while overlooking Pandawa’s koi and turtle pond. A peaceful setting that balances connection and calm.',
      images: [
        '/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-1.jpg',
        '/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-2.jpg',
        '/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-3.jpg',
        '/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-4.jpg',
        '/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-5.jpg'
      ],
    },
    {
      id: 'pool-view-room',
      label: 'Pool View Room',
      description: 'With the infinity pool just steps from the bed, the Pool View Room offers an effortless indoor–outdoor living experience. Wake to ocean views and step straight into the pool, with the sea always within sight.',
      images: [
        '/images/villas/forever-pandawa/rooms/pool-view-room/pool-view-room-1.jpg',
        '/images/villas/forever-pandawa/rooms/pool-view-room/pool-view-room-2.jpg',
        '/images/villas/forever-pandawa/rooms/pool-view-room/pool-view-room-3.jpg'
      ],
    },
    {
      id: 'pandawa-studio',
      label: 'Pandawa Studio',
      description: 'Situated on the lower garden level, the Pandawa Studio features its own dining area and generous space, making it ideal for families or guests requiring additional room. The studio comfortably accommodates extra beds.',
      images: [
        '/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-1.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-2.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-3.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-4.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-5.jpg'
      ],
    },
    {
      id: 'pandawa-room',
      label: 'Pandawa Room',
      description: 'Also located on the lower garden level, the Pandawa Room is a spacious yet intimate retreat with a warm, cozy atmosphere — perfect for guests seeking comfort and privacy.',
      images: [
        '/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-1.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-2.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-3.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-4.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-5.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-6.jpg',
        '/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-7.jpg'
      ],
    },
  ],
  galleryImages: [
    '/images/villas/forever-pandawa/gallery/20250551 Harding Forever Pandawa Forever Santai_DSC21175 lo res.jpg',
    '/images/villas/forever-pandawa/gallery/Forever Santai B 23 HR.jpg',
    '/images/villas/forever-pandawa/gallery/Forever Santai B 24 HR.jpg',
    '/images/villas/forever-pandawa/gallery/Forever Santai B 25 HR.jpg',
    '/images/villas/forever-pandawa/gallery/Forever Santai B 37 HR.jpg'
  ],
  facilities: [
    {
      title: 'On-Site Staff',
      description: 'Dedicated villa manager, butler, and housekeeping available 24 hours.',
      imagePath: '/images/villas/forever-pandawa/facilities/facility-1.jpg',
    },
    {
      title: 'On-Site Laundry',
      description: 'In-villa laundry service with same-day turnaround.',
      imagePath: '/images/villas/forever-pandawa/facilities/facility-2.jpg',
    },
    {
      title: '24hr Security',
      description: 'Round-the-clock security team ensuring your privacy and safety.',
      imagePath: '/images/villas/forever-pandawa/facilities/facility-3.jpg',
    },
    {
      title: 'Private Chef',
      description: 'Personalised Balinese and international menus by our in-house chef team.',
      imagePath: '/images/villas/forever-pandawa/facilities/facility-4.jpg',
    },
    {
      title: 'Spa & Wellness',
      description: 'Traditional Balinese healing rituals, in-villa yoga, and massage.',
      imagePath: '/images/villas/forever-pandawa/facilities/facility-5.jpg',
    },
  ],
  testimonies: PANDAWA_TESTIMONIES,
  separatorImage: '/images/villas/forever-pandawa/gallery/Forever Santai B 25 HR.jpg',
};

export default async function ForeverPandawaPage() {
  const siteContent = await storageGet<Record<string, unknown>>('fbv:site-content', 'site-content.json');
  const vc = ((siteContent?.villas as Record<string, unknown>)?.['forever-pandawa'] as Record<string, unknown>) ?? {};

  const villa: VillaData = {
    ...pandawaData,
    ...(vc.name            ? { name:            vc.name            as string   } : {}),
    ...(vc.tagline         ? { tagline:          vc.tagline         as string   } : {}),
    ...(vc.heroTagline     ? { heroTagline:      vc.heroTagline     as string   } : {}),
    ...(vc.heroDescription ? { heroDescription:  vc.heroDescription as string   } : {}),
    ...(vc.description     ? { description:      vc.description     as string   } : {}),
    ...(vc.longDescription ? { longDescription:  vc.longDescription as string   } : {}),
    ...(vc.heroImage       ? { heroImage:        vc.heroImage       as string   } : {}),
    ...(vc.heroVideo       ? { heroVideo:        vc.heroVideo       as string   } : {}),
    ...(vc.separatorImage  ? { separatorImage:   vc.separatorImage  as string   } : {}),
    ...((vc.galleryImages  as string[])?.length      ? { galleryImages: vc.galleryImages as string[]             } : {}),
    ...((vc.rooms          as VillaData['rooms'])?.length  ? { rooms:       vc.rooms       as VillaData['rooms']       } : {}),
    ...((vc.amenities      as VillaData['amenities'])?.length ? { amenities: vc.amenities as VillaData['amenities']   } : {}),
    ...((vc.testimonies    as VillaData['testimonies'])?.length ? { testimonies: vc.testimonies as VillaData['testimonies'] } : {}),
  };

  return <VillaPage villa={villa} />;
}
