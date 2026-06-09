import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';
import '@/app/admin/admin.css';

export const metadata: Metadata = {
  title: { default: 'Admin — Forever Bali Villas', template: '%s | FBV Admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
