/**
 * seed-master-user.ts
 * Run with: npx ts-node -e "require('./scripts/seed-master-user')"
 * Or: npx tsx scripts/seed-master-user.ts
 *
 * Creates / updates the master admin user for swathilais2009@gmail.com
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch {}

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MASTER_EMAIL = 'swathilais2009@gmail.com';
const MASTER_PASSWORD = 'wathilais2009';
const MASTER_NAME = 'Swath (Master)';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI is not set in .env.local — cannot run seeder.');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB...');
  await mongoose.connect(uri, { bufferCommands: false });
  console.log('✅  Connected.');

  // Dynamically import the User model after connection
  const { User } = await import('../lib/mongo');

  const hashed = await bcrypt.hash(MASTER_PASSWORD, 12);

  const existing = await User.findOne({ email: MASTER_EMAIL });

  if (existing) {
    existing.name = MASTER_NAME;
    existing.password = hashed;
    existing.role = 'admin';
    existing.emailVerified = existing.emailVerified ?? new Date();
    await existing.save();
    console.log('✅  Master user updated successfully:', MASTER_EMAIL);
  } else {
    await User.create({
      name: MASTER_NAME,
      email: MASTER_EMAIL,
      password: hashed,
      role: 'admin',
      emailVerified: new Date(),
      channelUrl: 'https://deallink.co',
      subscriberCount: 0,
      niche: 'Tech & SaaS',
      bio: 'Master admin account with full access across DealLink.',
    });
    console.log('✅  Master user created successfully:', MASTER_EMAIL);
  }

  await mongoose.disconnect();
  console.log('🔌  Disconnected. Done!');
}

main().catch((err) => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
