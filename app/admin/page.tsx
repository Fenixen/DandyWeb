import { cookies } from 'next/headers';
import { verifyToken, SESSION_COOKIE } from '@/lib/auth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Admin — Dandy's Wear" };

export default async function AdminPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const ok = await verifyToken(token);
  if (!ok) return <AdminLogin />;
  return <AdminDashboard />;
}
