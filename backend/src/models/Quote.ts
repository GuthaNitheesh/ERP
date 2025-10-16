import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuoteItem {
  rfqItemId: Types.ObjectId;
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  leadTime?: number;
  leadTimeUnit?: 'days' | 'weeks' | 'months';
  notes?: string;
}

export interface IQuote extends Document {
  quoteNumber: string;
  rfqId: Types.ObjectId;
  vendorTenantId: Types.ObjectId;
  customerTenantId: Types.ObjectId;
  items: IQuoteItem[];
  totalAmount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'expired';
  validUntil?: Date;
  terms?: string;
  notes?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
  createdBy: Types.ObjectId;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const quoteItemSchema = new Schema<IQuoteItem>(
  {
    rfqItemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
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
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price must be non-negative'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price must be non-negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      uppercase: true,
    },
    leadTime: {
      type: Number,
      min: [0, 'Lead time must be non-negative'],
    },
    leadTimeUnit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: true }
);

const quoteSchema = new Schema<IQuote>(
  {
    quoteNumber: {
      type: String,
      required: [true, 'Quote number is required'],
      unique: true,
      trim: true,
    },
    rfqId: {
      type: Schema.Types.ObjectId,
      ref: 'RFQ',
      required: [true, 'RFQ ID is required'],
    },
    vendorTenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Vendor tenant ID is required'],
    },
    customerTenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Customer tenant ID is required'],
    },
    items: {
      type: [quoteItemSchema],
      required: [true, 'At least one item is required'],
      validate: {
        validator: (items: IQuoteItem[]) => items.length > 0,
        message: 'Quote must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be non-negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'accepted', 'rejected', 'expired'],
      default: 'draft',
    },
    validUntil: {
      type: Date,
    },
    terms: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
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
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
quoteSchema.index({ quoteNumber: 1 });
quoteSchema.index({ rfqId: 1 });
quoteSchema.index({ vendorTenantId: 1 });
quoteSchema.index({ customerTenantId: 1 });
quoteSchema.index({ status: 1 });
quoteSchema.index({ vendorTenantId: 1, status: 1 });
quoteSchema.index({ createdAt: -1 });

export default mongoose.model<IQuote>('Quote', quoteSchema);

