'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ImageField from '@/components/admin/ImageField';
import StorageBanner from '@/components/admin/StorageBanner';
import { uploadFile } from '@/lib/upload';

// ── Hero media field (video OR image, one upload button) ──────────────────────

function HeroMediaField({ videoUrl, imageUrl, onVideoChange, onImageChange, folder }: {
  videoUrl: string; imageUrl: string;
  onVideoChange: (v: string) => void; onImageChange: (v: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUrl = videoUrl || imageUrl;
  const mediaType  = videoUrl ? 'video' : imageUrl ? 'image' : null;

  const isVideoUrl = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url);

  const setUrl = (url: string) => {
    if (isVideoUrl(url)) { onVideoChange(url); onImageChange(''); }
    else                 { onImageChange(url); onVideoChange(''); }
  };

  const clear = () => { onVideoChange(''); onImageChange(''); };

  const upload = async (file: File) => {
    setUploading(true); setError('');
    try {
      const data = await uploadFile(file);
      if (file.type.startsWith('video/')) { onVideoChange(data.url); onImageChange(''); }
      else                                { onImageChange(data.url); onVideoChange(''); }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed — check connection.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Preview */}
      {mediaType === 'video' && (
        <video src={videoUrl} controls muted style={{ width: '100%', maxHeight: '220px', borderRadius: '8px', background: '#000', display: 'block', marginBottom: '12px' }} />
      )}
      {mediaType === 'image' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Hero" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px', display: 'block', marginBottom: '12px' }} />
      )}
      {!mediaType && (
        <div style={{ height: '100px', border: '2px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.82rem', marginBottom: '12px' }}>
          No hero media — upload a video or image
        </div>
      )}

      {/* Type badge */}
      {mediaType && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', marginBottom: '10px',
          background: mediaType === 'video' ? '#f0fdf4' : '#eff6ff',
          color: mediaType === 'video' ? '#15803d' : '#1d4ed8' }}>
          {mediaType === 'video' ? '🎬 Video active' : '🖼 Image active'}
        </div>
      )}

      {/* URL input */}
      <input
        className="adm-input"
        value={currentUrl}
        onChange={e => setUrl(e.target.value)}
        placeholder="/videos/villa.mp4  or  /images/villa-hero.jpg"
        style={{ marginBottom: '8px' }}
      />

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm"
          onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : `↑ Upload video or image`}
        </button>
        {mediaType && (
          <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={clear}>Remove</button>
        )}
        {mediaType === 'video' && imageUrl === '' && (
          <span style={{ fontSize: '0.7rem', color: 'var(--adm-muted)' }}>Video set — image fallback optional below</span>
        )}
      </div>
      {error && <p style={{ color: 'var(--adm-danger)', fontSize: '0.75rem', marginTop: '6px' }}>{error}</p>}

      <input ref={inputRef} type="file" accept="image/*,video/mp4,video/webm,video/quicktime"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }} />

      {/* Fallback image if video is set */}
      {mediaType === 'video' && (
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--adm-border)' }}>
          <ImageField
            label="Fallback Image"
            hint="shown on devices that can't autoplay video"
            value={imageUrl}
            onChange={v => onImageChange(v)}
            folder={folder}
            aspect="16/9"
          />
        </div>
      )}

      <p style={{ fontSize: '0.7rem', color: 'var(--adm-muted)', marginTop: '8px' }}>
        Upload MP4/WebM for video or JPG/PNG/WebP for image. Video takes priority when both are set.
      </p>
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Room {
  id: string;
  label: string;
  description: string;
  images: string[];
}

interface Amenity   { label: string; icon: string; }
interface Testimony { id: string | number; rating: number; text: string; author: string; age: string | number; }

interface VillaContent {
  name?: string;
  tagline?: string;
  heroTagline?: string;
  heroDescription?: string;
  description?: string;
  longDescription?: string;
  heroImage?: string;
  heroVideo?: string;
  featuredImage?: string;
  separatorImage?: string;
  galleryImages?: string[];
  rooms?: Room[];
  amenities?: Amenity[];
  testimonies?: Testimony[];
}

// ── Default room seeds (fallback if storage has no rooms yet) ─────────────────

const DEFAULT_ROOMS: Record<string, Room[]> = {
  'forever-pandawa': [
    { id: 'ocean-suite-1',   label: 'Ocean Suite 1',   description: 'The epitome of modern Balinese luxury, Ocean Suite 1 offers uninterrupted ocean views directly from the bed. The experience is elevated by a sculptural marble bathtub and striking stone relief artwork, creating a serene and indulgent retreat.',
      images: ['/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-a.jpg','/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-b.jpg','/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-c.jpg','/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-d.jpg','/images/villas/forever-pandawa/rooms/ocean-suite-1/ocean-suite-1-e.jpg'] },
    { id: 'ocean-suite-2',   label: 'Ocean Suite 2',   description: 'Designed for added privacy, Ocean Suite 2 features a separate private entrance and a secluded balcony, perfect for quiet mornings overlooking the ocean. The suite also includes an outdoor bathtub set beside the tranquil turtle pond.',
      images: ['/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-a.jpg','/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-b.jpg','/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-c.jpg','/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-d.jpg','/images/villas/forever-pandawa/rooms/ocean-suite-2/ocean-suite-2-e.jpg'] },
    { id: 'garden-view-room', label: 'Garden View Room', description: 'Conveniently located near the living area and pool, the Garden View Room enjoys easy access to the villa\'s social spaces while overlooking Pandawa\'s koi and turtle pond. A peaceful setting that balances connection and calm.',
      images: ['/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-1.jpg','/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-2.jpg','/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-3.jpg','/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-4.jpg','/images/villas/forever-pandawa/rooms/garden-view-room/garden-view-room-5.jpg'] },
    { id: 'pool-view-room',  label: 'Pool View Room',  description: 'With the infinity pool just steps from the bed, the Pool View Room offers an effortless indoor–outdoor living experience. Wake to ocean views and step straight into the pool, with the sea always within sight.',
      images: ['/images/villas/forever-pandawa/rooms/pool-view-room/pool-view-room-1.jpg','/images/villas/forever-pandawa/rooms/pool-view-room/pool-view-room-2.jpg','/images/villas/forever-pandawa/rooms/pool-view-room/pool-view-room-3.jpg'] },
    { id: 'pandawa-studio',  label: 'Pandawa Studio',  description: 'Situated on the lower garden level, the Pandawa Studio features its own dining area and generous space, making it ideal for families or guests requiring additional room. The studio comfortably accommodates extra beds.',
      images: ['/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-1.jpg','/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-2.jpg','/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-3.jpg','/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-4.jpg','/images/villas/forever-pandawa/rooms/pandawa-studio/pandawa-studio-5.jpg'] },
    { id: 'pandawa-room',    label: 'Pandawa Room',    description: 'Also located on the lower garden level, the Pandawa Room is a spacious yet intimate retreat with a warm, cozy atmosphere — perfect for guests seeking comfort and privacy.',
      images: ['/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-1.jpg','/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-2.jpg','/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-3.jpg','/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-4.jpg','/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-5.jpg','/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-6.jpg','/images/villas/forever-pandawa/rooms/pandawa-room/pandawa-room-7.jpg'] },
  ],
  'forever-santai': [
    { id: 'ocean-lookout-master', label: 'Ocean Lookout Master', description: 'Perched on the 3rd and highest level, this suite comes with marble bathtub, indoor and outdoor shower and closest access to the ocean lookout patio.',
      images: ['/images/villas/forever-santai/rooms/ocean-lookout-master/1.jpg','/images/villas/forever-santai/rooms/ocean-lookout-master/2.jpg','/images/villas/forever-santai/rooms/ocean-lookout-master/3.jpg','/images/villas/forever-santai/rooms/ocean-lookout-master/4.jpg','/images/villas/forever-santai/rooms/ocean-lookout-master/5.jpg','/images/villas/forever-santai/rooms/ocean-lookout-master/6.jpg'] },
    { id: 'santai-master',        label: 'Santai Master',        description: 'Located on one side of the infinity pool, this master suite has an indoor shower, a private outdoor tub and a separate balcony.',
      images: ['/images/villas/forever-santai/rooms/santai-master/1.jpg','/images/villas/forever-santai/rooms/santai-master/2.jpg','/images/villas/forever-santai/rooms/santai-master/3.jpg','/images/villas/forever-santai/rooms/santai-master/4.jpg'] },
    { id: 'santai-guest',         label: 'Santai Guest',         description: 'This suite\'s beautiful view will have you stepping straight from bed to the pool in just a few effortless steps.',
      images: ['/images/villas/forever-santai/rooms/santai-guest/1.jpg','/images/villas/forever-santai/rooms/santai-guest/2.jpg','/images/villas/forever-santai/rooms/santai-guest/3.jpg'] },
    { id: 'santai-twin',          label: 'Twin Room',            description: 'This suite is ideal for children or teenagers who want their own space. It features two twin beds however they can be converted to a King size upon request.',
      images: ['/images/villas/forever-santai/rooms/santai-childrens/1.jpg','/images/villas/forever-santai/rooms/santai-childrens/2.jpg','/images/villas/forever-santai/rooms/santai-childrens/3.jpg'] },
    { id: 'garden-view-studio',   label: 'Garden View Studio',   description: 'Equipped with a kitchenette for simple cooking and a private, tucked-away feel on the garden level. Enjoy the quaint garden pathway and your own plunge pool for quiet moments of relaxation.',
      images: ['/images/villas/forever-santai/rooms/garden-view-studio/1.jpg','/images/villas/forever-santai/rooms/garden-view-studio/2.jpg','/images/villas/forever-santai/rooms/garden-view-studio/3.jpg','/images/villas/forever-santai/rooms/garden-view-studio/4.jpg','/images/villas/forever-santai/rooms/garden-view-studio/5.jpg','/images/villas/forever-santai/rooms/garden-view-studio/6.jpg','/images/villas/forever-santai/rooms/garden-view-studio/7.jpg','/images/villas/forever-santai/rooms/garden-view-studio/8.jpg'] },
    { id: 'santai-garden-view',   label: 'Garden View Guest',    description: 'This large and spacious suite is tucked in a cozy corner in the garden level. Perfect for the guest who relishes a little extra privacy.',
      images: ['/images/villas/forever-santai/rooms/santai-garden-view-guest/1.jpg','/images/villas/forever-santai/rooms/santai-garden-view-guest/2.jpg'] },
  ],
};

const DEFAULT_AMENITIES: Record<string, Amenity[]> = {
  'forever-pandawa': [
    { label: 'À la Carte',       icon: '/images/icons/villas-icon/Breakfast.png' },
    { label: 'Bathroom',         icon: '/images/icons/villas-icon/Bathtub.png'   },
    { label: 'Dining Room',      icon: '/images/icons/villas-icon/Food.png'      },
    { label: 'Air Conditioning', icon: '/images/icons/villas-icon/AC.png'        },
    { label: 'Bedrooms',         icon: '/images/icons/villas-icon/Bed.png'       },
    { label: 'Private Chef',     icon: '/images/icons/villas-icon/Cook.png'      },
    { label: 'Pool',             icon: '/images/icons/villas-icon/Pool.png'      },
    { label: 'Living Room',      icon: '/images/icons/villas-icon/Sofa.png'      },
    { label: 'BBQ Facility',     icon: '/images/icons/villas-icon/Grill.png'     },
    { label: '24/7 Security',    icon: '/images/icons/villas-icon/Alarm.png'     },
  ],
  'forever-santai': [
    { label: 'À la Carte',       icon: '/images/icons/villas-icon/Breakfast.png' },
    { label: 'Bathroom',         icon: '/images/icons/villas-icon/Bathtub.png'   },
    { label: 'Dining Room',      icon: '/images/icons/villas-icon/Food.png'      },
    { label: 'Air Conditioning', icon: '/images/icons/villas-icon/AC.png'        },
    { label: 'Bedrooms',         icon: '/images/icons/villas-icon/Bed.png'       },
    { label: 'Private Chef',     icon: '/images/icons/villas-icon/Cook.png'      },
    { label: 'Pool',             icon: '/images/icons/villas-icon/Pool.png'      },
    { label: 'Living Room',      icon: '/images/icons/villas-icon/Sofa.png'      },
    { label: 'BBQ Facility',     icon: '/images/icons/villas-icon/Grill.png'     },
    { label: 'Spa',              icon: '/images/icons/villas-icon/Alarm.png'     },
  ],
};

const DEFAULT_TESTIMONIES: Record<string, Testimony[]> = {
  'forever-pandawa': [
    { id: 1, rating: 5, author: 'Nico B.',       age: 29, text: 'Forever Pandawa felt like our own private corner of Bali. The architecture is stunning and the team made us feel completely at home. Already planning our return.' },
    { id: 2, rating: 5, author: 'James & Lisa',  age: 41, text: 'We celebrated our anniversary here and it exceeded every expectation. The private pool, the sunset views, the breakfast spread — everything was flawless.' },
    { id: 3, rating: 5, author: 'Marcus T.',     age: 38, text: 'The grandeur of Pandawa is unlike anything we\'ve experienced. Six bedrooms, an infinity pool overlooking the ocean, and a team that treated us like family.' },
    { id: 4, rating: 5, author: 'Tom & Rachel',  age: 45, text: 'From the seamless check-in to the thoughtful little touches throughout our stay — this is exactly what a luxury villa experience should feel like.' },
    { id: 5, rating: 5, author: 'Chloe & David', age: 33, text: 'The ocean views from the top level took our breath away every single morning. Pandawa is a once-in-a-lifetime stay that we will absolutely repeat.' },
  ],
  'forever-santai': [
    { id: 1, rating: 5, author: 'Sarah M.',         age: 34, text: 'Waking up to the sound of the ocean every morning was pure magic. The villa staff anticipated every need before we even asked — truly world-class hospitality.' },
    { id: 2, rating: 5, author: 'Emma & Will',      age: 36, text: 'Santai lives up to its name — we completely relaxed from the moment we arrived. The newly renovated interiors are beautiful and the pool level is stunning.' },
    { id: 3, rating: 5, author: 'Priya K.',         age: 37, text: 'The level of privacy and tranquility here is unmatched. After a week of exploring Bali, coming back to Santai each evening felt like a true retreat.' },
    { id: 4, rating: 5, author: 'The Hendersons',   age: 44, text: 'Six bedrooms, a gym, a movie room, a private infinity pool — Forever Santai has thought of everything. Our family had the most unforgettable holiday.' },
    { id: 5, rating: 5, author: 'Lena F.',          age: 41, text: 'The garden-level studio was perfect for our teenagers. Meanwhile the adults had the ocean-view master all to themselves. The layout is genius.' },
  ],
};

const VILLA_NAMES: Record<string, string> = {
  'forever-pandawa': 'Forever Pandawa',
  'forever-santai':  'Forever Santai',
};

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="adm-card" style={{ marginBottom: '20px' }}>
      <div className="adm-card-header">
        <span className="adm-card-title">{title}</span>
        {hint && <span style={{ fontSize: '0.72rem', color: 'var(--adm-muted)' }}>{hint}</span>}
      </div>
      <div className="adm-card-body" style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline, rows = 3, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; rows?: number; hint?: string;
}) {
  return (
    <div className="adm-form-group">
      <label className="adm-label">{label}{hint && <span className="adm-label-hint">{hint}</span>}</label>
      {multiline
        ? <textarea className="adm-textarea" rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)} />
        : <input className="adm-input" value={value ?? ''} onChange={e => onChange(e.target.value)} />}
    </div>
  );
}

// ── Room card ─────────────────────────────────────────────────────────────────

function RoomCard({
  room, index, slug,
  onChange, onRemove,
}: {
  room: Room; index: number; slug: string;
  onChange: (r: Room) => void; onRemove: () => void;
}) {
  const [open,       setOpen]       = useState(index === 0);
  const [confirming, setConfirming] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    onRemove();
  };

  const setField = (k: keyof Room, v: string) => onChange({ ...room, [k]: v });
  const setImage = (i: number, v: string) => {
    const imgs = [...room.images]; imgs[i] = v; onChange({ ...room, images: imgs });
  };
  const removeImage = (i: number) => onChange({ ...room, images: room.images.filter((_, j) => j !== i) });
  const addImage = () => onChange({ ...room, images: [...room.images, ''] });

  return (
    <div style={{ border: '1px solid var(--adm-border)', borderRadius: '10px', marginBottom: '12px', overflow: 'hidden' }}>
      {/* Room header — click to toggle */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: open ? '#f8fafb' : '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--adm-font)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: 'var(--adm-accent)', color: '#fff', borderRadius: '6px',
            width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
          }}>{index + 1}</span>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--adm-text)' }}>
            {room.label || `Room ${index + 1}`}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--adm-muted)' }}>
            {room.images.filter(Boolean).length} image{room.images.filter(Boolean).length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleRemove}
            className="adm-btn adm-btn-danger adm-btn-sm"
            style={{ fontSize: '0.72rem' }}
          >{confirming ? 'Confirm?' : 'Remove'}</button>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {/* Room body */}
      {open && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Room Name" value={room.label} onChange={v => setField('label', v)} />
          </div>
          <Field label="Description" value={room.description} onChange={v => setField('description', v)} multiline rows={3} />

          <div className="adm-form-group" style={{ marginBottom: 0 }}>
            <label className="adm-label">Room Images <span className="adm-label-hint">{room.images.filter(Boolean).length} images</span></label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              {room.images.map((img, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <ImageField
                      label={`Image ${i + 1}`}
                      value={img}
                      onChange={v => setImage(i, v)}
                      folder={`villas/${slug}`}
                      aspect="4/3"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="adm-btn adm-btn-danger adm-btn-sm"
                    style={{ marginTop: '22px', whiteSpace: 'nowrap', flexShrink: 0 }}
                  >Remove</button>
                </div>
              ))}
            </div>
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addImage}>
              + Add Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function VillaEditorPage() {
  const { slug } = useParams() as { slug: string };
  const villaName = VILLA_NAMES[slug] ?? slug;

  const [villa, setVilla] = useState<VillaContent | null>(null);
  const [storageMode, setStorageMode] = useState<'custom' | 'kv' | 'file' | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(res => {
      const data = res.data ?? res;
      setStorageMode(res.storage ?? 'file');
      const v = (data?.villas?.[slug] ?? {}) as VillaContent;
      if (!v.rooms       || v.rooms.length === 0)       v.rooms       = DEFAULT_ROOMS[slug]      ?? [];
      if (!v.amenities   || v.amenities.length === 0)   v.amenities   = DEFAULT_AMENITIES[slug]  ?? [];
      if (!v.testimonies || v.testimonies.length === 0) v.testimonies = DEFAULT_TESTIMONIES[slug] ?? [];
      setVilla(v);
    });
  }, [slug]);

  const set = useCallback((k: keyof VillaContent, v: unknown) =>
    setVilla(prev => prev ? { ...prev, [k]: v } : prev), []);

  const setRoom = useCallback((i: number, r: Room) =>
    setVilla(prev => {
      if (!prev) return prev;
      const rooms = [...(prev.rooms ?? [])];
      rooms[i] = r;
      return { ...prev, rooms };
    }), []);

  const removeRoom = useCallback((i: number) =>
    setVilla(prev => {
      if (!prev) return prev;
      return { ...prev, rooms: (prev.rooms ?? []).filter((_, j) => j !== i) };
    }), []);

  const addRoom = () => setVilla(prev => {
    if (!prev) return prev;
    const newRoom: Room = { id: `room-${Date.now()}`, label: 'New Room', description: '', images: [] };
    return { ...prev, rooms: [...(prev.rooms ?? []), newRoom] };
  });

  const setAmenity = useCallback((i: number, field: keyof Amenity, v: string) =>
    setVilla(prev => {
      if (!prev) return prev;
      const next = [...(prev.amenities ?? [])];
      next[i] = { ...next[i], [field]: v };
      return { ...prev, amenities: next };
    }), []);

  const setTestimony = useCallback((i: number, field: keyof Testimony, v: string | number) =>
    setVilla(prev => {
      if (!prev) return prev;
      const next = [...(prev.testimonies ?? [])];
      next[i] = { ...next[i], [field]: v };
      return { ...prev, testimonies: next };
    }), []);

  const save = async () => {
    if (!villa) return;
    setSaving(true); setStatus('idle');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ villas: { [slug]: villa } }),
      });
      setStatus(res.ok ? 'ok' : 'error');
      setTimeout(() => setStatus('idle'), 5000);
    } catch { setStatus('error'); }
    finally { setSaving(false); }
  };

  if (!villa) return <div style={{ padding: '40px', color: 'var(--adm-muted)' }}>Loading…</div>;

  const rooms        = villa.rooms       ?? [];
  const galleryImages = villa.galleryImages ?? [];
  const amenities    = villa.amenities   ?? [];
  const testimonies  = villa.testimonies ?? [];

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Link href="/admin/villas" className="adm-btn adm-btn-ghost adm-btn-sm">← All Villas</Link>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--adm-text)', flex: 1 }}>{villaName}</h1>
        <Link href={`/${slug}`} target="_blank" className="adm-btn adm-btn-ghost adm-btn-sm">View live ↗</Link>
        <button
          className="adm-btn adm-btn-primary"
          onClick={save}
          disabled={saving}
          style={{ gap: '8px' }}
        >
          {saving && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </svg>
          )}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <StorageBanner mode={storageMode} />

      {status === 'ok'    && <div className="adm-alert adm-alert-ok" style={{ marginBottom: '16px' }}>Saved! Changes appear on the site within a few minutes.</div>}
      {status === 'error' && <div className="adm-alert adm-alert-error" style={{ marginBottom: '16px' }}>Save failed — check your connection.</div>}

      {/* ── 1. Villa Info ── */}
      <Section title="Villa Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field label="Villa Name" value={villa.name ?? ''} onChange={v => set('name', v)} />
          <Field label="Tagline" value={villa.tagline ?? ''} onChange={v => set('tagline', v)} />
        </div>
        <Field label="Short Description" value={villa.description ?? ''} onChange={v => set('description', v)} multiline rows={3} />
        <Field label="Long Description" value={villa.longDescription ?? ''} onChange={v => set('longDescription', v)} multiline rows={4} />
      </Section>

      {/* ── 2. Hero + Featured Image (side by side) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>
        {/* Hero media */}
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">Hero</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--adm-muted)' }}>full-screen at top of villa page</span>
          </div>
          <div className="adm-card-body">
            <HeroMediaField
              videoUrl={villa.heroVideo ?? ''}
              imageUrl={villa.heroImage ?? ''}
              onVideoChange={v => set('heroVideo', v)}
              onImageChange={v => set('heroImage', v)}
              folder={`villas/${slug}`}
            />
          </div>
        </div>

        {/* Featured image — admin only */}
        <div className="adm-card" style={{ border: '2px dashed var(--adm-border)' }}>
          <div className="adm-card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            <span className="adm-card-title">Dashboard Preview</span>
            <span style={{ fontSize: '0.68rem', background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>
              Admin only · not shown on site
            </span>
          </div>
          <div className="adm-card-body">
            <ImageField
              label="Featured Image"
              hint="shown on the Villas admin card so you can tell villas apart"
              value={villa.featuredImage ?? ''}
              onChange={v => set('featuredImage', v)}
              folder={`villas/${slug}`}
              aspect="4/3"
              stacked
            />
          </div>
        </div>
      </div>

      {/* ── 3. Amenities ── */}
      <Section title="Amenities" hint={`${amenities.length} items · icon grid shown on villa page`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
          {amenities.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
              <div style={{ width: 36, height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
                {item.icon
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={item.icon} alt="" width={28} height={28} style={{ objectFit: 'contain' }} />
                  : <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>icon</span>}
              </div>
              <input className="adm-input" value={item.icon} placeholder="/images/icons/villas-icon/Bed.png"
                style={{ flex: 2 }}
                onChange={e => setAmenity(i, 'icon', e.target.value)} />
              <input className="adm-input" value={item.label} placeholder="Label"
                style={{ flex: 1 }}
                onChange={e => setAmenity(i, 'label', e.target.value)} />
              <button type="button" className="adm-btn adm-btn-danger adm-btn-sm"
                onClick={() => set('amenities', amenities.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm"
          onClick={() => set('amenities', [...amenities, { label: 'New Amenity', icon: '' }])}>
          + Add Amenity
        </button>
        <p style={{ fontSize: '0.7rem', color: 'var(--adm-muted)', marginTop: '8px' }}>
          Icon path must be a URL or a path like <code>/images/icons/villas-icon/Bed.png</code>. Upload icons via Media Library.
        </p>
      </Section>

      {/* ── 4. Rooms ── */}
      <Section title="Rooms" hint={`${rooms.length} room${rooms.length !== 1 ? 's' : ''} · click a room to expand`}>
        {rooms.length === 0 && (
          <p style={{ color: 'var(--adm-muted)', fontSize: '0.82rem', margin: '8px 0' }}>No rooms yet. Add one below.</p>
        )}
        {rooms.map((room, i) => (
          <RoomCard
            key={room.id}
            room={room}
            index={i}
            slug={slug}
            onChange={r => setRoom(i, r)}
            onRemove={() => removeRoom(i)}
          />
        ))}
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" style={{ alignSelf: 'flex-start' }} onClick={addRoom}>
          + Add Room
        </button>
      </Section>

      {/* ── 4. Gallery ── */}
      <Section title="Main Gallery" hint={`${galleryImages.filter(Boolean).length} images · shown below the rooms section`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {galleryImages.map((img, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <ImageField
                  label={`Gallery Image ${i + 1}`}
                  value={img}
                  onChange={v => { const next = [...galleryImages]; next[i] = v; set('galleryImages', next); }}
                  folder={`villas/${slug}`}
                  aspect="4/3"
                />
              </div>
              <button type="button" onClick={() => set('galleryImages', galleryImages.filter((_, j) => j !== i))}
                className="adm-btn adm-btn-danger adm-btn-sm" style={{ marginTop: '22px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" style={{ alignSelf: 'flex-start' }}
          onClick={() => set('galleryImages', [...galleryImages, ''])}>
          + Add Gallery Image
        </button>
      </Section>

      {/* ── 5. Testimonials ── */}
      <Section title="Testimonials" hint={`${testimonies.length} reviews shown in the slider`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '10px' }}>
          {testimonies.map((t, i) => (
            <div key={i} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <input className="adm-input" value={t.author} placeholder="Author name"
                  onChange={e => setTestimony(i, 'author', e.target.value)} />
                <input className="adm-input" value={String(t.age)} placeholder="Age"
                  onChange={e => setTestimony(i, 'age', e.target.value)} />
                <select className="adm-select" value={t.rating}
                  onChange={e => setTestimony(i, 'rating', Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>)}
                </select>
                <button type="button" className="adm-btn adm-btn-danger adm-btn-sm"
                  onClick={() => set('testimonies', testimonies.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
              <textarea className="adm-textarea" rows={3} value={t.text} placeholder="Testimonial text…"
                onChange={e => setTestimony(i, 'text', e.target.value)} />
            </div>
          ))}
        </div>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm"
          onClick={() => set('testimonies', [...testimonies, { id: Date.now(), rating: 5, text: '', author: '', age: '' }])}>
          + Add Testimonial
        </button>
      </Section>

      {/* ── 6. Separator Image ── */}
      <Section title="Separator Image" hint="full-width image displayed just above the footer">
        <ImageField
          label="Separator Image"
          value={villa.separatorImage ?? ''}
          onChange={v => set('separatorImage', v)}
          folder={`villas/${slug}`}
          aspect="21/9"
        />
      </Section>
    </>
  );
}
