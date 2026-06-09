import type { Metadata } from 'next';
import VillaPage from '@/components/VillaPage';
import type { VillaData } from '@/components/VillaPage';
import type { TestimonyData } from '@/components/VillaGalleryTestimonies';
import { storageGet } from '@/lib/storage';

export const revalidate = 60;

const SANTAI_TESTIMONIES: TestimonyData[] = [
  {
    id: 1,
    rating: 5,
    text: "Waking up to the sound of the ocean every morning was pure magic. The villa staff anticipated every need before we even asked — truly world-class hospitality.",
    author: "Sarah M.",
    age: 34,
  },
  {
    id: 2,
    rating: 5,
    text: "Santai lives up to its name — we completely relaxed from the moment we arrived. The newly renovated interiors are beautiful and the pool level is stunning.",
    author: "Emma & Will",
    age: 36,
  },
  {
    id: 3,
    rating: 5,
    text: "The level of privacy and tranquility here is unmatched. After a week of exploring Bali, coming back to Santai each evening felt like a true retreat.",
    author: "Priya K.",
    age: 37,
  },
  {
    id: 4,
    rating: 5,
    text: "Six bedrooms, a gym, a movie room, a private infinity pool — Forever Santai has thought of everything. Our family had the most unforgettable holiday.",
    author: "The Hendersons",
    age: 44,
  },
  {
    id: 5,
    rating: 5,
    text: "The garden-level studio was perfect for our teenagers. Meanwhile the adults had the ocean-view master all to themselves. The layout is genius.",
    author: "Lena F.",
    age: 41,
  },
];

export const metadata: Metadata = {
  title: 'Forever Santai — Luxury Private Villa Bali',
  description:
    'Newly renovated and ready for your stay. Forever Santai offers private pool, lush tropical gardens and Balinese luxury in Nusa Dua, Bali.',
};

const santaiData: VillaData = {
  slug: 'forever-santai',
  name: 'Forever Santai',
  tagline: 'Newly Renovated and Ready for Your Stay',
  heroTagline: 'Forever Santai • Nusa Dua, Bali',
  heroDescription:
    'Forever Santai is a spacious three-story luxury villa designed for comfort, privacy, and effortless group living. The villa features six bedrooms (five king bedrooms and one bedroom with 2 twins) and six bathrooms and can sleep 12 to 14 with added beds.',
  description:
    'Each room enjoys smart TVs, desks or dressers, spacious closets and air conditioning. Living spaces are spread across three levels: a garden level, a pool level, and an ocean-view level.',
  longDescription:
    'Amenities include a fully equipped kitchen, indoor dining area, gym infinity pool with sun deck, private spa room, movie room, ping-pong table, and high-speed Wi-Fi throughout. The villa is fully staffed and includes a private chef for seamless in-villa dining.',
  heroImage: '/images/villas/forever-santai/hero/hero.jpg',
  heroVideo: '/videos/villas/forever-santai/forever-santai-video.mp4',
  amenities: [
    { label: 'À la Carte', icon: '/images/icons/villas-icon/Breakfast.png' },
    { label: 'Spa', icon: '/images/icons/villas-icon/Alarm.png' }, // or something else, but we don't have Spa icon. I will use Alarm for now or omit. Wait, we have AC, Alarm, Bathtub, Bed, Breakfast, Cook, Food, Grill, Pool, Sofa.
    { label: 'Bathroom', icon: '/images/icons/villas-icon/Bathtub.png' },
    { label: 'Dining Room', icon: '/images/icons/villas-icon/Food.png' },
    { label: 'Air Conditioning', icon: '/images/icons/villas-icon/AC.png' },
    { label: 'Bedrooms', icon: '/images/icons/villas-icon/Bed.png' },
    { label: 'Private Chef', icon: '/images/icons/villas-icon/Cook.png' },
    { label: 'Pool', icon: '/images/icons/villas-icon/Pool.png' },
    { label: 'Living Room', icon: '/images/icons/villas-icon/Sofa.png' },
    { label: 'BBQ Facility', icon: '/images/icons/villas-icon/Grill.png' },
  ],
  rooms: [
    {
      id: 'ocean-lookout-master',
      label: 'Ocean Lookout Master',
      description: 'Perched on the 3rd and highest level, this suite comes with marble bathtub, indoor and outdoor shower and closest access to the ocean lookout patio.',
      images: [
        '/images/villas/forever-santai/rooms/ocean-lookout-master/1.jpg',
        '/images/villas/forever-santai/rooms/ocean-lookout-master/2.jpg',
        '/images/villas/forever-santai/rooms/ocean-lookout-master/3.jpg',
        '/images/villas/forever-santai/rooms/ocean-lookout-master/4.jpg',
        '/images/villas/forever-santai/rooms/ocean-lookout-master/5.jpg',
        '/images/villas/forever-santai/rooms/ocean-lookout-master/6.jpg'
      ],
    },
    {
      id: 'santai-master',
      label: 'Santai Master',
      description: 'Located on one side of the infinity pool, this master suite has an indoor shower, a private outdoor tub and a separate balcony.',
      images: [
        '/images/villas/forever-santai/rooms/santai-master/1.jpg',
        '/images/villas/forever-santai/rooms/santai-master/2.jpg',
        '/images/villas/forever-santai/rooms/santai-master/3.jpg',
        '/images/villas/forever-santai/rooms/santai-master/4.jpg'
      ],
    },
    {
      id: 'santai-guest',
      label: 'Santai Guest',
      description: 'This suite’s beautiful view will have you stepping straight from bed to the pool in just a few effortless steps.',
      images: [
        '/images/villas/forever-santai/rooms/santai-guest/1.jpg',
        '/images/villas/forever-santai/rooms/santai-guest/2.jpg',
        '/images/villas/forever-santai/rooms/santai-guest/3.jpg'
      ],
    },
    {
      id: 'santai-childrens',
      label: "Twin Room",
      description: 'This suite is ideal for children or teenagers who want their own space. It features two twin beds however they can be converted in to a King size upon request. The ensuite bathroom includes a luxurious bathtub, perfect for unwinding after a day of activities.',
      images: [
        '/images/villas/forever-santai/rooms/santai-childrens/1.jpg',
        '/images/villas/forever-santai/rooms/santai-childrens/2.jpg',
        '/images/villas/forever-santai/rooms/santai-childrens/3.jpg'
      ],
    },
    {
      id: 'garden-view-studio',
      label: 'Garden View Studio',
      description: 'Equipped with a kitchenette for simple cooking and a private, tucked-away feel on the garden level. Enjoy the quaint garden pathway and your own plunge pool for quiet moments of relaxation.',
      images: [
        '/images/villas/forever-santai/rooms/garden-view-studio/1.jpg',
        '/images/villas/forever-santai/rooms/garden-view-studio/2.jpg',
        '/images/villas/forever-santai/rooms/garden-view-studio/3.jpg',
        '/images/villas/forever-santai/rooms/garden-view-studio/4.jpg',
        '/images/villas/forever-santai/rooms/garden-view-studio/5.jpg',
        '/images/villas/forever-santai/rooms/garden-view-studio/6.jpg',
        '/images/villas/forever-santai/rooms/garden-view-studio/7.jpg',
        '/images/villas/forever-santai/rooms/garden-view-studio/8.jpg'
      ],
    },
    {
      id: 'santai-garden-view',
      label: 'Garden View Guest',
      description: 'This large and spacious suite is tucked in a cozy corner in the garden level. Perfect for the guest who relishes little extra privacy.',
      images: [
        '/images/villas/forever-santai/rooms/santai-garden-view-guest/1.jpg',
        '/images/villas/forever-santai/rooms/santai-garden-view-guest/2.jpg'
      ],
    },
  ],
  galleryImages: [
    '/images/villas/forever-santai/gallery/60-DSC05649.jpg',
    '/images/villas/forever-santai/gallery/Forever Santai A 10 HR.jpg',
    '/images/villas/forever-santai/gallery/Forever Santai A 11 HR.jpg',
    '/images/villas/forever-santai/gallery/Forever Santai A 12 HR.jpg',
    '/images/villas/forever-santai/gallery/Outdoor seating.JPG'
  ],
  facilities: [
    {
      title: 'On-Site Staff',
      description: 'Dedicated villa manager, butler, and housekeeping available 24 hours.',
      imagePath: '/images/villas/forever-santai/facilities/facility-1.jpg',
    },
    {
      title: 'On-Site Laundry',
      description: 'In-villa laundry service with same-day turnaround.',
      imagePath: '/images/villas/forever-santai/facilities/facility-2.jpg',
    },
    {
      title: '24hr Security',
      description: 'Round-the-clock security team ensuring your privacy and safety.',
      imagePath: '/images/villas/forever-santai/facilities/facility-3.jpg',
    },
    {
      title: 'Private Chef',
      description: 'Personalised menus crafted by our in-house Balinese chef.',
      imagePath: '/images/villas/forever-santai/facilities/facility-4.jpg',
    },
    {
      title: 'Spa & Wellness',
      description: 'In-villa spa treatments, yoga sessions, and massage therapy.',
      imagePath: '/images/villas/forever-santai/facilities/facility-5.jpg',
    },
  ],
  testimonies: SANTAI_TESTIMONIES,
  separatorImage: '/images/villas/forever-santai/gallery/Forever Santai A 27 HR.jpg',
};

export default async function ForeverSantaiPage() {
  const siteContent = await storageGet<Record<string, unknown>>('fbv:site-content', 'site-content.json');
  const vc = ((siteContent?.villas as Record<string, unknown>)?.['forever-santai'] as Record<string, unknown>) ?? {};

  const villa: VillaData = {
    ...santaiData,
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
