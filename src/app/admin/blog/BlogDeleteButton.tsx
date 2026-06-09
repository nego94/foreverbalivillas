'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BlogDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading,    setLoading]    = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handle = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setConfirming(false);
    setLoading(true);
    await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' });
    router.refresh();
    setLoading(false);
  };

  return (
    <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={handle} disabled={loading}>
      {loading ? '…' : confirming ? 'Confirm?' : 'Delete'}
    </button>
  );
}
