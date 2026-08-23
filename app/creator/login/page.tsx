'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
  loading: () => (
    <header className="bg-[#04342C] text-white border-b border-[#0F6E56] h-20 flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <Logo size="md" variant="color" />
      </div>
    </header>
  ),
});

export default function CreatorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/creators/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      router.push('/creator/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E1F5EE]">
      <Navbar />

      <main className="flex-1 py-16 px-4 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#04342C] text-emerald-300 flex items-center justify-center mx-auto border border-[#0F6E56]">
            <Sparkles className="w-6 h-6 text-[#1D9E75]" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#04342C]">Creator Log In</h1>
          <p className="text-sm text-[#5A6561]">Access your DealLink creator profile and settings</p>
        </div>

        <div className="deal-card p-6 sm:p-8 bg-white border border-[#CBDED7]">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0F6E56]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@channel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0F6E56]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-[#0F6E56] hover:bg-[#1D9E75] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#CBDED7] text-center text-xs text-[#5A6561]">
            Don&apos;t have a creator account yet?{' '}
            <Link href="/creator/signup" className="text-[#0F6E56] font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
