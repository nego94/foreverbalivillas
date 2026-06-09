'use client';

import { useState } from 'react';
import Link from 'next/link';
import VillaRoomsGallery from './VillaRoomsGallery';
import VillaGalleryTestimonies, { TestimonyData } from './VillaGalleryTestimonies';
import styles from './VillaPage.module.css';

export interface RoomTab {
  id: string;
  label: string;
  description: string;
  images: string[];
}

export interface FacilityCard {
  title: string;
  description: string;
  imagePath: string;
}

export interface Amenity {
  label: string;
  icon: string;
}

export interface VillaData {
  slug: string;
  name: string;
  tagline: string;
  heroTagline: string;
  heroDescription: string;
  description: string;
  longDescription: string;
  heroImage?: string;
  heroVideo?: string;
  amenities: Amenity[];
  rooms: RoomTab[];
  galleryImages: string[];
  testimonies?: TestimonyData[];
  facilities: FacilityCard[];
  bookingUrl?: string;
  separatorImage?: string;
}

interface VillaPageProps {
  villa: VillaData;
}

export default function VillaPage({ villa }: VillaPageProps) {
  const [activeRoom, setActiveRoom] = useState(villa.rooms[0]?.id || '');
  return (
    <>
      {/* ── HERO ── */}
      <section className={styles.hero} aria-label={`${villa.name} hero`}>
        <div className={styles.heroImg}>
          {villa.heroVideo ? (
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className={styles.heroVideo}
            >
              <source 
                src={villa.heroVideo} 
                type={villa.heroVideo.endsWith('.webm') ? 'video/webm' : 'video/mp4'} 
              />
            </video>
          ) : villa.heroImage ? (
            <img src={villa.heroImage} alt={villa.name} className={styles.heroVideo} />
          ) : (
            <div className={styles.heroBg} />
          )}
        </div>
        <div className={styles.heroOverlay} />

        <div className={`container ${styles.heroContent}`} data-reveal>
          <h1 className={`t-hero ${styles.heroTitle}`}>{villa.name}</h1>
          <div className={styles.heroDivider} />
          
          <div className={styles.heroAmenities}>
            {villa.amenities.map(amenity => (
              <span key={amenity.label} className={styles.heroAmenityItem}>
                <img src={amenity.icon} alt="" className={styles.heroAmenityIcon} />
                {amenity.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── VILLA DESCRIPTION ── */}
      <section className={`section ${styles.descSection}`}>
        <div className="container">
          <div className={styles.descCenterWrapper} data-reveal>
            <h2 className={styles.descTitle}>{villa.tagline}</h2>
            <p className={styles.descText}>{villa.description}</p>
            <p className={styles.descText}>{villa.longDescription}</p>
          </div>
        </div>
      </section>

      {/* ── THE ROOMS ── */}
      <VillaRoomsGallery rooms={villa.rooms} />

      {/* ── GALLERY & TESTIMONIES ── */}
      <VillaGalleryTestimonies 
        images={villa.galleryImages} 
        testimonies={villa.testimonies} 
      />

      {/* ── IMAGE SEPARATOR ── */}
      <section className={styles.separatorSection}>
        <div className={styles.separatorImageWrap}>
          <img
            src={villa.separatorImage || '/images/separator-villas/separator-villas.jpg'}
            alt={`${villa.name} separator`}
            className={styles.separatorImage}
          />
        </div>
      </section>


    </>
  );
}
