import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRFQItem {
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  requiredBy?: Date;
  specifications?: string;
}

export interface IRFQ extends Document {
  rfqNumber: string;
  customerTenantId: Types.ObjectId;
  title: string;
  description?: string;
  items: IRFQItem[];
  status: 'draft' | 'published' | 'closed' | 'cancelled';
  deadline?: Date;
  attachments?: string[];
  metadata?: Record<string, any>;
  createdBy: Types.ObjectId;
  publishedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rfqItemSchema = new Schema<IRFQItem>(
  {
    partNumber: {
      type: String,
      required: [true, 'Part number is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
    requiredBy: {
      type: Date,
    },
    specifications: {
      type: String,
      trim: true,
    },
  },
  { _id: true }
);

const rfqSchema = new Schema<IRFQ>(
  {
    rfqNumber: {
      type: String,
      required: [true, 'RFQ number is required'],
      unique: true,
      trim: true,
    },
    customerTenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Customer tenant ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    items: {
      type: [rfqItemSchema],
      required: [true, 'At least one item is required'],
      validate: {
        validator: (items: IRFQItem[]) => items.length > 0,
        message: 'RFQ must have at least one item',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed', 'cancelled'],
      default: 'draft',
    },
    deadline: {
      type: Date,
    },
    attachments: {
      type: [String],
      default: [],
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
    publishedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
rfqSchema.index({ rfqNumber: 1 });
rfqSchema.index({ customerTenantId: 1 });
rfqSchema.index({ status: 1 });
rfqSchema.index({ customerTenantId: 1, status: 1 });
rfqSchema.index({ createdAt: -1 });

export default mongoose.model<IRFQ>('RFQ', rfqSchema);

