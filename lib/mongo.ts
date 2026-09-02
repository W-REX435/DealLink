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
