import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  type: 'tech' | 'admin' | 'customer' | 'vendor';
  organizationName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  isActive: boolean;
  metadata?: Record<string, any>;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: [true, 'Tenant name is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['tech', 'admin', 'customer', 'vendor'],
      required: [true, 'Tenant type is required'],
    },
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
tenantSchema.index({ name: 1 });
tenantSchema.index({ type: 1 });
tenantSchema.index({ isActive: 1 });

export default mongoose.model<ITenant>('Tenant', tenantSchema);

