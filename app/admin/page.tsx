'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building2,
  Lock,
  Mail,
  ExternalLink,
  Search,
  RefreshCw,
  X,
  Sparkles
} from 'lucide-react';
import Logo from '@/components/Logo';

const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
  loading: () => (
    <header className="bg-[#241C4F] text-white border-b border-[#4F46E5] h-20 flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <Logo size="md" variant="color" />
      </div>
    </header>
  ),
});

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [data, setData] = useState<any>({ creators: [], leads: [], stats: { totalCreators: 0, totalLeads: 0 } });
  const [dataLoading, setDataLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'creators' | 'leads'>('creators');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<any | null>(null);

  // Fetch admin data on mount
  const checkAuthAndFetchData = async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();

      if (res.ok && json.authenticated) {
        setAuthenticated(true);
        setData(json);
      } else {
        setAuthenticated(false);
      }
    } catch (err) {
      setAuthenticated(false);
    } finally {
      setAuthLoading(false);
      setDataLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Incorrect admin passcode.');
      }

      setAuthenticated(true);
      checkAuthAndFetchData();
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
        setLoginError('Could not connect to the server. Please ensure the server is running.');
      } else {
        setLoginError(err.message || 'Authentication failed.');
      }
    }
  };

  // Filter creators
  const filteredCreators = (data.creators || []).filter((c: any) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.niche.toLowerCase().includes(q) ||
      c.bio.toLowerCase().includes(q)
    );
  });

  // Filter leads
  const filteredLeads = (data.leads || []).filter((l: any) => {
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.promotion_needs.toLowerCase().includes(q)
    );
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F1F0FA]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-[#241C4F] font-semibold text-lg animate-pulse">
            Verifying Rex&apos;s admin access...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F1F0FA]">
        <Navbar />

        <main className="flex-1 py-16 px-4 max-w-md mx-auto w-full flex flex-col justify-center">
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#1B1540] text-[#8B5CF6] flex items-center justify-center mx-auto border border-[#4F46E5]">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#241C4F]">Rex&apos;s Admin Portal</h1>
            <p className="text-sm text-[#5B5B72]">Enter passcode to view registered creators & leads</p>
          </div>

          <div className="deal-card p-6 sm:p-8 bg-white border border-[#E2E1F2]">
            {loginError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#241C4F] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>Admin Passcode</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter passcode (e.g. admin123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E1F2] rounded-lg text-sm text-[#151231] focus:outline-none focus:border-[#4F46E5]"
                />
                <p className="text-[11px] text-[#5B5B72] mt-1">Default passcode: <code className="bg-gray-100 px-1 py-0.5 rounded text-[#4F46E5]">admin123</code></p>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-[#241C4F] hover:bg-[#4F46E5] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4 text-[#8B5CF6]" />
                <span>Unlock Internal Admin View</span>
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F0FA]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Admin Header */}
        <div className="bg-[#1B1540] text-white p-6 sm:p-8 rounded-xl border border-[#4F46E5] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#241C4F] text-[#8B5CF6] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-[#4F46E5]">
              <Shield className="w-3.5 h-3.5" />
              <span>Internal Admin Directory (Rex)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              DealLink Network Overview
            </h1>
            <p className="text-xs sm:text-sm text-violet-200/80">
              Persisted working database of registered tech creators and business lead submissions.
            </p>
          </div>

          <button
            onClick={checkAuthAndFetchData}
            disabled={dataLoading}
            className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#8B5CF6] text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-[#8B5CF6] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="deal-card p-6 bg-white border border-[#E2E1F2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B5B72]">Total Registered Creators</span>
              <div className="w-9 h-9 rounded-lg bg-[#F1F0FA] border border-[#8B5CF6] flex items-center justify-center text-[#4F46E5]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#241C4F]">
              {data?.stats?.totalCreators || 0}
            </div>
            <p className="text-xs text-[#8B5CF6] font-semibold">Active in match list</p>
          </div>

          <div className="deal-card p-6 bg-white border border-[#E2E1F2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B5B72]">Business Lead Inquiries</span>
              <div className="w-9 h-9 rounded-lg bg-[#F1F0FA] border border-[#8B5CF6] flex items-center justify-center text-[#4F46E5]">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#241C4F]">
              {data?.stats?.totalLeads || 0}
            </div>
            <p className="text-xs text-[#4F46E5] font-semibold">Submitted sponsor requests</p>
          </div>

          <div className="deal-card p-6 bg-[#241C4F] text-white border border-[#4F46E5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">Outreach Status</span>
              <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div className="text-xl font-bold text-white">
              Ready for Matching
            </div>
            <p className="text-xs text-violet-200/80">Click creator mailto links below to reach out directly</p>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E1F2] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('creators')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'creators'
                  ? 'bg-[#4F46E5] text-white shadow-sm'
                  : 'bg-gray-100 text-[#5B5B72] hover:text-[#241C4F]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Creators ({(data.creators || []).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'leads'
                  ? 'bg-[#4F46E5] text-white shadow-sm'
                  : 'bg-gray-100 text-[#5B5B72] hover:text-[#241C4F]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Business Leads ({(data.leads || []).length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#5B5B72] absolute left-3 top-3" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'creators' ? 'creators or niches' : 'companies or contacts'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-[#E2E1F2] rounded-lg text-sm text-[#151231] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        {/* Tab Content 1: Creator Directory */}
        {activeTab === 'creators' && (
          <div className="deal-card bg-white border border-[#E2E1F2] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[#241C4F] text-white uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Creator</th>
                    <th className="py-3.5 px-4 font-bold">Niche</th>
                    <th className="py-3.5 px-4 font-bold">Followers / Subscribers</th>
                    <th className="py-3.5 px-4 font-bold">Channel / Profile Link</th>
                    <th className="py-3.5 px-4 font-bold">Sign-Up Date</th>
                    <th className="py-3.5 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E1F2]">
                  {filteredCreators.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#5B5B72]">
                        No creators found matching your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredCreators.map((c: any) => (
                      <tr key={c.id} className="hover:bg-[#F1F0FA]/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#241C4F]">
                          <div className="flex flex-col">
                            <span>{c.name}</span>
                            <span className="text-xs font-normal text-[#5B5B72]">{c.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 bg-[#F1F0FA] border border-[#8B5CF6] text-[#4F46E5] font-semibold text-xs rounded-full">
                            {c.niche}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-extrabold text-[#241C4F]">
                          {Number(c.subscriber_count).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={c.channel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4F46E5] hover:text-[#8B5CF6] font-semibold underline flex items-center gap-1 max-w-[200px] truncate text-xs"
                          >
                            <span className="truncate">{c.channel_url}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        </td>
                        <td className="py-4 px-4 text-xs text-[#5B5B72]">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCreator(c)}
                              className="px-3 py-1.5 bg-[#F1F0FA] hover:bg-violet-200 text-[#4F46E5] text-xs font-bold rounded-md border border-[#8B5CF6] transition-colors"
                            >
                              View Bio
                            </button>
                            <a
                              href={`mailto:${c.email}?subject=DealLink%20Brand%20Sponsorship%20Inquiry`}
                              className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#8B5CF6] text-white text-xs font-bold rounded-md transition-colors inline-flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Contact</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 2: Business Leads */}
        {activeTab === 'leads' && (
          <div className="deal-card bg-white border border-[#E2E1F2] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[#1B1540] text-white uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Contact & Company</th>
                    <th className="py-3.5 px-4 font-bold">Website</th>
                    <th className="py-3.5 px-4 font-bold">What they want to promote</th>
                    <th className="py-3.5 px-4 font-bold">Submitted Date</th>
                    <th className="py-3.5 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E1F2]">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#5B5B72]">
                        No business leads submitted yet.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((l: any) => (
                      <tr key={l.id} className="hover:bg-[#F1F0FA]/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#241C4F]">
                          <div className="flex flex-col">
                            <span className="text-base text-[#241C4F]">{l.company}</span>
                            <span className="text-xs text-[#5B5B72] font-normal">{l.name} ({l.email})</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {l.website ? (
                            <a
                              href={l.website.startsWith('http') ? l.website : `https://${l.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4F46E5] hover:text-[#8B5CF6] font-semibold underline text-xs flex items-center gap-1"
                            >
                              <span>{l.website}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#151231] max-w-xs leading-relaxed">
                          {l.promotion_needs}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#5B5B72]">
                          {new Date(l.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <a
                            href={`mailto:${l.email}?subject=DealLink%20-%20Creator%20Match%20for%20${encodeURIComponent(l.company)}`}
                            className="px-3.5 py-1.5 bg-[#1B1540] hover:bg-[#241C4F] text-white text-xs font-bold rounded-md transition-colors inline-flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-[#8B5CF6]" />
                            <span>Reply to Lead</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Creator Detail Modal */}
        {selectedCreator && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-xl w-full border border-[#E2E1F2] overflow-hidden shadow-xl animate-in fade-in zoom-in-95">
              <div className="bg-[#241C4F] text-white p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedCreator.name}</h3>
                  <p className="text-xs text-violet-200">{selectedCreator.email}</p>
                </div>
                <button
                  onClick={() => setSelectedCreator(null)}
                  className="p-2 text-violet-200 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-sm text-[#151231]">
                <div className="flex items-center justify-between border-b border-[#E2E1F2] pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#5B5B72] uppercase tracking-wider">Followers / Audience</span>
                    <p className="text-xl font-extrabold text-[#241C4F]">{Number(selectedCreator.subscriber_count).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#5B5B72] uppercase tracking-wider">Niche</span>
                    <p className="px-2.5 py-1 bg-[#F1F0FA] text-[#4F46E5] font-bold text-xs rounded-full border border-[#8B5CF6]">
                      {selectedCreator.niche}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#5B5B72] uppercase tracking-wider block mb-1">Channel / Profile Link</span>
                  <a
                    href={selectedCreator.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4F46E5] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>{selectedCreator.channel_url}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#5B5B72] uppercase tracking-wider block mb-1">Creator Bio</span>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-relaxed text-[#151231]">
                    {selectedCreator.bio || <span className="italic text-gray-400">No bio specified.</span>}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E1F2] flex items-center justify-between">
                  <span className="text-xs text-[#5B5B72]">Sign-Up ID: {selectedCreator.id}</span>
                  <a
                    href={`mailto:${selectedCreator.email}?subject=DealLink%20Sponsorship%20Opportunity`}
                    className="px-5 py-2 bg-[#4F46E5] hover:bg-[#8B5CF6] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Mailto Message</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
