import type { Metadata } from 'next';
import { storageGet } from '@/lib/storage';
import FAQContent, { type FaqItem } from './FAQContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'FAQ — Forever Bali Villas',
  description: 'Frequently asked questions about booking, check-in, amenities, and staying at Forever Bali Villas.',
};

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: 'What time is check-in and check-out?',
    answer: 'Check-in is from 3:00 PM onwards, and check-out is by 11:00 AM. We kindly ask guests to share their estimated arrival time or flight details in advance so we can prepare for a smooth welcome. If you are arriving with your own driver, please send us a WhatsApp message when you’re on the way. Early check-in and late check-out requests must be made at least 24 hours in advance and are subject to availability. We may offer up to 45 minutes complimentary late check-out if available; beyond that, a fee of Rp 1.5 million per hour applies.',
  },
  {
    question: 'Do you offer airport transfers?',
    answer: 'Yes — and we highly recommend booking your airport transfer with us. Forever Bali Villas is located within Gapura Vista Residences, a secluded clifftop estate where inner roads can be tricky to navigate and Google Maps is not always reliable. Our experienced drivers know the exact route and ensure the smoothest arrival experience. Airport transfers start from Rp 500,000 per car. If you prefer to arrange your own driver, please share our contact number with them so we can assist with directions if needed.',
  },
  {
    question: 'What is the check-in process?',
    answer: 'As a fully staffed private villa, a member of our team will be on-site to personally greet you upon arrival and guide you through a smooth and welcoming check-in. To ensure everything is prepared for you, we kindly ask that you provide your flight details or estimated arrival time in advance. This allows our team to coordinate staffing and have the villa ready for your arrival.',
  },
  {
    question: 'What is nearby?',
    answer: 'Forever Bali Villas is tucked away on the clifftops of Gapura Vista Residences, offering privacy and a peaceful atmosphere. Pandawa Beach is just a short drive away, and the popular areas of Bingin and Uluwatu — known for beach clubs, surf breaks, and sunset dining — are approximately 30 minutes away (traffic dependent).',
  },
  {
    question: 'Is the Private Chef Mandatory? What is the fee?',
    answer: 'The private chef is not mandatory. Your stay already includes daily breakfast prepared by our team. If you’d like to enhance your experience, our private chef is available at Rp 1.8 million per day (excluding the cost of ingredients) and can prepare a wide range of dishes, from Western favourites to traditional Balinese cuisine.',
  },
  {
    question: 'What dining options are available besides the private chef?',
    answer: 'In addition to our in-villa private chef, guests may also order food delivery through GoJek or Grab. Local restaurants within immediate walking distance are limited due to the villa’s secluded cliffside location. However, Bingin, Uluwatu, and surrounding areas offer a wide selection of cafes, beach clubs, and international restaurants, all approximately 30 minutes away.',
  },
  {
    question: 'Do you offer in Villa Spa?',
    answer: 'Yes — we offer a range of in-villa spa treatments that can be enjoyed in the comfort and privacy of your villa. We recommend booking in advance to ensure therapist availability, especially during peak periods.',
  },
  {
    question: 'Do you offer excursions, tours, and bike rentals?',
    answer: 'Yes — we’re happy to assist with arranging a wide range of excursions, tours, and transport options, including bike and scooter rentals. Simply let us know what you have in mind, and we’ll take care of the arrangements for you.',
  },
];

export default async function FAQPage() {
  const siteContent = await storageGet<Record<string, unknown>>('fbv:site-content', 'site-content.json');
  const faq = (siteContent?.faq as Record<string, unknown>) ?? {};

  const heroTitle    = (faq.hero as Record<string, unknown>)?.title    as string | undefined;
  const heroSubtitle = (faq.hero as Record<string, unknown>)?.subtitle as string | undefined;
  const ctaTitle     = (faq.cta  as Record<string, unknown>)?.title    as string | undefined;
  const ctaDesc      = (faq.cta  as Record<string, unknown>)?.description as string | undefined;
  const items        = (faq.items as FaqItem[] | undefined);

  return (
    <FAQContent
      heroTitle={heroTitle    ?? 'Frequently Asked Questions'}
      heroSubtitle={heroSubtitle ?? 'Wondering how to book one of our beautiful Bali villas? Here are the most common questions from our guests.'}
      ctaTitle={ctaTitle     ?? 'Still Have Questions?'}
      ctaDesc={ctaDesc       ?? 'Our team is here to help. Reach out and we’ll respond within 24 hours.'}
      items={items && items.length > 0 ? items : DEFAULT_ITEMS}
    />
  );
}
