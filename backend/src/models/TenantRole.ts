import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITenantRole extends Document {
  name: string;
  displayName: string;
  tenantId: Types.ObjectId;
  permissions: string[];
  description?: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tenantRoleSchema = new Schema<ITenantRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant ID is required'],
    },
    permissions: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Compound index for unique role per tenant
tenantRoleSchema.index({ name: 1, tenantId: 1 }, { unique: true });
tenantRoleSchema.index({ tenantId: 1 });

export default mongoose.model<ITenantRole>('TenantRole', tenantRoleSchema);

