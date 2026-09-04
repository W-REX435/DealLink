import mongoose, { Schema, models, model, Document } from 'mongoose';

declare global {
  var mongooseCache: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI is not set. Copy .env.example to .env.local and fill in your MongoDB connection string.'
  );
}

const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/* ------------------------------------------------------------------ */
/*  User (creators)                                                    */
/* ------------------------------------------------------------------ */

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'creator' | 'business' | 'admin';
  company?: string;
  emailVerified: Date | null;
  image?: string;
  channelUrl?: string;
  subscriberCount?: number;
  niche?: string;
  bio?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    role: { type: String, enum: ['creator', 'business', 'admin'], default: 'creator' },
    company: { type: String, trim: true },
    emailVerified: { type: Date, default: null },
    image: { type: String },
    channelUrl: { type: String, trim: true },
    subscriberCount: { type: Number, default: 0 },
    niche: { type: String, default: 'Tech & SaaS' },
    bio: { type: String, default: '' },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);

/* ------------------------------------------------------------------ */
/*  BusinessLead                                                       */
/* ------------------------------------------------------------------ */

export interface IBusinessLead extends Document {
  name: string;
  company: string;
  email: string;
  website?: string;
  promotionNeeds: string;
  createdAt: Date;
}

const BusinessLeadSchema = new Schema<IBusinessLead>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    website: { type: String, default: '' },
    promotionNeeds: { type: String, required: true },
  },
  { timestamps: true }
);

export const BusinessLead =
  models.BusinessLead || model<IBusinessLead>('BusinessLead', BusinessLeadSchema);

/* ------------------------------------------------------------------ */
/*  BusinessApplication (Apply → Approve → Invite)                     */
/* ------------------------------------------------------------------ */

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface IBusinessApplication extends Document {
  contactName: string;
  email: string;
  company: string;
  website?: string;
  budgetRange: string;
  goals: string;
  timeline: string;
  status: ApplicationStatus;
  inviteToken?: string;
  inviteExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessApplicationSchema = new Schema<IBusinessApplication>(
  {
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    website: { type: String, default: '', trim: true },
    budgetRange: { type: String, required: true },
    goals: { type: String, required: true },
    timeline: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    inviteToken: { type: String, select: false },
    inviteExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const BusinessApplication =
  models.BusinessApplication ||
  model<IBusinessApplication>('BusinessApplication', BusinessApplicationSchema);

/* ------------------------------------------------------------------ */
/*  CampaignBrief (business → creators)                                */
/* ------------------------------------------------------------------ */

export type BriefStatus = 'submitted' | 'reviewing' | 'matched';

export interface ICampaignBrief extends Document {
  businessId: string;
  businessName: string;
  company: string;
  product: string;
  description: string;
  niche: string;
  minAudience: number;
  budget: string;
  deliverables: string;
  status: BriefStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignBriefSchema = new Schema<ICampaignBrief>(
  {
    businessId: { type: String, required: true },
    businessName: { type: String, required: true },
    company: { type: String, required: true },
    product: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    niche: { type: String, required: true },
    minAudience: { type: Number, default: 0 },
    budget: { type: String, required: true },
    deliverables: { type: String, required: true },
    status: {
      type: String,
      enum: ['submitted', 'reviewing', 'matched'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

export const CampaignBrief =
  models.CampaignBrief || model<ICampaignBrief>('CampaignBrief', CampaignBriefSchema);

/* ------------------------------------------------------------------ */
/*  Match (brief ↔ creator decision)                                   */
/* ------------------------------------------------------------------ */

export type MatchStatus = 'pending' | 'accepted' | 'declined';

export interface IMatch extends Document {
  briefId: string;
  creatorId: string;
  creatorName: string;
  businessName: string;
  company: string;
  product: string;
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    briefId: { type: String, required: true },
    creatorId: { type: String, required: true },
    creatorName: { type: String, required: true },
    businessName: { type: String, required: true },
    company: { type: String, required: true },
    product: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

MatchSchema.index({ briefId: 1, creatorId: 1 }, { unique: true });

export const Match = models.Match || model<IMatch>('Match', MatchSchema);
