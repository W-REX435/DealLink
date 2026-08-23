'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, ArrowRight, User, Mail, Lock, Link as LinkIcon, BarChart2, Tag, FileText, Sparkles } from 'lucide-react';
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

const NICHES = [
  'Tech & SaaS',
  'Gaming & Esports',
  'Finance & Investing',
  'Lifestyle & Vlogs',
  'Productivity & Business',
  'Fitness & Health',
  'Education & Learning',
  'Beauty & Fashion',
  'Entertainment & Comedy',
  'Other Niche',
];

export default function CreatorSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    channel_url: '',
    subscriber_count: '',
    niche: NICHES[0],
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredCreator, setRegisteredCreator] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/creators/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setRegisteredCreator(data.creator);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E1F5EE]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {registeredCreator ? (
          /* Solid Post-Submit Confirmation Screen */
          <div className="deal-card p-8 sm:p-12 bg-white border border-[#CBDED7] space-y-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#E1F5EE] border-2 border-[#1D9E75] rounded-full flex items-center justify-center mx-auto text-[#0F6E56]">
              <CheckCircle2 className="w-10 h-10 text-[#1D9E75]" />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E1F5EE] text-[#0F6E56] rounded-full text-xs font-bold uppercase tracking-wider">
                Registration Confirmed
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#04342C]">
                You&apos;re in.
              </h1>
              <p className="text-[#2C2C2A] text-lg sm:text-xl font-medium leading-relaxed">
                Your profile is now part of DealLink&apos;s creator network. We&apos;ll reach out as soon as we have a brand match for you.
              </p>
            </div>

            {/* Profile summary card */}
            <div className="bg-[#04342C] text-white p-6 rounded-xl text-left max-w-xl mx-auto space-y-3 border border-[#0F6E56]">
              <div className="flex items-center justify-between border-b border-[#0F6E56] pb-3">
                <div>
                  <h3 className="font-bold text-lg text-white">{registeredCreator.name}</h3>
                  <p className="text-xs text-emerald-200">{registeredCreator.email}</p>
                </div>
                <span className="px-2.5 py-1 bg-[#0F6E56] text-emerald-100 rounded-full text-xs font-semibold">
                  {registeredCreator.niche}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-emerald-300 block font-semibold">Channel / Profile Link:</span>
                  <a
                    href={registeredCreator.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline truncate block"
                  >
                    {registeredCreator.channel_url}
                  </a>
                </div>
                <div>
                  <span className="text-emerald-300 block font-semibold">Followers / Audience:</span>
                  <span className="text-white font-bold">{Number(registeredCreator.subscriber_count).toLocaleString()}</span>
                </div>
              </div>
              {registeredCreator.bio && (
                <div className="pt-2 text-xs border-t border-[#0F6E56]/60 text-emerald-100/90">
                  <span className="text-emerald-300 block font-semibold mb-0.5">Bio:</span>
                  <p className="italic">&quot;{registeredCreator.bio}&quot;</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/creator/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F6E56] hover:bg-[#1D9E75] text-white font-bold px-7 py-3 rounded-lg border border-[#1D9E75] transition-all"
              >
                <span>View & Edit Your Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#CBDED7] text-[#04342C] hover:bg-[#E1F5EE] font-semibold px-6 py-3 rounded-lg transition-all text-sm"
              >
                Return to Homepage
              </Link>
            </div>

            <p className="text-xs text-[#5A6561]">
              Need to make updates later? You can log back into your DealLink profile anytime using your email and password.
            </p>
          </div>
        ) : (
          /* Registration Form */
          <div className="space-y-6">
            
            {/* Header banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#04342C] text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#0F6E56]">
                <Sparkles className="w-4 h-4 text-[#1D9E75]" />
                <span>Creator Registration</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#04342C]">
                Join the DealLink Creator Network
              </h1>
              <p className="text-[#5A6561] text-sm sm:text-base max-w-xl mx-auto">
                Get matched with brands looking for authentic sponsorships in your niche. Open to all content platforms. Zero upfront fees.
              </p>
            </div>

            <div className="deal-card p-6 sm:p-10 bg-white border border-[#CBDED7]">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#0F6E56]" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#0F6E56]" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@creator.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                </div>

                {/* Password & Profile link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#0F6E56]" />
                      <span>Password *</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Choose a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#0F6E56]" />
                      <span>Channel / Profile Link *</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://youtube.com/@channel or instagram/tiktok link"
                      value={formData.channel_url}
                      onChange={(e) => setFormData({ ...formData, channel_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                </div>

                {/* Subscriber / Follower Count & Niche */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-[#0F6E56]" />
                      <span>Follower / Subscriber Count *</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 45000"
                      value={formData.subscriber_count}
                      onChange={(e) => setFormData({ ...formData, subscriber_count: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#0F6E56]" />
                      <span>Niche / Category *</span>
                    </label>
                    <select
                      value={formData.niche}
                      onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                    >
                      {NICHES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0F6E56]" />
                    <span>Short Bio / Channel Overview</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your content, primary platform, target audience demographic, or past sponsorships..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56] resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#0F6E56] hover:bg-[#1D9E75] text-white font-bold text-base rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-emerald-300" />
                      <span>Complete Creator Registration</span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-xs text-[#5A6561]">
                  Already registered?{' '}
                  <Link href="/creator/login" className="text-[#0F6E56] font-semibold hover:underline">
                    Log in here to manage your profile
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
