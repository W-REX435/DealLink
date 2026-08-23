import fs from 'fs';
import path from 'path';

// Define types
export interface Creator {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  channel_url: string;
  subscriber_count: number;
  niche: string;
  bio: string;
  created_at: string;
}

export interface BusinessLead {
  id: string;
  name: string;
  company: string;
  email: string;
  website: string;
  promotion_needs: string;
  created_at: string;
}

interface DbSchema {
  creators: Creator[];
  business_leads: BusinessLead[];
}

const dbFilePath = path.join(process.cwd(), 'deallink-db.json');

// Initial seed data
const initialData: DbSchema = {
  creators: [
    {
      id: 'creator-user-account',
      name: 'Swath Creator',
      email: 'user@deallink.co',
      password_hash: 'user123',
      channel_url: 'https://youtube.com/@deallinkcreator',
      subscriber_count: 125000,
      niche: 'Tech & SaaS',
      bio: 'Verified DealLink creator profile exploring modern software tools, productivity apps, and brand integrations.',
      created_at: '2026-08-23T15:20:00.000Z',
    },
    {
      id: 'creator-seed-1',
      name: 'Alex Rivera',
      email: 'alex@techreviewshq.com',
      password_hash: 'creator123',
      channel_url: 'https://youtube.com/@TechReviewsHQ',
      subscriber_count: 85000,
      niche: 'Tech & SaaS',
      bio: 'Hands-on deep dives into modern software tools, AI coding assistants, and cloud infrastructure for 85K tech leads and software engineers.',
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      id: 'creator-seed-2',
      name: 'Sarah Chen',
      email: 'sarah@productivitystack.io',
      password_hash: 'creator123',
      channel_url: 'https://youtube.com/@ProductivityStack',
      subscriber_count: 142000,
      niche: 'Productivity & Business',
      bio: 'Workflows, automation, and app reviews for founders, product managers, and remote teams.',
      created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
    {
      id: 'creator-seed-3',
      name: 'Marcus Vance',
      email: 'marcus@codecrafted.dev',
      password_hash: 'creator123',
      channel_url: 'https://youtube.com/@CodeCrafted',
      subscriber_count: 63000,
      niche: 'Gaming & Esports',
      bio: 'Gaming reviews, hardware setups, and streaming strategy tutorials for an engaged gaming audience.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'creator-seed-4',
      name: 'Elena Rostova',
      email: 'elena@growthmatrix.media',
      password_hash: 'creator123',
      channel_url: 'https://youtube.com/@GrowthMatrixTech',
      subscriber_count: 110000,
      niche: 'Finance & Investing',
      bio: 'Evaluating personal finance apps, investment platforms, and budgeting tools for ambitious professionals.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'creator-seed-5',
      name: 'David K. Miller',
      email: 'david@cloudnativeweekly.com',
      password_hash: 'creator123',
      channel_url: 'https://youtube.com/@CloudNativeWeekly',
      subscriber_count: 47000,
      niche: 'Lifestyle & Vlogs',
      bio: 'Digital nomad lifestyle vlogs, work-from-anywhere setups, and travel productivity gear reviews.',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ],
  business_leads: [
    {
      id: 'lead-seed-1',
      name: 'Jordan Blake',
      company: 'Vectra Brand Tools',
      email: 'jordan@vectra.ai',
      website: 'https://vectra.ai',
      promotion_needs: 'We are launching our v2 creator workflow tool and looking for 3-5 creators with 20k-100k followers across tech, productivity, and finance for dedicated video/podcast integrations.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
};

function readDb(): DbSchema {
  try {
    if (!fs.existsSync(dbFilePath)) {
      writeDb(initialData);
      return initialData;
    }
    const raw = fs.readFileSync(dbFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      creators: Array.isArray(parsed.creators) ? parsed.creators : initialData.creators,
      business_leads: Array.isArray(parsed.business_leads) ? parsed.business_leads : initialData.business_leads,
    };
  } catch (err) {
    return initialData;
  }
}

function writeDb(data: DbSchema): void {
  try {
    const tempFile = dbFilePath + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, dbFilePath);
  } catch (err) {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// Database helper functions
export function getCreatorCount(): number {
  const db = readDb();
  return db.creators.length;
}

export function getAllCreators(): Creator[] {
  const db = readDb();
  return [...db.creators].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getCreatorByEmail(email: string): Creator | null {
  const db = readDb();
  const normalized = email.toLowerCase().trim();
  return db.creators.find((c) => c.email.toLowerCase() === normalized) || null;
}

export function getCreatorById(id: string): Creator | null {
  const db = readDb();
  return db.creators.find((c) => c.id === id) || null;
}

export function createCreator(data: {
  name: string;
  email: string;
  password_hash: string;
  channel_url: string;
  subscriber_count: number;
  niche: string;
  bio: string;
}): Creator {
  const db = readDb();
  const normalizedEmail = data.email.toLowerCase().trim();
  
  if (db.creators.some((c) => c.email.toLowerCase() === normalizedEmail)) {
    throw new Error('A creator with this email address already exists.');
  }

  const newCreator: Creator = {
    id: 'creator-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: data.name,
    email: normalizedEmail,
    password_hash: data.password_hash,
    channel_url: data.channel_url,
    subscriber_count: Number(data.subscriber_count) || 0,
    niche: data.niche,
    bio: data.bio,
    created_at: new Date().toISOString(),
  };

  db.creators.unshift(newCreator);
  writeDb(db);

  return newCreator;
}

export function updateCreator(id: string, updates: Partial<{
  name: string;
  channel_url: string;
  subscriber_count: number;
  niche: string;
  bio: string;
}>): Creator {
  const db = readDb();
  const index = db.creators.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error('Creator not found.');
  }

  const existing = db.creators[index];
  const updated: Creator = {
    ...existing,
    name: updates.name !== undefined ? updates.name : existing.name,
    channel_url: updates.channel_url !== undefined ? updates.channel_url : existing.channel_url,
    subscriber_count: updates.subscriber_count !== undefined ? Number(updates.subscriber_count) : existing.subscriber_count,
    niche: updates.niche !== undefined ? updates.niche : existing.niche,
    bio: updates.bio !== undefined ? updates.bio : existing.bio,
  };

  db.creators[index] = updated;
  writeDb(db);

  return updated;
}

export function createBusinessLead(data: {
  name: string;
  company: string;
  email: string;
  website: string;
  promotion_needs: string;
}): BusinessLead {
  const db = readDb();
  const lead: BusinessLead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: data.name,
    company: data.company,
    email: data.email.toLowerCase().trim(),
    website: data.website,
    promotion_needs: data.promotion_needs,
    created_at: new Date().toISOString(),
  };

  db.business_leads.unshift(lead);
  writeDb(db);

  return lead;
}

export function getAllBusinessLeads(): BusinessLead[] {
  const db = readDb();
  return [...db.business_leads].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
