'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  UserCheck,
  Edit3,
  Save,
  LogOut,
  ExternalLink,
  CheckCircle,
  FileText,
  Mail,
  Calendar,
  Sparkles
} from 'lucide-react';
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

export default function CreatorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  const [editForm, setEditForm] = useState({
    name: '',
    channel_url: '',
    subscriber_count: '',
    niche: '',
    bio: '',
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/creators/me');
      const data = await res.json();

      if (!res.ok || !data.authenticated) {
        router.push('/creator/login');
        return;
      }

      setCreator(data.creator);
      setEditForm({
        name: data.creator.name || '',
        channel_url: data.creator.channel_url || '',
        subscriber_count: String(data.creator.subscriber_count || 0),
        niche: data.creator.niche || NICHES[0],
        bio: data.creator.bio || '',
      });
    } catch (err: any) {
      setError('Failed to load creator profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveMessage('');
    setError('');

    try {
      const res = await fetch('/api/creators/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          channel_url: editForm.channel_url,
          subscriber_count: Number(editForm.subscriber_count) || 0,
          niche: editForm.niche,
          bio: editForm.bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save changes.');
      }

      setCreator(data.creator);
      setIsEditing(false);
      setSaveMessage('Profile successfully updated!');
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E1F5EE]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-[#04342C] font-semibold text-lg animate-pulse">
            Loading creator dashboard...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E1F5EE]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-[#04342C] text-white p-6 rounded-xl border border-[#0F6E56]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] animate-pulse"></span>
              <span className="text-xs text-emerald-300 uppercase tracking-wider font-semibold">Active Network Member</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {creator?.name}
            </h1>
            <p className="text-xs text-emerald-200">
              Registered on {new Date(creator?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F6E56] hover:bg-[#1D9E75] text-white text-xs font-bold rounded-lg border border-[#1D9E75] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 text-xs font-semibold rounded-lg border border-red-700/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="mb-6 p-4 bg-emerald-100 border border-[#1D9E75] text-[#04342C] font-semibold text-sm rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#1D9E75]" />
            <span>{saveMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 font-medium text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Card (Profile Details or Edit Form) */}
          <div className="lg:col-span-8 space-y-6">
            {isEditing ? (
              /* Edit Form */
              <div className="deal-card p-6 sm:p-8 bg-white border border-[#CBDED7]">
                <h3 className="text-xl font-bold text-[#04342C] mb-6 flex items-center gap-2 pb-3 border-b border-[#CBDED7]">
                  <Edit3 className="w-5 h-5 text-[#0F6E56]" />
                  <span>Update Profile Information</span>
                </h3>

                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5">
                      Channel / Profile Link
                    </label>
                    <input
                      type="url"
                      required
                      value={editForm.channel_url}
                      onChange={(e) => setEditForm({ ...editForm, channel_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5">
                        Followers / Audience Count
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={editForm.subscriber_count}
                        onChange={(e) => setEditForm({ ...editForm, subscriber_count: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5">
                        Niche / Category
                      </label>
                      <select
                        value={editForm.niche}
                        onChange={(e) => setEditForm({ ...editForm, niche: e.target.value })}
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

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#04342C] mb-1.5">
                      Bio / Content Summary
                    </label>
                    <textarea
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="px-6 py-2.5 bg-[#0F6E56] hover:bg-[#1D9E75] text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saveLoading ? 'Saving...' : 'Save Profile Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 border border-[#CBDED7] text-[#5A6561] hover:text-[#04342C] font-medium text-sm rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* View Profile Card */
              <div className="deal-card p-6 sm:p-8 bg-white border border-[#CBDED7] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#CBDED7]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#E1F5EE] border border-[#1D9E75] flex items-center justify-center text-[#0F6E56] font-bold text-xl">
                      <Sparkles className="w-6 h-6 text-[#0F6E56]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#04342C]">{creator?.name}</h2>
                      <p className="text-xs text-[#5A6561] flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#0F6E56]" />
                        <span>{creator?.email}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#E1F5EE] border border-[#1D9E75] text-[#0F6E56] font-semibold text-xs rounded-full">
                    {creator?.niche}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-[#E1F5EE]/40 border border-[#CBDED7]">
                    <span className="text-xs font-semibold text-[#5A6561] uppercase tracking-wider block mb-1">
                      Followers / Audience
                    </span>
                    <span className="text-2xl font-extrabold text-[#04342C]">
                      {Number(creator?.subscriber_count).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-[#E1F5EE]/40 border border-[#CBDED7]">
                    <span className="text-xs font-semibold text-[#5A6561] uppercase tracking-wider block mb-1">
                      Channel / Profile Link
                    </span>
                    <a
                      href={creator?.channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#0F6E56] hover:text-[#1D9E75] underline flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{creator?.channel_url}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#04342C] mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0F6E56]" />
                    <span>Bio / Content Summary</span>
                  </h4>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#2C2C2A] leading-relaxed">
                    {creator?.bio ? creator.bio : <span className="text-gray-400 italic">No bio provided yet. Click &quot;Edit Profile&quot; to add details for brands.</span>}
                  </div>
                </div>

                <div className="pt-2 text-xs text-[#5A6561] flex items-center justify-between border-t border-[#CBDED7]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0F6E56]" />
                    <span>Member since {new Date(creator?.created_at).toLocaleDateString()}</span>
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#0F6E56] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit profile details</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Status Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="deal-card p-6 bg-[#042C53] text-white border border-[#0F6E56] space-y-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#1D9E75]" />
                <span>Account Status</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-[#04342C] border border-[#0F6E56]">
                  <span className="text-emerald-300 font-bold block mb-1">Status: Active in Network</span>
                  <p className="text-emerald-100/80">Your profile is visible in Rex&apos;s internal creator match list for upcoming brand campaigns.</p>
                </div>

                <div className="p-3 rounded-lg bg-[#04342C] border border-[#0F6E56]">
                  <span className="text-emerald-300 font-bold block mb-1">Next Match Step</span>
                  <p className="text-emerald-100/80">When a brand requests creators in your niche ({creator?.niche}), Rex will contact you directly via <strong className="text-white">{creator?.email}</strong>.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
