/**
 * pages/admin/AdminPage.jsx
 * Auth gate for admin area
 */
import { useAdminStore } from '../../store/adminStore';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const isAuthenticated = useAdminStore(s => s.isAuthenticated);
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}
