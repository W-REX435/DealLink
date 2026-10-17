'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  CheckCircle2,
  ClipboardList,
  Handshake,
  Inbox,
  Loader2,
  Sparkles,
  Bell,
  MessageSquare,
  Edit3,
  Camera,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Play,
  Send,
  Check,
  MapPin,
  BadgeCheck,
  FileText,
  Award,
  DollarSign,
  Briefcase,
  Tag,
  Layers,
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { EASE } from '@/lib/motion';

type Tab = 'creators' | 'businesses' | 'applications' | 'briefs' | 'deals' | 'leads';

const DEAL_BADGES: Record<string, string> = {
  proposed: 'border-accent/30 bg-accent/10 text-accent',
  active: 'border-primary-2/30 bg-primary-2/10 text-primary-2',
  completed: 'border-warning/30 bg-warning/10 text-warning',
  paid: 'border-success/30 bg-success/10 text-success',
  cancelled: 'border-border bg-soft-2 text-muted-2',
};

const BRIEF_STATUSES = ['submitted', 'reviewing', 'matched'];

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

const DELIVERABLE_PRESETS = [
  '1 Instagram Story',
  '1 Instagram Reel',
  '1 Instagram Photo Feed Post',
  '1 TikTok Video (60 Seconds)',
  '1 YouTube Dedicated Video',
  '1 YouTube Integration (60 Seconds)',
  '1 X (Twitter) Post',
  'Custom Deliverable Package',
];

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [data, setData] = useState<any>({
    creators: [],
    businesses: [],
    applications: [],
    briefs: [],
    deals: [],
    matches: [],
    leads: [],
    stats: {},
  });
  const [dataLoading, setDataLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab | 'chat'>('creators');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<any | null>(null);

  const [actionId, setActionId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatUser, setChatUser] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  // Admin Creator Profile Editor Modal State
  const [editCreatorModal, setEditCreatorModal] = useState<any | null>(null);
  const [editCreatorSubTab, setEditCreatorSubTab] = useState<'media' | 'social' | 'bio' | 'badges' | 'packages'>('media');
  const [editCreatorLoading, setEditCreatorLoading] = useState(false);
  const [editCreatorForm, setEditCreatorForm] = useState({
    name: '',
    email: '',
    subscriber_count: '',
    niche: '',
    bio: '',
    tagline: '',
    location: '',
    pricingRate: '',
    profileImage: '',
    coverImage: '',
    media: [] as string[],
    videos: [] as { title?: string; url: string; platform?: string }[],
    youtube: '',
    instagram: '',
    tiktok: '',
    twitter: '',
    linkedin: '',
    twitch: '',
    verified: false,
    badges: [] as string[],
    packages: [] as { title: string; price: number; description?: string }[],
  });
  const [newAdminPhotoUrl, setNewAdminPhotoUrl] = useState('');
  const [newAdminVideoUrl, setNewAdminVideoUrl] = useState('');
  const [newAdminVideoTitle, setNewAdminVideoTitle] = useState('');
  const [newPackageTitle, setNewPackageTitle] = useState(DELIVERABLE_PRESETS[0]);
  const [newPackagePrice, setNewPackagePrice] = useState('50');
  const [newPackageDesc, setNewPackageDesc] = useState('');

  // Add Creator Modal State
  const [addCreatorModalOpen, setAddCreatorModalOpen] = useState(false);
  const [addCreatorLoading, setAddCreatorLoading] = useState(false);
  const [addCreatorForm, setAddCreatorForm] = useState({
    name: '',
    email: '',
    password: '',
    niche: NICHES[0],
    subscriber_count: '',
    channel_url: '',
    tagline: '',
    location: '',
    bio: '',
    pricingRate: '',
    verified: true,
  });

  // Add Business Modal State
  const [addBusinessModalOpen, setAddBusinessModalOpen] = useState(false);
  const [addBusinessLoading, setAddBusinessLoading] = useState(false);
  const [addBusinessForm, setAddBusinessForm] = useState({
    company: '',
    name: '',
    email: '',
    password: '',
    website: '',
  });

  // Briefs Modal State
  const [addBriefModalOpen, setAddBriefModalOpen] = useState(false);
  const [addBriefLoading, setAddBriefLoading] = useState(false);
  const [addBriefForm, setAddBriefForm] = useState({
    businessId: '',
    company: '',
    product: '',
    description: '',
    niche: NICHES[0],
    minAudience: '0',
    budget: '$1,500',
    deliverables: '1 Instagram Reel + 1 Story',
    status: 'submitted',
  });
  const [editBriefModal, setEditBriefModal] = useState<any | null>(null);
  const [editBriefLoading, setEditBriefLoading] = useState(false);
  const [editBriefForm, setEditBriefForm] = useState({
    id: '',
    company: '',
    product: '',
    description: '',
    niche: NICHES[0],
    minAudience: '0',
    budget: '',
    deliverables: '',
    status: 'submitted',
  });

  // Full Campaign / Deal Creation Modal State
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false);
  const [createCampaignLoading, setCreateCampaignLoading] = useState(false);
  const [createCampaignForm, setCreateCampaignForm] = useState({
    product: '',
    businessId: '',
    creatorIds: [] as string[],
    niche: NICHES[0],
    deliverables: '1 Instagram Reel + 1 Story',
    budget: '$1,500',
    dealValue: '1500',
    notes: '',
    status: 'active',
  });

  // Add Lead Modal State
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [addLeadLoading, setAddLeadLoading] = useState(false);
  const [addLeadForm, setAddLeadForm] = useState({
    company: '',
    name: '',
    email: '',
    promotion_needs: '',
    website: '',
  });

  // Admin Contact Modal State
  const [contactCreatorModal, setContactCreatorModal] = useState<any | null>(null);
  const [contactQuickMsg, setContactQuickMsg] = useState('');
  const [contactQuickLoading, setContactQuickLoading] = useState(false);
  const [contactQuickSuccess, setContactQuickSuccess] = useState('');

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (res.ok && json.authenticated) {
        setAuthenticated(true);
        setData(json);
        setLoginError('');

        const notifRes = await fetch('/api/notifications');
        const notifData = await notifRes.json();
        if (notifRes.ok) {
          setNotifications(notifData.notifications || []);
          setUnreadNotifications(notifData.unreadCount || 0);
        }

        const chatRes = await fetch('/api/chat');
        const chatData = await chatRes.json();
        if (chatRes.ok) {
          setChatMessages(chatData.messages || []);
        }

      } else {
        setAuthenticated(false);
        if (json.error && json.error !== 'Unauthorized access') {
          setLoginError(json.error);
        }
      }
    } catch (e: any) {
      setAuthenticated(false);
      setLoginError(e?.message || 'Failed to load admin data');
    } finally {
      setAuthLoading(false);
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh removed — use the manual Refresh button instead

  const handleMarkRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      fetchData();
    } catch (err) {}
  };

  const handleVerifyCreator = async (creatorId: string, action: 'verify' | 'unverify' | 'delete') => {
    if (action === 'delete' && !window.confirm('Are you sure you want to delete this creator?')) return;
    setActionId(creatorId);
    try {
      await fetch('/api/admin/creators/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, action })
      });
      fetchData();
    } catch (err) {}
    finally { setActionId(null); }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatUser) return;
    setChatLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: chatUser, message: chatInput }),
      });
      setChatInput('');
      fetchData();
    } catch (err) {
    } finally {
      setChatLoading(false);
    }
  };

  const openEditCreator = (c: any) => {
    setEditCreatorModal(c);
    setEditCreatorSubTab('media');
    setEditCreatorForm({
      name: c.name || '',
      email: c.email || '',
      subscriber_count: String(c.subscriber_count || 0),
      niche: c.niche || NICHES[0],
      bio: c.bio || '',
      tagline: c.tagline || '',
      location: c.location || '',
      pricingRate: String(c.pricingRate || 0),
      profileImage: c.profileImage || '',
      coverImage: c.coverImage || '',
      media: Array.isArray(c.media) ? [...c.media] : [],
      videos: Array.isArray(c.videos) ? [...c.videos] : [],
      youtube: c.socialAccounts?.youtube || '',
      instagram: c.socialAccounts?.instagram || '',
      tiktok: c.socialAccounts?.tiktok || '',
      twitter: c.socialAccounts?.twitter || '',
      linkedin: c.socialAccounts?.linkedin || '',
      twitch: c.socialAccounts?.twitch || '',
      verified: Boolean(c.verified),
      badges: Array.isArray(c.badges) ? [...c.badges] : [],
      packages: Array.isArray(c.packages) ? [...c.packages] : [],
    });
  };

  const handleSaveCreatorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCreatorModal) return;
    setEditCreatorLoading(true);
    try {
      const res = await fetch('/api/admin/creators/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: editCreatorModal.id,
          name: editCreatorForm.name,
          bio: editCreatorForm.bio,
          niche: editCreatorForm.niche,
          subscriber_count: Number(editCreatorForm.subscriber_count) || 0,
          tagline: editCreatorForm.tagline,
          location: editCreatorForm.location,
          pricingRate: Number(editCreatorForm.pricingRate) || 0,
          profileImage: editCreatorForm.profileImage,
          coverImage: editCreatorForm.coverImage,
          media: editCreatorForm.media,
          videos: editCreatorForm.videos,
          socialAccounts: {
            youtube: editCreatorForm.youtube,
            instagram: editCreatorForm.instagram,
            tiktok: editCreatorForm.tiktok,
            twitter: editCreatorForm.twitter,
            linkedin: editCreatorForm.linkedin,
            twitch: editCreatorForm.twitch,
          },
          verified: editCreatorForm.verified,
          badges: editCreatorForm.badges,
          packages: editCreatorForm.packages,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update creator profile');
      setActionMessage(`Updated profile for ${editCreatorForm.name} successfully!`);
      setEditCreatorModal(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error updating creator');
    } finally {
      setEditCreatorLoading(false);
    }
  };

  const handleSendQuickContactChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactCreatorModal || !contactQuickMsg.trim()) return;
    setContactQuickLoading(true);
    setContactQuickSuccess('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: contactCreatorModal.id,
          message: contactQuickMsg.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to send message');
      setContactQuickSuccess('Message sent! An email notification has also been dispatched to their inbox.');
      setContactQuickMsg('');
      fetchData();
      setTimeout(() => {
        setContactQuickSuccess('');
        setContactCreatorModal(null);
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to send chat message');
    } finally {
      setContactQuickLoading(false);
    }
  };

  // 1. Create Creator Handler
  const handleCreateCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCreatorLoading(true);
    try {
      const res = await fetch('/api/admin/creators/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addCreatorForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create creator');
      setActionMessage(`Creator ${addCreatorForm.name} created successfully!`);
      setAddCreatorModalOpen(false);
      setAddCreatorForm({
        name: '',
        email: '',
        password: '',
        niche: NICHES[0],
        subscriber_count: '',
        channel_url: '',
        tagline: '',
        location: '',
        bio: '',
        pricingRate: '',
        verified: true,
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error creating creator');
    } finally {
      setAddCreatorLoading(false);
    }
  };

  // 2. Create Business Handler
  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddBusinessLoading(true);
    try {
      const res = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addBusinessForm, action: 'create' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create business');
      setActionMessage(`Business ${addBusinessForm.company} created successfully!`);
      setAddBusinessModalOpen(false);
      setAddBusinessForm({ company: '', name: '', email: '', password: '', website: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error creating business');
    } finally {
      setAddBusinessLoading(false);
    }
  };

  // 3. Delete Business Handler
  const handleDeleteBusiness = async (businessId: string, companyName: string) => {
    if (!window.confirm(`Are you sure you want to delete business "${companyName}"?`)) return;
    try {
      const res = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, action: 'delete' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete business');
      setActionMessage(`Business ${companyName} deleted.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error deleting business');
    }
  };

  // 4. Create Brief Handler
  const handleCreateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddBriefLoading(true);
    try {
      const res = await fetch('/api/admin/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addBriefForm, action: 'create' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create brief');
      setActionMessage(`Campaign Brief created successfully!`);
      setAddBriefModalOpen(false);
      setAddBriefForm({
        businessId: '',
        company: '',
        product: '',
        description: '',
        niche: NICHES[0],
        minAudience: '0',
        budget: '$1,500',
        deliverables: '1 Instagram Reel + 1 Story',
        status: 'submitted',
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error creating brief');
    } finally {
      setAddBriefLoading(false);
    }
  };

  // 5. Edit Brief Handler
  const handleEditBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBriefModal) return;
    setEditBriefLoading(true);
    try {
      const res = await fetch('/api/admin/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editBriefForm, action: 'edit' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update brief');
      setActionMessage(`Campaign Brief updated successfully!`);
      setEditBriefModal(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error updating brief');
    } finally {
      setEditBriefLoading(false);
    }
  };

  // 6. Delete Brief Handler
  const handleDeleteBrief = async (briefId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete campaign brief "${productName}"?`)) return;
    try {
      const res = await fetch('/api/admin/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: briefId, action: 'delete' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete brief');
      setActionMessage(`Campaign brief deleted.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error deleting brief');
    }
  };

  // 7. Create Full Campaign Handler (Links a business to multiple creators)
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createCampaignForm.product.trim()) {
      alert('Please enter a campaign name');
      return;
    }
    if (!createCampaignForm.businessId) {
      alert('Please select a business');
      return;
    }
    if (createCampaignForm.creatorIds.length === 0) {
      alert('Please select at least one creator for this campaign');
      return;
    }

    setCreateCampaignLoading(true);
    try {
      const res = await fetch('/api/admin/deals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_campaign',
          businessId: createCampaignForm.businessId,
          creatorIds: createCampaignForm.creatorIds,
          product: createCampaignForm.product,
          niche: createCampaignForm.niche,
          deliverables: createCampaignForm.deliverables,
          budget: createCampaignForm.budget,
          dealValue: Number(createCampaignForm.dealValue) || 1500,
          notes: createCampaignForm.notes,
          status: createCampaignForm.status,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create campaign');
      setActionMessage(`Campaign "${createCampaignForm.product}" launched successfully with ${createCampaignForm.creatorIds.length} creator(s)!`);
      setCreateCampaignModalOpen(false);
      setCreateCampaignForm({
        product: '',
        businessId: '',
        creatorIds: [],
        niche: NICHES[0],
        deliverables: '1 Instagram Reel + 1 Story',
        budget: '$1,500',
        dealValue: '1500',
        notes: '',
        status: 'active',
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error creating campaign');
    } finally {
      setCreateCampaignLoading(false);
    }
  };

  // 8. Delete Deal Handler
  const handleDeleteDeal = async (dealId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete deal "${productName}"?`)) return;
    try {
      const res = await fetch('/api/admin/deals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, action: 'delete_deal' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete deal');
      setActionMessage(`Deal deleted successfully.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error deleting deal');
    }
  };

  // 9. Create Lead Handler
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLeadLoading(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addLeadForm, action: 'create' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create lead');
      setActionMessage(`Lead for ${addLeadForm.company} added!`);
      setAddLeadModalOpen(false);
      setAddLeadForm({ company: '', name: '', email: '', promotion_needs: '', website: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error creating lead');
    } finally {
      setAddLeadLoading(false);
    }
  };

  // 10. Delete Lead Handler
  const handleDeleteLead = async (leadId: string, company: string) => {
    if (!window.confirm(`Are you sure you want to delete lead "${company}"?`)) return;
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, action: 'delete' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete lead');
      setActionMessage(`Lead deleted.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Error deleting lead');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Incorrect admin passcode.');
      await fetchData();
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleApplicationAction = async (id: string, action: 'approve' | 'reject') => {
    setActionId(id);
    setActionMessage('');
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionMessage(json.error || 'Action failed.');
      } else {
        setActionMessage(
          action === 'approve'
            ? json.emailConfigured
              ? 'Approved — invite email sent.'
              : 'Approved — email not configured, no invite sent.'
            : 'Application rejected.'
        );
        fetchData();
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Action failed.');
    } finally {
      setActionId(null);
    }
  };

  const handleBriefStatus = async (id: string, status: string) => {
    setActionId(id);
    setActionMessage('');
    try {
      const res = await fetch('/api/admin/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionMessage(json.error || 'Failed to update brief.');
      } else {
        setActionMessage('Brief status updated.');
        fetchData();
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to update brief.');
    } finally {
      setActionId(null);
    }
  };

  const handleAdminDealAction = async (
    targetType: 'deal' | 'match',
    targetId: string,
    action: string,
    dealValue?: number
  ) => {
    setActionId(targetId);
    setActionMessage('');
    try {
      const res = await fetch('/api/admin/deals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, action, dealValue }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Admin action failed.');
      setActionMessage(
        action === 'approve_and_start' || action === 'approve_and_create_deal'
          ? `Deal approved & priced at $${dealValue || 0}! Creator notified to start filming.`
          : 'Status updated.'
      );
      fetchData();
    } catch (err: any) {
      setActionMessage(err.message || 'Action failed.');
    } finally {
      setActionId(null);
    }
  };

  const filterBySearch = (items: any[], fields: string[]) => {
    const q = searchQuery.toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      fields.some((f) => String(item[f] ?? '').toLowerCase().includes(q))
    );
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="text-sm font-semibold">Verifying admin access...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="w-full max-w-sm"
          >
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent-soft">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                Admin portal
              </h1>
              <p className="mt-1 text-sm text-muted">
                Enter the passcode to manage the network.
              </p>
            </div>

            <div className="dl-card mt-7 p-6 shadow-mid sm:p-8">
              {loginError && (
                <div className="mb-5 rounded-xl border border-danger/25 bg-danger/5 p-3.5 text-sm font-medium text-danger">
                  {loginError}
                </div>
              )}
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label htmlFor="admin-passcode" className="dl-label">
                    <Lock className="mr-1.5 inline h-3.5 w-3.5 text-accent" />
                    Admin passcode
                  </label>
                  <input
                    id="admin-passcode"
                    type="password"
                    required
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="dl-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn-primary w-full py-3.5"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Unlocking...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Unlock admin view
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = data.stats || {};

  const statCards = [
    { label: 'Creators', value: stats.totalCreators || 0, icon: Users },
    { label: 'Businesses', value: stats.totalBusinesses || 0, icon: Building2 },
    { label: 'Pending applications', value: stats.pendingApplications || 0, icon: ClipboardList },
    { label: 'Campaign briefs', value: stats.totalBriefs || 0, icon: Inbox },
    { label: 'Deals', value: stats.totalDeals || 0, icon: Handshake },
    { label: 'Matches', value: stats.totalMatches || 0, icon: Sparkles },
  ];

  const tabs: { id: Tab | 'chat'; label: string; count: number }[] = [
    { id: 'creators', label: 'Creators', count: data.creators?.length || 0 },
    { id: 'businesses', label: 'Businesses', count: data.businesses?.length || 0 },
    { id: 'applications', label: 'Applications', count: (data.applications || []).filter((a: any) => a.status === 'pending').length },
    { id: 'briefs', label: 'Briefs', count: data.briefs?.length || 0 },
    { id: 'deals', label: 'Deals', count: data.deals?.length || 0 },
    { id: 'leads', label: 'Leads', count: data.leads?.length || 0 },
    { id: 'chat', label: 'Chat', count: Array.from(new Set(chatMessages.map(m => m.fromUserId === 'admin' ? m.toUserId : m.fromUserId))).length },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative mb-8 rounded-2xl bg-primary p-6 text-white shadow-high sm:p-8"
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-40" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-[90px]" />
            </div>
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-soft">
                  <Shield className="h-3.5 w-3.5" />
                  Internal admin
                </span>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  DealLink network overview
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Creators, businesses, applications, briefs, and deals.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="inline-flex items-center justify-center self-start rounded-xl border border-white/15 bg-white/10 p-2.5 text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
                    title="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  {isNotificationsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-surface border border-border shadow-2xl z-50 overflow-hidden text-foreground">
                        <div className="bg-soft-2 border-b border-border p-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-accent" />
                            <span className="text-sm font-bold text-foreground">Notifications</span>
                            {unreadNotifications > 0 && (
                              <span className="rounded-full bg-danger/10 text-danger px-2 py-0.5 text-[10px] font-bold">
                                {unreadNotifications} new
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => setIsNotificationsOpen(false)}
                            className="text-muted hover:text-foreground p-1 rounded-lg hover:bg-soft transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="max-h-[360px] overflow-y-auto p-2">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-xs text-muted">No notifications yet.</div>
                          ) : (
                            notifications.map(n => (
                              <div key={n._id} className={`p-3 rounded-xl mb-1 flex items-start gap-3 transition-colors ${n.read ? 'bg-transparent hover:bg-soft-2/50' : 'bg-accent/10 hover:bg-accent/15'}`}>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs ${n.read ? 'text-muted' : 'text-foreground font-semibold'}`}>{n.message}</p>
                                  <span className="text-[10px] text-muted-2 block mt-1">{new Date(n.createdAt).toLocaleString()}</span>
                                </div>
                                {!n.read && (
                                  <button onClick={() => handleMarkRead(n._id)} className="text-[10px] font-bold text-accent shrink-0 mt-1 hover:underline">Mark read</button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={fetchData}
                  disabled={dataLoading}
                  className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                className="dl-card p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-2">
                    {stat.label}
                  </span>
                  <stat.icon className="h-3.5 w-3.5 text-accent" />
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tabs + search */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    activeTab === t.id
                      ? 'bg-primary-2 text-white shadow-mid'
                      : 'border border-border bg-surface/70 text-muted hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  {t.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      activeTab === t.id ? 'bg-white/20 text-white' : 'bg-soft-2 text-muted-2'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm font-medium text-foreground shadow-soft transition-all placeholder:text-muted-2 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {actionMessage && (
            <div className="mb-5 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm font-semibold text-accent">
              {actionMessage}
            </div>
          )}

          {dataLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}

          {/* CREATORS */}
          {!dataLoading && activeTab === 'creators' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">Creators Directory</h3>
                  <p className="text-xs text-muted-2">Manage creator profiles, private deliverable rates, badges, and verification</p>
                </div>
                <button
                  onClick={() => setAddCreatorModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-soft transition-all hover:bg-accent/90 shrink-0 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Creator (إضافة صانع محتوى)
                </button>
              </div>

              <div className="dl-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3.5 font-bold">Creator</th>
                        <th className="px-4 py-3.5 font-bold">Niche</th>
                        <th className="px-4 py-3.5 font-bold">Audience</th>
                        <th className="px-4 py-3.5 font-bold">Verified</th>
                        <th className="px-4 py-3.5 font-bold">Joined</th>
                        <th className="px-4 py-3.5 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filterBySearch(data.creators || [], ['name', 'email', 'niche', 'bio']).map((c: any) => (
                        <tr key={c.id} className="transition-colors hover:bg-soft-2/60">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-2 to-accent text-sm font-bold text-white shrink-0 shadow-soft">
                                {c.profileImage ? (
                                  <img src={c.profileImage} alt={c.name} className="h-full w-full object-cover" />
                                ) : (
                                  (c.name || '?')[0]
                                )}
                                {c.verified && (
                                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-white shadow">
                                    <BadgeCheck className="h-2.5 w-2.5" />
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground flex items-center gap-1.5 truncate">
                                  {c.name}
                                  {c.verified && <BadgeCheck className="h-3.5 w-3.5 text-accent shrink-0" />}
                                </p>
                                <p className="text-xs text-muted-2 truncate">{c.email}</p>
                                {Array.isArray(c.badges) && c.badges.length > 0 && (
                                  <div className="mt-0.5 flex flex-wrap gap-1">
                                    {c.badges.slice(0, 2).map((b: string) => (
                                      <span key={b} className="inline-flex items-center rounded-md border border-white/10 bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white capitalize">{b.replace(/-/g, ' ')}</span>
                                    ))}
                                    {c.badges.length > 2 && <span className="text-[9px] text-muted-2">+{c.badges.length - 2} more</span>}
                                  </div>
                                )}
                                {Array.isArray(c.packages) && c.packages.length > 0 && (
                                  <div className="mt-1 flex items-center gap-1">
                                    <span className="inline-flex items-center gap-1 rounded-md border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold text-green-500" title="Admin Deliverable Rates">
                                      <DollarSign className="h-2.5 w-2.5" />
                                      {c.packages.length} Rate{c.packages.length > 1 ? 's' : ''} set
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-full border border-border bg-soft-2 px-2.5 py-1 text-xs font-semibold text-muted">
                            {c.niche}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-foreground">
                          {Number(c.subscriber_count).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs">Email: {c.emailVerified ? <CheckCircle2 className="inline h-3 w-3 text-accent" /> : <X className="inline h-3 w-3 text-muted-2" />}</span>
                            <span className="text-xs">Verified: {c.verified ? <CheckCircle2 className="inline h-3 w-3 text-green-500" /> : <X className="inline h-3 w-3 text-muted-2" />}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {c.verified ? (
                              <button
                                onClick={() => handleVerifyCreator(c.id, 'unverify')}
                                disabled={actionId === c.id}
                                className="rounded-lg border border-border bg-soft-2 px-2.5 py-1.5 text-[10px] font-bold text-foreground transition-colors hover:border-accent/40"
                              >
                                Unverify
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVerifyCreator(c.id, 'verify')}
                                disabled={actionId === c.id}
                                className="rounded-lg border border-green-500/30 bg-green-500/10 px-2.5 py-1.5 text-[10px] font-bold text-green-500 transition-colors hover:bg-green-500/20"
                              >
                                Verify
                              </button>
                            )}
                            <button
                              onClick={() => openEditCreator(c)}
                              className="inline-flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent/20"
                              title="Edit Creator Profile, Photos, Videos & Banner"
                            >
                              <Edit3 className="h-3 w-3" />
                              Edit Profile
                            </button>
                            <button
                              onClick={() => {
                                setContactCreatorModal(c);
                                setContactQuickMsg('');
                                setContactQuickSuccess('');
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-primary-2 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary shadow-soft"
                              title="Contact via Email or Chat"
                            >
                              <Mail className="h-3 w-3" />
                              Contact
                            </button>
                            <button
                              onClick={() => setSelectedCreator(c)}
                              className="rounded-lg border border-border bg-soft-2 px-2 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-accent/40"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleVerifyCreator(c.id, 'delete')}
                              disabled={actionId === c.id}
                              className="rounded-lg border border-danger/30 bg-danger/10 px-2 py-1.5 text-[10px] font-bold text-danger transition-colors hover:bg-danger/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filterBySearch(data.creators || [], ['name', 'email', 'niche', 'bio']).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                          No creators found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}

          {/* BUSINESSES */}
          {!dataLoading && activeTab === 'businesses' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">Registered Businesses</h3>
                  <p className="text-xs text-muted-2">Add brand accounts, manage partnerships, and review campaigns</p>
                </div>
                <button
                  onClick={() => setAddBusinessModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-soft transition-all hover:bg-accent/90 shrink-0 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Business (إضافة بزنس)
                </button>
              </div>

              <div className="dl-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3.5 font-bold">Business</th>
                        <th className="px-4 py-3.5 font-bold">Contact</th>
                        <th className="px-4 py-3.5 font-bold">Verified</th>
                        <th className="px-4 py-3.5 font-bold">Joined</th>
                        <th className="px-4 py-3.5 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filterBySearch(data.businesses || [], ['name', 'company', 'email']).map((b: any) => (
                        <tr key={b.id} className="transition-colors hover:bg-soft-2/60">
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-foreground">{b.company}</p>
                            <p className="text-xs text-muted-2">{b.name}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted">{b.email}</td>
                          <td className="px-4 py-3.5">
                            {b.emailVerified ? (
                              <CheckCircle2 className="h-4 w-4 text-accent" />
                            ) : (
                              <X className="h-4 w-4 text-muted-2" />
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted">
                            {new Date(b.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`mailto:${b.email}?subject=DealLink`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-2 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary shadow-soft"
                              >
                                <Mail className="h-3 w-3" />
                                Contact
                              </a>
                              <button
                                onClick={() => handleDeleteBusiness(b.id, b.company || b.name)}
                                className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-xs font-bold text-danger transition-colors hover:bg-danger/20"
                                title="Delete Business"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filterBySearch(data.businesses || [], ['name', 'company', 'email']).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted">
                            No approved businesses yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATIONS */}
          {!dataLoading && activeTab === 'applications' && (
            <div className="space-y-4">
              {(data.applications || []).length === 0 ? (
                <div className="dl-card p-12 text-center text-sm text-muted">
                  No business applications yet.
                </div>
              ) : (
                data.applications.map((a: any, i: number) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                    className="dl-card p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-foreground">{a.company}</span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                              a.status === 'pending'
                                ? 'border-warning/30 bg-warning/10 text-warning'
                                : a.status === 'approved'
                                ? 'border-accent/30 bg-accent/10 text-accent'
                                : 'border-danger/30 bg-danger/10 text-danger'
                            }`}
                          >
                            {a.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-2">
                          {a.contactName} · {a.email}
                          {a.website ? (
                            <>
                              {' · '}
                              <a
                                href={a.website.startsWith('http') ? a.website : `https://${a.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent underline"
                              >
                                {a.website}
                              </a>
                            </>
                          ) : null}
                        </p>
                        <p className="text-xs text-muted">
                          <strong>Budget:</strong> {a.budgetRange} · <strong>Timeline:</strong>{' '}
                          {a.timeline}
                        </p>
                        <p className="max-w-2xl text-sm leading-relaxed text-muted">{a.goals}</p>
                        <p className="text-[11px] text-muted-2">
                          Submitted {new Date(a.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {a.status === 'pending' && (
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            onClick={() => handleApplicationAction(a.id, 'approve')}
                            disabled={actionId === a.id}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-2 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary disabled:opacity-50"
                          >
                            {actionId === a.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleApplicationAction(a.id, 'reject')}
                            disabled={actionId === a.id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-danger/25 bg-danger/5 px-4 py-2.5 text-xs font-bold text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* BRIEFS */}
          {!dataLoading && activeTab === 'briefs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">Campaign Briefs</h3>
                  <p className="text-xs text-muted-2">Create, edit, and manage campaign briefs submitted by businesses</p>
                </div>
                <button
                  onClick={() => setAddBriefModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-soft transition-all hover:bg-accent/90 shrink-0 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Campaign Brief (إضافة بريف)
                </button>
              </div>

              {(data.briefs || []).length === 0 ? (
                <div className="dl-card p-12 text-center text-sm text-muted">
                  No campaign briefs yet.
                </div>
              ) : (
                data.briefs.map((b: any, i: number) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                    className="dl-card p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-foreground">{b.product}</p>
                          <span className="rounded-full border border-border bg-soft-2 px-2 py-0.5 text-[10px] font-semibold text-muted">
                            {b.niche}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-2">
                          <strong className="text-foreground">{b.company}</strong> · Budget: <strong className="text-foreground">{b.budget}</strong> · Deliverables: {b.deliverables}
                          {b.minAudience > 0 && <> · Min Audience: {Number(b.minAudience).toLocaleString()}</>}
                        </p>
                        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted whitespace-pre-line">
                          {b.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col sm:items-end gap-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                              b.status === 'matched'
                                ? 'border-accent/30 bg-accent/10 text-accent'
                                : b.status === 'reviewing'
                                ? 'border-warning/30 bg-warning/10 text-warning'
                                : 'border-border bg-soft-2 text-muted-2'
                            }`}
                          >
                            {b.status}
                          </span>
                          <select
                            value={b.status}
                            onChange={(e) => handleBriefStatus(b.id, e.target.value)}
                            disabled={actionId === b.id}
                            className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground focus:border-accent/50 focus:outline-none disabled:opacity-50"
                          >
                            {BRIEF_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditBriefModal(b);
                              setEditBriefForm({
                                id: b.id,
                                company: b.company || '',
                                product: b.product || '',
                                description: b.description || '',
                                niche: b.niche || NICHES[0],
                                minAudience: String(b.minAudience || 0),
                                budget: b.budget || '',
                                deliverables: b.deliverables || '',
                                status: b.status || 'submitted',
                              });
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent/20"
                            title="Edit Brief"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBrief(b.id, b.product)}
                            className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-xs font-bold text-danger transition-colors hover:bg-danger/20"
                            title="Delete Brief"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* DEALS */}
          {!dataLoading && activeTab === 'deals' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">Sponsorship Deals & Campaigns</h3>
                  <p className="text-xs text-muted-2">Create brand campaigns, assign multiple creators, and manage payouts</p>
                </div>
                <button
                  onClick={() => setCreateCampaignModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-soft transition-all hover:bg-accent/90 shrink-0 self-start sm:self-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  Create Campaign / Deal (إنشاء كامبين / ديل)
                </button>
              </div>

              <div className="dl-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3.5 font-bold">Product & Details</th>
                        <th className="px-4 py-3.5 font-bold">Business</th>
                        <th className="px-4 py-3.5 font-bold">Creator</th>
                        <th className="px-4 py-3.5 font-bold">Offered / Agency Price</th>
                        <th className="px-4 py-3.5 font-bold">Status</th>
                        <th className="px-4 py-3.5 text-right font-bold">Agency Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(data.deals || []).map((d: any) => (
                        <tr key={d.id} className="transition-colors hover:bg-soft-2/60">
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-foreground">{d.product}</p>
                            <p className="text-xs text-muted-2">{d.deliverables}</p>
                            {d.notes && <p className="mt-1 text-xs text-muted italic">"{d.notes}"</p>}
                          </td>
                          <td className="px-4 py-3.5 text-muted">
                            <p className="font-semibold text-foreground">{d.company}</p>
                            <p className="text-xs text-muted-2">{d.businessEmail}</p>
                          </td>
                          <td className="px-4 py-3.5 text-muted">
                            <p className="font-semibold text-foreground">{d.creatorName}</p>
                            <p className="text-xs text-muted-2">{d.creatorEmail}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-xs text-muted-2">Offered: {d.budget || d.proposedBudget || 'N/A'}</p>
                            <p className="font-bold text-foreground">
                              Agency Price: {d.dealValue ? `$${Number(d.dealValue).toLocaleString()}` : 'TBD'}
                            </p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                                DEAL_BADGES[d.status] || DEAL_BADGES.proposed
                              }`}
                            >
                              {d.status === 'proposed' ? 'Pending Agency Approval' : d.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {d.status === 'proposed' && (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    id={`price-${d.id}`}
                                    placeholder="Price $"
                                    defaultValue={d.dealValue || 1500}
                                    className="w-20 rounded-lg border border-border bg-surface px-2 py-1 text-xs font-semibold text-foreground"
                                  />
                                  <button
                                    onClick={() => {
                                      const input = document.getElementById(`price-${d.id}`) as HTMLInputElement;
                                      const price = input ? Number(input.value) : 1500;
                                      handleAdminDealAction('deal', d.id, 'approve_and_start', price);
                                    }}
                                    disabled={actionId === d.id}
                                    className="btn-primary py-1 px-2.5 text-xs font-bold"
                                  >
                                    Approve & Start
                                  </button>
                                </div>
                              )}
                              {d.status === 'active' && (
                                <span className="text-xs font-semibold text-primary-2 px-2 py-1 bg-primary-2/10 rounded-lg">
                                  Filming in Progress
                                </span>
                              )}
                              {d.status === 'completed' && (
                                <span className="text-xs font-semibold text-warning px-2 py-1 bg-warning/10 rounded-lg">
                                  Awaiting Payout
                                </span>
                              )}
                              {d.status === 'paid' && (
                                <span className="text-xs font-semibold text-success px-2 py-1 bg-success/10 rounded-lg">
                                  Paid & Completed
                                </span>
                              )}
                              <button
                                onClick={() => handleDeleteDeal(d.id, d.product)}
                                className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2 py-1 text-xs font-bold text-danger transition-colors hover:bg-danger/20"
                                title="Delete Deal"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(data.deals || []).length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                            No deals yet. Click "Create Campaign / Deal" to launch a new sponsorship partnership.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEADS */}
          {!dataLoading && activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">Inbound Business Leads</h3>
                  <p className="text-xs text-muted-2">Manage incoming sponsorship requests and convert them to brand partnerships</p>
                </div>
                <button
                  onClick={() => setAddLeadModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-soft transition-all hover:bg-accent/90 shrink-0 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Lead (إضافة ليد)
                </button>
              </div>

              <div className="dl-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-primary text-white uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3.5 font-bold">Company</th>
                        <th className="px-4 py-3.5 font-bold">Contact</th>
                        <th className="px-4 py-3.5 font-bold">What they want</th>
                        <th className="px-4 py-3.5 font-bold">Date</th>
                        <th className="px-4 py-3.5 text-right font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filterBySearch(data.leads || [], ['name', 'company', 'email', 'promotion_needs']).map((l: any) => (
                        <tr key={l.id} className="transition-colors hover:bg-soft-2/60">
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-foreground">{l.company}</p>
                            <p className="text-xs text-muted-2">{l.name}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted">{l.email}</td>
                          <td className="max-w-xs px-4 py-3.5 text-xs leading-relaxed text-muted">
                            {l.promotion_needs}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted">
                            {new Date(l.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`mailto:${l.email}?subject=DealLink`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-2 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary shadow-soft"
                              >
                                <Mail className="h-3 w-3" />
                                Reply
                              </a>
                              <button
                                onClick={() => handleDeleteLead(l.id, l.company)}
                                className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2 py-1.5 text-xs font-bold text-danger transition-colors hover:bg-danger/20"
                                title="Delete Lead"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filterBySearch(data.leads || [], ['name', 'company', 'email', 'promotion_needs']).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted">
                            No leads yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* MULTI-CREATOR CHAT STUDIO */}
          {!dataLoading && activeTab === 'chat' && (
            <div className="dl-card flex flex-col md:flex-row h-[700px] overflow-hidden border border-border">
              {/* LEFT SIDEBAR: CREATORS DIRECTORY & CHATS */}
              <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-border flex flex-col bg-surface/40">
                <div className="p-4 border-b border-border bg-surface">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-accent" />
                      Creator Conversations
                    </h3>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                      {(data.creators || []).length} Creators
                    </span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-2" />
                    <input
                      type="text"
                      placeholder="Search creators..."
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-border bg-soft-2 py-1.5 pl-8 pr-3 text-xs font-medium text-foreground placeholder:text-muted-2 focus:border-accent/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-border/50">
                  {(() => {
                    const allCreators: any[] = data.creators || [];
                    const filtered = allCreators.filter((c: any) => {
                      if (!chatSearchQuery) return true;
                      const q = chatSearchQuery.toLowerCase();
                      return (
                        c.name?.toLowerCase().includes(q) ||
                        c.email?.toLowerCase().includes(q) ||
                        c.niche?.toLowerCase().includes(q)
                      );
                    });

                    // Sort: creators with existing messages first
                    const sorted = [...filtered].sort((a: any, b: any) => {
                      const aMsgs = chatMessages.filter((m) => m.fromUserId === a.id || m.toUserId === a.id);
                      const bMsgs = chatMessages.filter((m) => m.fromUserId === b.id || m.toUserId === b.id);
                      if (aMsgs.length && !bMsgs.length) return -1;
                      if (!aMsgs.length && bMsgs.length) return 1;
                      const aLast = aMsgs[aMsgs.length - 1]?.createdAt || 0;
                      const bLast = bMsgs[bMsgs.length - 1]?.createdAt || 0;
                      return new Date(bLast).getTime() - new Date(aLast).getTime();
                    });

                    if (sorted.length === 0) {
                      return <div className="p-8 text-center text-xs text-muted">No creators match your search.</div>;
                    }

                    return sorted.map((c: any) => {
                      const creatorMsgs = chatMessages.filter((m) => m.fromUserId === c.id || m.toUserId === c.id);
                      const lastMsg = creatorMsgs[creatorMsgs.length - 1];
                      const isSelected = chatUser === c.id;

                      return (
                        <button
                          key={c.id}
                          onClick={() => setChatUser(c.id)}
                          className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors hover:bg-soft-2/80 ${
                            isSelected ? 'bg-soft-2 border-l-4 border-accent' : ''
                          }`}
                        >
                          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-2 to-accent text-sm font-bold text-white shrink-0 shadow-soft">
                            {c.profileImage ? (
                              <img src={c.profileImage} alt={c.name} className="h-full w-full object-cover" />
                            ) : (
                              (c.name || '?')[0]
                            )}
                            {c.verified && (
                              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-white shadow">
                                <BadgeCheck className="h-2.5 w-2.5" />
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="font-semibold text-xs text-foreground truncate flex items-center gap-1">
                                {c.name}
                                {c.verified && <BadgeCheck className="h-3 w-3 text-accent shrink-0" />}
                              </p>
                              {lastMsg && (
                                <span className="text-[10px] text-muted-2 shrink-0">
                                  {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-muted-2 truncate mt-0.5">
                              {lastMsg ? lastMsg.message : `Click to message · ${c.niche}`}
                            </p>
                          </div>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* RIGHT PANE: ACTIVE CONVERSATION */}
              <div className="flex-1 flex flex-col bg-background/50">
                {chatUser ? (
                  (() => {
                    const activeCreator = (data.creators || []).find((c: any) => c.id === chatUser);
                    const userMsgs = chatMessages.filter((m) => m.fromUserId === chatUser || m.toUserId === chatUser);

                    return (
                      <>
                        {/* Conversation Header */}
                        <div className="p-3.5 sm:p-4 border-b border-border bg-surface flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-2 to-accent text-sm font-bold text-white shrink-0 shadow-soft">
                              {activeCreator?.profileImage ? (
                                <img src={activeCreator.profileImage} alt={activeCreator.name} className="h-full w-full object-cover" />
                              ) : (
                                (activeCreator?.name || '?')[0]
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-foreground truncate flex items-center gap-1.5">
                                {activeCreator?.name || 'Creator'}
                                {activeCreator?.verified && <BadgeCheck className="h-3.5 w-3.5 text-accent" />}
                              </h4>
                              <p className="text-[11px] text-muted-2 truncate flex items-center gap-2">
                                <span>{activeCreator?.email}</span>
                                {activeCreator?.niche && <span>· {activeCreator.niche}</span>}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {activeCreator && (
                              <button
                                onClick={() => openEditCreator(activeCreator)}
                                className="inline-flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent/20"
                              >
                                <Edit3 className="h-3 w-3" />
                                Edit Profile
                              </button>
                            )}
                            {activeCreator?.email && (
                              <a
                                href={`mailto:${activeCreator.email}?subject=DealLink%20Admin%20Message`}
                                className="inline-flex items-center gap-1 rounded-lg border border-border bg-soft-2 px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent/40"
                              >
                                <Mail className="h-3 w-3" />
                                Email
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                          {userMsgs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-3">
                                <MessageSquare className="h-6 w-6" />
                              </div>
                              <p className="font-semibold text-sm text-foreground">
                                Start a chat with {activeCreator?.name || 'this creator'}
                              </p>
                              <p className="text-xs text-muted max-w-sm mt-1">
                                Any message you send here is saved in their DealLink portal AND automatically emailed to their personal inbox.
                              </p>
                            </div>
                          ) : (
                            userMsgs.map((msg) => {
                              const isAdmin = msg.fromUserId === 'admin';
                              return (
                                <div key={msg._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                  <div
                                    className={`max-w-[78%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-soft ${
                                      isAdmin
                                        ? 'bg-primary-2 text-white rounded-tr-xs'
                                        : 'bg-surface border border-border text-foreground rounded-tl-xs'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1">
                                      <span className="font-bold">{isAdmin ? 'DealLink Team (You)' : msg.fromUserName}</span>
                                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Input Footer */}
                        <div className="border-t border-border p-3 sm:p-4 bg-surface">
                          <form onSubmit={handleSendChat} className="flex gap-2">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder={`Message ${activeCreator?.name || 'creator'}...`}
                              className="dl-input flex-1 text-xs sm:text-sm"
                            />
                            <button
                              type="submit"
                              disabled={chatLoading || !chatInput.trim()}
                              className="btn-primary py-2 px-4 shrink-0"
                            >
                              {chatLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="h-3.5 w-3.5" />
                                  <span>Send</span>
                                </>
                              )}
                            </button>
                          </form>
                          <p className="text-[10px] text-muted-2 mt-1.5 flex items-center gap-1">
                            <span>✉️</span> A notification email will be dispatched to <strong>{activeCreator?.email}</strong> upon sending.
                          </p>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted">
                    <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-3">
                      <MessageSquare className="h-7 w-7" />
                    </div>
                    <p className="font-semibold text-foreground text-sm">Select a creator to start messaging</p>
                    <p className="text-xs text-muted-2 max-w-xs mt-1">
                      Choose any creator from the left directory to view conversations or send instant messages.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* ADMIN CREATOR PROFILE EDITOR MODAL */}
      {editCreatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary p-5 sm:p-6 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-soft">
                  Admin Profile Control
                </span>
                <h3 className="text-lg font-bold">Edit Profile: {editCreatorForm.name}</h3>
                <p className="text-xs text-white/70">{editCreatorForm.email}</p>
              </div>
              <button
                onClick={() => setEditCreatorModal(null)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub-tab Switcher */}
            <div className="flex border-b border-border bg-soft-2 p-2 gap-2">
              <button
                type="button"
                onClick={() => setEditCreatorSubTab('media')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  editCreatorSubTab === 'media' ? 'bg-primary-2 text-white shadow-soft' : 'text-muted hover:text-foreground'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Banner, Photos & Videos
              </button>
              <button
                type="button"
                onClick={() => setEditCreatorSubTab('social')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  editCreatorSubTab === 'social' ? 'bg-primary-2 text-white shadow-soft' : 'text-muted hover:text-foreground'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Social Media Links
              </button>
              <button
                type="button"
                onClick={() => setEditCreatorSubTab('bio')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  editCreatorSubTab === 'bio' ? 'bg-primary-2 text-white shadow-soft' : 'text-muted hover:text-foreground'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Details, Bio & Verification
              </button>
              <button
                type="button"
                onClick={() => setEditCreatorSubTab('badges')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  editCreatorSubTab === 'badges' ? 'bg-primary-2 text-white shadow-soft' : 'text-muted hover:text-foreground'
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                Badges & Awards
              </button>
              <button
                type="button"
                onClick={() => setEditCreatorSubTab('packages')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  editCreatorSubTab === 'packages' ? 'bg-primary-2 text-white shadow-soft' : 'text-muted hover:text-foreground'
                }`}
              >
                <DollarSign className="h-3.5 w-3.5 text-green-400" />
                Private Rates (التسعيرات)
                {editCreatorForm.packages.length > 0 && (
                  <span className="rounded-full bg-green-500/20 text-green-400 px-1.5 py-0.2 text-[10px] font-bold">
                    {editCreatorForm.packages.length}
                  </span>
                )}
              </button>
            </div>

            <form onSubmit={handleSaveCreatorProfile} className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* SUB-TAB 1: MEDIA, BANNER & VIDEOS */}
              {editCreatorSubTab === 'media' && (
                <div className="space-y-5">
                  {/* Banner */}
                  <div className="rounded-xl border border-border p-4 bg-surface/50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-foreground">Cover Banner Image</label>
                      {editCreatorForm.coverImage && (
                        <button
                          type="button"
                          onClick={() => setEditCreatorForm({ ...editCreatorForm, coverImage: '' })}
                          className="text-[11px] text-danger font-semibold hover:underline"
                        >
                          Clear Banner
                        </button>
                      )}
                    </div>
                    <div className="relative h-28 w-full rounded-lg overflow-hidden border border-border bg-soft-2 mb-2">
                      {editCreatorForm.coverImage ? (
                        <img src={editCreatorForm.coverImage} alt="Banner" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted">No banner image</div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setEditCreatorForm({ ...editCreatorForm, coverImage: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-muted file:mr-2 file:rounded-lg file:border-0 file:bg-accent/10 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-accent hover:file:bg-accent/20"
                      />
                      <input
                        type="url"
                        placeholder="Or banner URL..."
                        value={editCreatorForm.coverImage.startsWith('data:') ? '' : editCreatorForm.coverImage}
                        onChange={(e) => setEditCreatorForm({ ...editCreatorForm, coverImage: e.target.value })}
                        className="dl-input text-xs sm:w-1/2"
                      />
                    </div>
                  </div>

                  {/* Profile Avatar */}
                  <div className="rounded-xl border border-border p-4 bg-surface/50">
                    <label className="text-xs font-bold text-foreground block mb-2">Profile Avatar</label>
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-2 to-accent text-xl font-bold text-white shrink-0 border border-border shadow-soft">
                        {editCreatorForm.profileImage ? (
                          <img src={editCreatorForm.profileImage} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          (editCreatorForm.name || '?')[0]
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setEditCreatorForm({ ...editCreatorForm, profileImage: reader.result as string });
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-xs text-muted file:mr-2 file:rounded-lg file:border-0 file:bg-accent/10 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-accent hover:file:bg-accent/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photos Showcase */}
                  <div className="rounded-xl border border-border p-4 bg-surface/50">
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Showcase Photos ({editCreatorForm.media.length})
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {editCreatorForm.media.map((url, idx) => (
                        <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-border group">
                          <img src={url} alt={`Media ${idx}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...editCreatorForm.media];
                              next.splice(idx, 1);
                              setEditCreatorForm({ ...editCreatorForm, media: next });
                            }}
                            className="absolute top-1 right-1 rounded-md bg-black/70 p-1 text-white hover:bg-danger"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Image URL to add..."
                        value={newAdminPhotoUrl}
                        onChange={(e) => setNewAdminPhotoUrl(e.target.value)}
                        className="dl-input text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newAdminPhotoUrl.trim()) {
                            setEditCreatorForm({
                              ...editCreatorForm,
                              media: [...editCreatorForm.media, newAdminPhotoUrl.trim()],
                            });
                            setNewAdminPhotoUrl('');
                          }
                        }}
                        className="btn-primary py-1.5 px-3 text-xs shrink-0"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Videos Showcase */}
                  <div className="rounded-xl border border-border p-4 bg-surface/50">
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Showcase Videos ({editCreatorForm.videos.length})
                    </label>
                    <div className="space-y-1.5 mb-3">
                      {editCreatorForm.videos.map((vid, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-border bg-surface text-xs">
                          <div className="min-w-0 flex-1 truncate">
                            <span className="font-semibold">{vid.title || 'Video'}</span> — <span className="text-muted-2">{vid.url}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...editCreatorForm.videos];
                              next.splice(idx, 1);
                              setEditCreatorForm({ ...editCreatorForm, videos: next });
                            }}
                            className="text-danger hover:opacity-80 p-1 shrink-0 ml-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Title (e.g. YouTube Video)"
                        value={newAdminVideoTitle}
                        onChange={(e) => setNewAdminVideoTitle(e.target.value)}
                        className="dl-input text-xs sm:w-1/3"
                      />
                      <input
                        type="url"
                        placeholder="Video URL..."
                        value={newAdminVideoUrl}
                        onChange={(e) => setNewAdminVideoUrl(e.target.value)}
                        className="dl-input text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newAdminVideoUrl.trim()) {
                            setEditCreatorForm({
                              ...editCreatorForm,
                              videos: [
                                ...editCreatorForm.videos,
                                { title: newAdminVideoTitle.trim() || 'Video', url: newAdminVideoUrl.trim() },
                              ],
                            });
                            setNewAdminVideoTitle('');
                            setNewAdminVideoUrl('');
                          }
                        }}
                        className="btn-primary py-1.5 px-3 text-xs shrink-0"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: SOCIAL ACCOUNTS */}
              {editCreatorSubTab === 'social' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="dl-label">YouTube URL</label>
                    <input
                      type="url"
                      value={editCreatorForm.youtube}
                      onChange={(e) => setEditCreatorForm({ ...editCreatorForm, youtube: e.target.value })}
                      className="dl-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="dl-label">Instagram URL</label>
                    <input
                      type="url"
                      value={editCreatorForm.instagram}
                      onChange={(e) => setEditCreatorForm({ ...editCreatorForm, instagram: e.target.value })}
                      className="dl-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="dl-label">TikTok URL</label>
                    <input
                      type="url"
                      value={editCreatorForm.tiktok}
                      onChange={(e) => setEditCreatorForm({ ...editCreatorForm, tiktok: e.target.value })}
                      className="dl-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="dl-label">Twitter / X URL</label>
                    <input
                      type="url"
                      value={editCreatorForm.twitter}
                      onChange={(e) => setEditCreatorForm({ ...editCreatorForm, twitter: e.target.value })}
                      className="dl-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="dl-label">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editCreatorForm.linkedin}
                      onChange={(e) => setEditCreatorForm({ ...editCreatorForm, linkedin: e.target.value })}
                      className="dl-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="dl-label">Twitch URL</label>
                    <input
                      type="url"
                      value={editCreatorForm.twitch}
                      onChange={(e) => setEditCreatorForm({ ...editCreatorForm, twitch: e.target.value })}
                      className="dl-input text-xs"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: BIO, DETAILS & VERIFICATION */}
              {editCreatorSubTab === 'bio' && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="dl-label">Creator Name</label>
                      <input
                        type="text"
                        required
                        value={editCreatorForm.name}
                        onChange={(e) => setEditCreatorForm({ ...editCreatorForm, name: e.target.value })}
                        className="dl-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="dl-label">Tagline (Title)</label>
                      <input
                        type="text"
                        value={editCreatorForm.tagline}
                        onChange={(e) => setEditCreatorForm({ ...editCreatorForm, tagline: e.target.value })}
                        className="dl-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="dl-label">Location</label>
                      <input
                        type="text"
                        value={editCreatorForm.location}
                        onChange={(e) => setEditCreatorForm({ ...editCreatorForm, location: e.target.value })}
                        className="dl-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="dl-label">Audience Size</label>
                      <input
                        type="number"
                        min="0"
                        value={editCreatorForm.subscriber_count}
                        onChange={(e) => setEditCreatorForm({ ...editCreatorForm, subscriber_count: e.target.value })}
                        className="dl-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="dl-label">Niche</label>
                      <select
                        value={editCreatorForm.niche}
                        onChange={(e) => setEditCreatorForm({ ...editCreatorForm, niche: e.target.value })}
                        className="dl-input appearance-none text-xs"
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
                    <label className="dl-label">Bio</label>
                    <textarea
                      rows={3}
                      value={editCreatorForm.bio}
                      onChange={(e) => setEditCreatorForm({ ...editCreatorForm, bio: e.target.value })}
                      className="dl-input text-xs resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-soft-2">
                    <input
                      type="checkbox"
                      id="verified-checkbox"
                      checked={editCreatorForm.verified}
                      onChange={(e) => setEditCreatorForm({ ...editCreatorForm, verified: e.target.checked })}
                      className="h-4 w-4 rounded text-accent focus:ring-accent"
                    />
                    <label htmlFor="verified-checkbox" className="text-xs font-semibold text-foreground cursor-pointer">
                      Mark as Verified Creator (يظهر كصانع محتوى موثق في الماركت بليس)
                    </label>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: BADGES & AWARDS */}
              {editCreatorSubTab === 'badges' && (
                <div className="space-y-4">
                  {/* Preset badges */}
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Preset Badges — click to toggle on/off</label>
                    <div className="flex flex-wrap gap-2">
                      {(['top-creator', 'responds-fast', 'featured', 'rising-star', 'high-roi', 'pro-quality'] as string[]).map((badgeId) => {
                        const isActive = editCreatorForm.badges.includes(badgeId);
                        const labels: Record<string, string> = {
                          'top-creator': '🏆 Top Creator',
                          'responds-fast': '⚡ Responds Fast',
                          'featured': '✨ Featured',
                          'rising-star': '📈 Rising Star',
                          'high-roi': '🔥 High ROI',
                          'pro-quality': '🛡 Pro Quality',
                        };
                        return (
                          <button
                            key={badgeId}
                            type="button"
                            onClick={() => {
                              if (isActive) {
                                setEditCreatorForm({ ...editCreatorForm, badges: editCreatorForm.badges.filter((b) => b !== badgeId) });
                              } else {
                                setEditCreatorForm({ ...editCreatorForm, badges: [...editCreatorForm.badges, badgeId] });
                              }
                            }}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                              isActive
                                ? 'border-accent/50 bg-accent/15 text-accent shadow-soft'
                                : 'border-border bg-soft-2 text-muted hover:border-accent/30 hover:text-foreground'
                            }`}
                          >
                            {labels[badgeId]}{isActive && <span className="ml-1.5 text-accent">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom badge input */}
                  <div>
                    <label className="dl-label">Add Custom Badge</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Brand Partner, Arabic Content..."
                        className="dl-input text-xs flex-1"
                        id="custom-badge-input-admin"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('custom-badge-input-admin') as HTMLInputElement;
                          if (input?.value.trim()) {
                            setEditCreatorForm({ ...editCreatorForm, badges: [...editCreatorForm.badges, input.value.trim()] });
                            input.value = '';
                          }
                        }}
                        className="btn-primary py-1.5 px-3 text-xs shrink-0"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Current badges preview */}
                  {editCreatorForm.badges.length > 0 ? (
                    <div className="rounded-xl border border-border p-4 bg-surface/50">
                      <label className="text-xs font-bold text-foreground block mb-2">
                        Active Badges ({editCreatorForm.badges.length}) — these appear on creator cards & profile
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {editCreatorForm.badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/85 px-2.5 py-1 text-xs font-bold text-white"
                          >
                            {badge.replace(/-/g, ' ')}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...editCreatorForm.badges];
                                next.splice(idx, 1);
                                setEditCreatorForm({ ...editCreatorForm, badges: next });
                              }}
                              className="text-white/50 hover:text-danger transition-colors"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-2">
                      No badges assigned yet. Toggle preset badges above or add a custom one.
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 5: PRIVATE DELIVERABLE PRICING (ADMIN ONLY) */}
              {editCreatorSubTab === 'packages' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-xs text-foreground">
                    <p className="font-bold flex items-center gap-1.5 text-accent">
                      <Lock className="h-3.5 w-3.5" />
                      Private Deliverable Pricing (خاص بلوحة الأدمن فقط)
                    </p>
                    <p className="mt-1 text-muted leading-relaxed">
                      حدد تسعيرات هذا الصانع للخدمات المختلفة (مثل ستوري إنستغرام، ريل، تيك توك، بوست، يوتيوب). هذه التسعيرات تظهر لك فقط في لوحة التحكم وتساعدك على تنظيم العروض والاتفاقيات، ولا يمكن لأي مستخدم أو صانع محتوى رؤيتها.
                    </p>
                  </div>

                  {/* Add New Rate Form */}
                  <div className="rounded-xl border border-border p-4 bg-surface/50 space-y-3">
                    <label className="text-xs font-bold text-foreground block">
                      Add New Deliverable Rate (إضافة تسعيرة خدمة)
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="dl-label">Deliverable Service</label>
                        <select
                          value={newPackageTitle}
                          onChange={(e) => setNewPackageTitle(e.target.value)}
                          className="dl-input text-xs"
                        >
                          {DELIVERABLE_PRESETS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="dl-label">Price (USD $)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-2">$</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="50"
                            value={newPackagePrice}
                            onChange={(e) => setNewPackagePrice(e.target.value)}
                            className="dl-input text-xs pl-7"
                          />
                        </div>
                      </div>
                    </div>

                    {newPackageTitle === 'Custom Deliverable Package' && (
                      <div>
                        <label className="dl-label">Custom Deliverable Name</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 Podcast Mention + Newsletter Banner"
                          value={newPackageDesc}
                          onChange={(e) => setNewPackageDesc(e.target.value)}
                          className="dl-input text-xs"
                        />
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const title = newPackageTitle === 'Custom Deliverable Package'
                            ? (newPackageDesc.trim() || 'Custom Deliverable')
                            : newPackageTitle;
                          const price = Number(newPackagePrice) || 0;
                          setEditCreatorForm({
                            ...editCreatorForm,
                            packages: [...editCreatorForm.packages, { title, price }],
                          });
                          if (newPackageTitle === 'Custom Deliverable Package') setNewPackageDesc('');
                        }}
                        className="btn-primary py-1.5 px-4 text-xs font-bold"
                      >
                        <Plus className="h-3 w-3" />
                        Add Deliverable Rate
                      </button>
                    </div>
                  </div>

                  {/* Active Packages List */}
                  {editCreatorForm.packages.length > 0 ? (
                    <div className="rounded-xl border border-border p-4 bg-surface/50 space-y-2">
                      <label className="text-xs font-bold text-foreground block mb-2">
                        Configured Rates ({editCreatorForm.packages.length})
                      </label>
                      <div className="space-y-2">
                        {editCreatorForm.packages.map((pkg, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-surface text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="h-7 w-7 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center font-bold text-xs shrink-0">
                                $
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-foreground truncate">{pkg.title}</p>
                                {pkg.description && <p className="text-[10px] text-muted-2 truncate">{pkg.description}</p>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-mono font-bold text-green-500 bg-green-500/10 px-2.5 py-0.5 rounded-lg border border-green-500/20 text-xs">
                                ${Number(pkg.price).toLocaleString()}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = [...editCreatorForm.packages];
                                  next.splice(idx, 1);
                                  setEditCreatorForm({ ...editCreatorForm, packages: next });
                                }}
                                className="text-muted hover:text-danger p-1 transition-colors"
                                title="Remove rate"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-2">
                      No deliverable rates added yet. Use the form above to set rates for Instagram stories, reels, posts, etc.
                    </div>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setEditCreatorModal(null)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editCreatorLoading}
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  {editCreatorLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Creator Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADMIN CONTACT CREATOR MODAL */}
      {contactCreatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-high"
          >
            <div className="flex items-center justify-between bg-primary p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-2 to-accent text-sm font-bold text-white shadow-soft">
                  {contactCreatorModal.profileImage ? (
                    <img src={contactCreatorModal.profileImage} alt={contactCreatorModal.name} className="h-full w-full object-cover" />
                  ) : (
                    (contactCreatorModal.name || '?')[0]
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-1.5">
                    Contact {contactCreatorModal.name}
                    {contactCreatorModal.verified && <BadgeCheck className="h-4 w-4 text-accent-soft" />}
                  </h3>
                  <p className="text-xs text-white/70">{contactCreatorModal.email}</p>
                </div>
              </div>
              <button
                onClick={() => setContactCreatorModal(null)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {contactQuickSuccess && (
                <div className="rounded-xl border border-accent/30 bg-accent/10 p-3 text-xs font-semibold text-accent flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  {contactQuickSuccess}
                </div>
              )}

              {/* Option 1: Direct Email */}
              <div className="rounded-xl border border-border p-4 bg-soft-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                    Option 1: Send Direct Email
                  </h4>
                  <p className="text-[11px] text-muted-2 truncate mt-0.5">
                    Open your email client to send an email to {contactCreatorModal.email}
                  </p>
                </div>
                <a
                  href={`mailto:${contactCreatorModal.email}?subject=DealLink%20Collaboration`}
                  className="rounded-lg bg-surface border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:border-accent/50 shrink-0"
                >
                  Open Email
                </a>
              </div>

              {/* Option 2: Instant Chat Message with Email Notification */}
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-accent" />
                    Option 2: Chat Message via DealLink
                  </h4>
                  <p className="text-[11px] text-muted mt-0.5">
                    The message will appear in their dashboard chat, and an immediate email notification will be sent to their email.
                  </p>
                </div>

                <form onSubmit={handleSendQuickContactChat} className="space-y-2.5">
                  <textarea
                    rows={3}
                    placeholder="Type your message to this creator..."
                    value={contactQuickMsg}
                    onChange={(e) => setContactQuickMsg(e.target.value)}
                    className="dl-input text-xs resize-none"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setChatUser(contactCreatorModal.id);
                        setActiveTab('chat');
                        setContactCreatorModal(null);
                      }}
                      className="text-xs text-accent font-semibold hover:underline"
                    >
                      Open Full Chat Studio →
                    </button>
                    <button
                      type="submit"
                      disabled={contactQuickLoading || !contactQuickMsg.trim()}
                      className="btn-primary py-2 px-4 text-xs font-bold"
                    >
                      {contactQuickLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          Send Message & Notify
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Creator bio modal */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-high"
          >
            <div className="flex items-center justify-between bg-primary p-6 text-white">
              <div>
                <h3 className="text-lg font-semibold">{selectedCreator.name}</h3>
                <p className="text-xs text-white/60">{selectedCreator.email}</p>
              </div>
              <button
                onClick={() => setSelectedCreator(null)}
                className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
                    Audience
                  </span>
                  <p className="text-xl font-bold text-foreground">
                    {Number(selectedCreator.subscriber_count).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  {selectedCreator.niche}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
                  Bio
                </span>
                <p className="mt-1 rounded-xl bg-soft-2 p-3.5 text-xs leading-relaxed text-muted">
                  {selectedCreator.bio || 'No bio provided.'}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <button
                  onClick={() => {
                    openEditCreator(selectedCreator);
                    setSelectedCreator(null);
                  }}
                  className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-bold text-accent hover:bg-accent/20"
                >
                  Edit in Admin
                </button>
                <button
                  onClick={() => {
                    setContactCreatorModal(selectedCreator);
                    setSelectedCreator(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-2 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-primary"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ADD CREATOR MODAL */}
      {addCreatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl my-8"
          >
            <div className="flex items-center justify-between bg-primary p-5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add New Creator (إضافة صانع محتوى)</h3>
                  <p className="text-xs text-white/70">Create a creator profile in the DealLink directory</p>
                </div>
              </div>
              <button
                onClick={() => setAddCreatorModalOpen(false)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCreator} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Faisal Al-Harbi"
                    value={addCreatorForm.name}
                    onChange={(e) => setAddCreatorForm({ ...addCreatorForm, name: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="creator@example.com"
                    value={addCreatorForm.email}
                    onChange={(e) => setAddCreatorForm({ ...addCreatorForm, email: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Password (Default: creator123!)</label>
                  <input
                    type="text"
                    placeholder="creator123!"
                    value={addCreatorForm.password}
                    onChange={(e) => setAddCreatorForm({ ...addCreatorForm, password: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Primary Niche *</label>
                  <select
                    value={addCreatorForm.niche}
                    onChange={(e) => setAddCreatorForm({ ...addCreatorForm, niche: e.target.value })}
                    className="dl-input text-xs"
                  >
                    {NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="dl-label">Audience Size</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="50000"
                    value={addCreatorForm.subscriber_count}
                    onChange={(e) => setAddCreatorForm({ ...addCreatorForm, subscriber_count: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Starting Rate ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                    value={addCreatorForm.pricingRate}
                    onChange={(e) => setAddCreatorForm({ ...addCreatorForm, pricingRate: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Location</label>
                  <input
                    type="text"
                    placeholder="Riyadh, Saudi Arabia"
                    value={addCreatorForm.location}
                    onChange={(e) => setAddCreatorForm({ ...addCreatorForm, location: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="dl-label">Channel or Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@channel or instagram.com/user"
                  value={addCreatorForm.channel_url}
                  onChange={(e) => setAddCreatorForm({ ...addCreatorForm, channel_url: e.target.value })}
                  className="dl-input text-xs"
                />
              </div>

              <div>
                <label className="dl-label">Tagline (Title)</label>
                <input
                  type="text"
                  placeholder="Tech Reviewer & Software Creator"
                  value={addCreatorForm.tagline}
                  onChange={(e) => setAddCreatorForm({ ...addCreatorForm, tagline: e.target.value })}
                  className="dl-input text-xs"
                />
              </div>

              <div>
                <label className="dl-label">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Tell brands about this creator's audience and content..."
                  value={addCreatorForm.bio}
                  onChange={(e) => setAddCreatorForm({ ...addCreatorForm, bio: e.target.value })}
                  className="dl-input text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-soft-2">
                <input
                  type="checkbox"
                  id="add-verified-check"
                  checked={addCreatorForm.verified}
                  onChange={(e) => setAddCreatorForm({ ...addCreatorForm, verified: e.target.checked })}
                  className="h-4 w-4 rounded text-accent focus:ring-accent"
                />
                <label htmlFor="add-verified-check" className="text-xs font-semibold text-foreground cursor-pointer">
                  Mark as Verified Creator immediately (توثيق الحساب فوراً)
                </label>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setAddCreatorModalOpen(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addCreatorLoading}
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  {addCreatorLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Creator Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADD BUSINESS MODAL */}
      {addBusinessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between bg-primary p-5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add Business Account (إضافة حساب بزنس)</h3>
                  <p className="text-xs text-white/70">Create a brand account capable of sponsoring creators</p>
                </div>
              </div>
              <button
                onClick={() => setAddBusinessModalOpen(false)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="p-6 space-y-4">
              <div>
                <label className="dl-label">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech SaaS"
                  value={addBusinessForm.company}
                  onChange={(e) => setAddBusinessForm({ ...addBusinessForm, company: e.target.value })}
                  className="dl-input text-xs"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Miller"
                    value={addBusinessForm.name}
                    onChange={(e) => setAddBusinessForm({ ...addBusinessForm, name: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Business Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="partnership@brand.com"
                    value={addBusinessForm.email}
                    onChange={(e) => setAddBusinessForm({ ...addBusinessForm, email: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Password (Default: business123!)</label>
                  <input
                    type="text"
                    placeholder="business123!"
                    value={addBusinessForm.password}
                    onChange={(e) => setAddBusinessForm({ ...addBusinessForm, password: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://brand.com"
                    value={addBusinessForm.website}
                    onChange={(e) => setAddBusinessForm({ ...addBusinessForm, website: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setAddBusinessModalOpen(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addBusinessLoading}
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  {addBusinessLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Business Account'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADD CAMPAIGN BRIEF MODAL */}
      {addBriefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl my-8"
          >
            <div className="flex items-center justify-between bg-primary p-5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Inbox className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add Campaign Brief (إضافة بريف جديد)</h3>
                  <p className="text-xs text-white/70">Create a sponsorship brief visible to marketplace creators</p>
                </div>
              </div>
              <button
                onClick={() => setAddBriefModalOpen(false)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBrief} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Link to Business Account</label>
                  <select
                    value={addBriefForm.businessId}
                    onChange={(e) => {
                      const bId = e.target.value;
                      const b = (data.businesses || []).find((x: any) => x.id === bId);
                      setAddBriefForm({
                        ...addBriefForm,
                        businessId: bId,
                        company: b ? (b.company || b.name) : addBriefForm.company,
                      });
                    }}
                    className="dl-input text-xs"
                  >
                    <option value="">-- Manual Company Name --</option>
                    {(data.businesses || []).map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.company || b.name} ({b.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="dl-label">Company / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NordVPN"
                    value={addBriefForm.company}
                    onChange={(e) => setAddBriefForm({ ...addBriefForm, company: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Product / Campaign Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next-Gen Cybersecurity Launch"
                    value={addBriefForm.product}
                    onChange={(e) => setAddBriefForm({ ...addBriefForm, product: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Niche *</label>
                  <select
                    value={addBriefForm.niche}
                    onChange={(e) => setAddBriefForm({ ...addBriefForm, niche: e.target.value })}
                    className="dl-input text-xs"
                  >
                    {NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="dl-label">Budget Range</label>
                  <input
                    type="text"
                    placeholder="$1,000 - $3,000"
                    value={addBriefForm.budget}
                    onChange={(e) => setAddBriefForm({ ...addBriefForm, budget: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Deliverables</label>
                  <input
                    type="text"
                    placeholder="1 Dedicated Video + 1 Story"
                    value={addBriefForm.deliverables}
                    onChange={(e) => setAddBriefForm({ ...addBriefForm, deliverables: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Min Audience</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="5000"
                    value={addBriefForm.minAudience}
                    onChange={(e) => setAddBriefForm({ ...addBriefForm, minAudience: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="dl-label">Campaign Description & Requirements *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the product, target audience, talking points, and call to action..."
                  value={addBriefForm.description}
                  onChange={(e) => setAddBriefForm({ ...addBriefForm, description: e.target.value })}
                  className="dl-input text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setAddBriefModalOpen(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addBriefLoading}
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  {addBriefLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish Brief'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* EDIT CAMPAIGN BRIEF MODAL */}
      {editBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl my-8"
          >
            <div className="flex items-center justify-between bg-primary p-5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Edit Campaign Brief</h3>
                  <p className="text-xs text-white/70">{editBriefForm.product} · {editBriefForm.company}</p>
                </div>
              </div>
              <button
                onClick={() => setEditBriefModal(null)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditBrief} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Company / Brand Name</label>
                  <input
                    type="text"
                    required
                    value={editBriefForm.company}
                    onChange={(e) => setEditBriefForm({ ...editBriefForm, company: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editBriefForm.product}
                    onChange={(e) => setEditBriefForm({ ...editBriefForm, product: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Niche</label>
                  <select
                    value={editBriefForm.niche}
                    onChange={(e) => setEditBriefForm({ ...editBriefForm, niche: e.target.value })}
                    className="dl-input text-xs"
                  >
                    {NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="dl-label">Status</label>
                  <select
                    value={editBriefForm.status}
                    onChange={(e) => setEditBriefForm({ ...editBriefForm, status: e.target.value })}
                    className="dl-input text-xs"
                  >
                    {BRIEF_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="dl-label">Budget</label>
                  <input
                    type="text"
                    value={editBriefForm.budget}
                    onChange={(e) => setEditBriefForm({ ...editBriefForm, budget: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Deliverables</label>
                  <input
                    type="text"
                    value={editBriefForm.deliverables}
                    onChange={(e) => setEditBriefForm({ ...editBriefForm, deliverables: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Min Audience</label>
                  <input
                    type="number"
                    min="0"
                    value={editBriefForm.minAudience}
                    onChange={(e) => setEditBriefForm({ ...editBriefForm, minAudience: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="dl-label">Description</label>
                <textarea
                  rows={4}
                  required
                  value={editBriefForm.description}
                  onChange={(e) => setEditBriefForm({ ...editBriefForm, description: e.target.value })}
                  className="dl-input text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setEditBriefModal(null)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editBriefLoading}
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  {editBriefLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* CREATE FULL CAMPAIGN / DEAL MODAL */}
      {createCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-primary p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary-2 to-accent flex items-center justify-center text-white shadow-soft">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-soft">
                    Campaign Builder & Partnerships
                  </span>
                  <h3 className="text-lg font-bold">Create Brand Campaign (إنشاء كامبين متكاملة)</h3>
                  <p className="text-xs text-white/70">
                    Connect a business to multiple creators with shared deliverables, terms, and payouts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateCampaignModalOpen(false)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Step 1: Basic Campaign Info & Business Selection */}
              <div className="rounded-xl border border-border p-4 bg-surface/50 space-y-3.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-accent">
                  <Briefcase className="h-3.5 w-3.5" />
                  1. Campaign & Brand Details
                </span>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="dl-label">Campaign / Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Summer App Launch 2026"
                      value={createCampaignForm.product}
                      onChange={(e) => setCreateCampaignForm({ ...createCampaignForm, product: e.target.value })}
                      className="dl-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="dl-label">Select Business Account * (حساب البزنس)</label>
                    <select
                      required
                      value={createCampaignForm.businessId}
                      onChange={(e) => setCreateCampaignForm({ ...createCampaignForm, businessId: e.target.value })}
                      className="dl-input text-xs"
                    >
                      <option value="">-- Choose Business --</option>
                      {(data.businesses || []).map((b: any) => (
                        <option key={b.id} value={b.id}>
                          {b.company || b.name} ({b.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="dl-label">Campaign Niche</label>
                    <select
                      value={createCampaignForm.niche}
                      onChange={(e) => setCreateCampaignForm({ ...createCampaignForm, niche: e.target.value })}
                      className="dl-input text-xs"
                    >
                      {NICHES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="dl-label">Campaign Partnership Status</label>
                    <select
                      value={createCampaignForm.status}
                      onChange={(e) => setCreateCampaignForm({ ...createCampaignForm, status: e.target.value })}
                      className="dl-input text-xs"
                    >
                      <option value="active">Active & Filming (نشط وقيد التنفيذ)</option>
                      <option value="proposed">Proposed / Pending Confirmation (مقترح)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Deliverables & Pricing */}
              <div className="rounded-xl border border-border p-4 bg-surface/50 space-y-3.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-accent">
                  <DollarSign className="h-3.5 w-3.5" />
                  2. Deliverables & Pricing
                </span>

                <div>
                  <label className="dl-label">Deliverables Required (الخدمات والمخرجات المطلوبة)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Instagram Reel + 1 Story"
                    value={createCampaignForm.deliverables}
                    onChange={(e) => setCreateCampaignForm({ ...createCampaignForm, deliverables: e.target.value })}
                    className="dl-input text-xs mb-2"
                  />
                  {/* Quick deliverable chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {['1 Instagram Story', '1 Instagram Reel', '1 TikTok Video (60s)', '1 Dedicated YouTube Video', '1 Story + 1 Reel'].map((dPreset) => (
                      <button
                        key={dPreset}
                        type="button"
                        onClick={() => setCreateCampaignForm({ ...createCampaignForm, deliverables: dPreset })}
                        className="rounded-lg border border-border bg-soft-2 px-2 py-0.5 text-[10px] font-semibold text-muted hover:border-accent/40 hover:text-foreground transition-colors"
                      >
                        + {dPreset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="dl-label">Budget / Price Per Creator ($ USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-2">$</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="1500"
                        value={createCampaignForm.dealValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCreateCampaignForm({
                            ...createCampaignForm,
                            dealValue: val,
                            budget: `$${Number(val || 0).toLocaleString()}`,
                          });
                        }}
                        className="dl-input text-xs pl-7"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="dl-label">Budget Summary</label>
                    <div className="p-2.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground flex items-center justify-between">
                      <span className="text-muted-2">Total Value:</span>
                      <span className="font-mono font-bold text-accent">
                        ${(Number(createCampaignForm.dealValue || 0) * (createCampaignForm.creatorIds.length || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="dl-label">Instructions, Hashtags & Guidelines (تعليمات الكامبين للطرفين)</label>
                  <textarea
                    rows={3}
                    placeholder="Provide clear instructions, brand links, required tags or hashtags, review deadline..."
                    value={createCampaignForm.notes}
                    onChange={(e) => setCreateCampaignForm({ ...createCampaignForm, notes: e.target.value })}
                    className="dl-input text-xs resize-none"
                  />
                </div>
              </div>

              {/* Step 3: Multi-Select Creators */}
              <div className="rounded-xl border border-border p-4 bg-surface/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-accent">
                    <Users className="h-3.5 w-3.5" />
                    3. Select Creators ({createCampaignForm.creatorIds.length} Selected)
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateCampaignForm({
                        ...createCampaignForm,
                        creatorIds: (data.creators || []).map((c: any) => c.id),
                      })}
                      className="text-[10px] font-bold text-accent hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-muted-2">·</span>
                    <button
                      type="button"
                      onClick={() => setCreateCampaignForm({
                        ...createCampaignForm,
                        creatorIds: [],
                      })}
                      className="text-[10px] font-bold text-muted-2 hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 border border-border rounded-xl p-2 bg-surface">
                  {(data.creators || []).map((c: any) => {
                    const isChecked = createCampaignForm.creatorIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? 'bg-accent/10 border border-accent/30' : 'hover:bg-soft-2 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCreateCampaignForm({
                                  ...createCampaignForm,
                                  creatorIds: [...createCampaignForm.creatorIds, c.id],
                                });
                              } else {
                                setCreateCampaignForm({
                                  ...createCampaignForm,
                                  creatorIds: createCampaignForm.creatorIds.filter((id) => id !== c.id),
                                });
                              }
                            }}
                            className="h-4 w-4 rounded text-accent focus:ring-accent"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate flex items-center gap-1">
                              {c.name}
                              {c.verified && <BadgeCheck className="h-3 w-3 text-accent" />}
                            </p>
                            <p className="text-[10px] text-muted-2 truncate">{c.email} · {c.niche}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-2">
                          <span className="text-[10px] font-bold text-muted-2 block">
                            {Number(c.subscriber_count).toLocaleString()} audience
                          </span>
                          {c.pricingRate > 0 && (
                            <span className="text-[9px] font-bold text-green-500">
                              ~${c.pricingRate} rate
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setCreateCampaignModalOpen(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCampaignLoading || createCampaignForm.creatorIds.length === 0}
                  className="btn-primary py-2.5 px-6 text-xs font-bold"
                >
                  {createCampaignLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Launch Campaign for {createCampaignForm.creatorIds.length} Creator(s)
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {addLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between bg-primary p-5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add Inbound Lead (إضافة ليد جديد)</h3>
                  <p className="text-xs text-white/70">Record a brand client inquiry or sponsorship lead</p>
                </div>
              </div>
              <button
                onClick={() => setAddLeadModalOpen(false)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              <div>
                <label className="dl-label">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RedBull Middle East"
                  value={addLeadForm.company}
                  onChange={(e) => setAddLeadForm({ ...addLeadForm, company: e.target.value })}
                  className="dl-input text-xs"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="dl-label">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Omar Khalid"
                    value={addLeadForm.name}
                    onChange={(e) => setAddLeadForm({ ...addLeadForm, name: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
                <div>
                  <label className="dl-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="omar@redbull.com"
                    value={addLeadForm.email}
                    onChange={(e) => setAddLeadForm({ ...addLeadForm, email: e.target.value })}
                    className="dl-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="dl-label">Website (Optional)</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={addLeadForm.website}
                  onChange={(e) => setAddLeadForm({ ...addLeadForm, website: e.target.value })}
                  className="dl-input text-xs"
                />
              </div>

              <div>
                <label className="dl-label">Promotion Needs / Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What products do they want to promote? Which niches or creators are they interested in?"
                  value={addLeadForm.promotion_needs}
                  onChange={(e) => setAddLeadForm({ ...addLeadForm, promotion_needs: e.target.value })}
                  className="dl-input text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setAddLeadModalOpen(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLeadLoading}
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  {addLeadLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Lead'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

