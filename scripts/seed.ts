/**
 * Seed the MongoDB database with the original DealLink demo data.
 * Run: npm run seed
 */
import bcrypt from 'bcryptjs';
import { dbConnect, User, BusinessLead, CampaignBrief, Match, Deal } from '../lib/mongo';

const CREATORS = [
  {
    name: 'Swath Creator',
    email: 'user@deallink.co',
    password: 'user123',
    channelUrl: 'https://youtube.com/@deallinkcreator',
    subscriberCount: 125000,
    niche: 'Tech & SaaS',
    bio: 'Verified DealLink creator profile exploring modern software tools, productivity apps, and brand integrations.',
  },
  {
    name: 'Alex Rivera',
    email: 'alex@techreviewshq.com',
    password: 'creator123',
    channelUrl: 'https://youtube.com/@TechReviewsHQ',
    subscriberCount: 85000,
    niche: 'Tech & SaaS',
    bio: 'Hands-on deep dives into modern software tools, AI coding assistants, and cloud infrastructure for 85K tech leads and software engineers.',
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@productivitystack.io',
    password: 'creator123',
    channelUrl: 'https://youtube.com/@ProductivityStack',
    subscriberCount: 142000,
    niche: 'Productivity & Business',
    bio: 'Workflows, automation, and app reviews for founders, product managers, and remote teams.',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@codecrafted.dev',
    password: 'creator123',
    channelUrl: 'https://youtube.com/@CodeCrafted',
    subscriberCount: 63000,
    niche: 'Gaming & Esports',
    bio: 'Gaming reviews, hardware setups, and streaming strategy tutorials for an engaged gaming audience.',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@growthmatrix.media',
    password: 'creator123',
    channelUrl: 'https://youtube.com/@GrowthMatrixTech',
    subscriberCount: 110000,
    niche: 'Finance & Investing',
    bio: 'Evaluating personal finance apps, investment platforms, and budgeting tools for ambitious professionals.',
  },
  {
    name: 'David K. Miller',
    email: 'david@cloudnativeweekly.com',
    password: 'creator123',
    channelUrl: 'https://youtube.com/@CloudNativeWeekly',
    subscriberCount: 47000,
    niche: 'Lifestyle & Vlogs',
    bio: 'Digital nomad lifestyle vlogs, work-from-anywhere setups, and travel productivity gear reviews.',
  },
];

async function main() {
  await dbConnect();

  let created = 0;
  for (const c of CREATORS) {
    const existing = await User.findOne({ email: c.email });
    if (existing) {
      console.log(`⏭  Skipping ${c.email} (already exists)`);
      continue;
    }
    await User.create({
      name: c.name,
      email: c.email,
      password: await bcrypt.hash(c.password, 10),
      emailVerified: new Date(),
      channelUrl: c.channelUrl,
      subscriberCount: c.subscriberCount,
      niche: c.niche,
      bio: c.bio,
    });
    created++;
    console.log(`✅ Created ${c.name} <${c.email}>`);
  }

  const leadExists = await BusinessLead.findOne({ email: 'jordan@vectra.ai' });
  if (!leadExists) {
    await BusinessLead.create({
      name: 'Jordan Blake',
      company: 'Vectra Brand Tools',
      email: 'jordan@vectra.ai',
      website: 'https://vectra.ai',
      promotionNeeds:
        'We are launching our v2 creator workflow tool and looking for 3-5 creators with 20k-100k followers across tech, productivity, and finance for dedicated video/podcast integrations.',
    });
    console.log('✅ Created business lead: Vectra Brand Tools');
  } else {
    console.log('⏭  Skipping lead (already exists)');
  }

  // Demo business user (role: business)
  let business = await User.findOne({ email: 'jordan@vectra.ai' });
  if (!business) {
    business = await User.create({
      name: 'Jordan Blake',
      email: 'jordan@vectra.ai',
      password: await bcrypt.hash('business123', 10),
      role: 'business',
      company: 'Vectra Brand Tools',
      emailVerified: new Date(),
    });
    console.log('✅ Created demo business: Vectra Brand Tools <jordan@vectra.ai> (password: business123)');
  } else {
    console.log('⏭  Skipping business user (already exists)');
  }

  // Demo brief (Tech & SaaS, min 20k audience → matches several seeds)
  let brief = await CampaignBrief.findOne({ product: 'Vectra v2 — Creator Workflow Tool' });
  if (!brief) {
    brief = await CampaignBrief.create({
      businessId: business._id.toString(),
      businessName: business.name,
      company: 'Vectra Brand Tools',
      product: 'Vectra v2 — Creator Workflow Tool',
      description:
        'We are launching the v2 of our creator workflow tool and looking for creators who can demo it in a dedicated video. Focus on workflow automation, speed, and how it saves creators hours every week.',
      niche: 'Tech & SaaS',
      minAudience: 20000,
      budget: '$1,500 – $5,000',
      deliverables: '1 dedicated video',
      status: 'submitted',
    });
    console.log('✅ Created demo brief: Vectra v2 (Tech & SaaS, 20K+ audience)');
  } else {
    console.log('⏭  Skipping brief (already exists)');
  }

  // Demo match + deal with Alex Rivera (accepted → proposed deal)
  const alex = await User.findOne({ email: 'alex@techreviewshq.com' });
  if (alex) {
    let match = await Match.findOne({ briefId: brief._id.toString() });
    if (!match) {
      match = await Match.create({
        briefId: brief._id.toString(),
        creatorId: alex._id.toString(),
        creatorName: alex.name,
        businessName: business.name,
        company: 'Vectra Brand Tools',
        product: brief.product,
        status: 'accepted',
      });
      console.log('✅ Created demo match: Alex Rivera ↔ Vectra');
    }
    let deal = await Deal.findOne({ briefId: brief._id.toString() });
    if (!deal) {
      await Deal.create({
        briefId: brief._id.toString(),
        matchId: match._id.toString(),
        creatorId: alex._id.toString(),
        creatorName: alex.name,
        creatorEmail: alex.email,
        businessId: business._id.toString(),
        businessName: business.name,
        businessEmail: business.email,
        company: 'Vectra Brand Tools',
        product: brief.product,
        niche: brief.niche,
        deliverables: brief.deliverables,
        budget: brief.budget,
        dealValue: 2400,
        status: 'proposed',
      });
      console.log('✅ Created demo deal: Vectra v2 × Alex Rivera ($2,400, proposed)');
    } else {
      console.log('⏭  Skipping deal (already exists)');
    }
  }

  console.log('\nDone. Demo credentials:');
  console.log('  Creators: any seed email / creator123 (e.g. alex@techreviewshq.com)');
  console.log('  Business: jordan@vectra.ai / business123');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
