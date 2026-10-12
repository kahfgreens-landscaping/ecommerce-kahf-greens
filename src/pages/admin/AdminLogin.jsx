/**
 * pages/admin/AdminLogin.jsx
 */
import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const login = useAdminStore(s => s.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) onLogin?.();
    else setError('Invalid credentials. Try: admin / kahfgreens2024');
  };

  return (
    <div className="min-h-screen bg-brand-light-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-brand-dark">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Kahf Greens · Control Centre</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card space-y-4">
          <div>
            <label className="admin-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="admin-input"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="admin-label">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="admin-input pr-10"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2">{error}</p>}
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Demo: <code className="bg-muted px-1 rounded">admin</code> / <code className="bg-muted px-1 rounded">kahfgreens2024</code>
        </p>
      </div>
    </div>
  );
}
