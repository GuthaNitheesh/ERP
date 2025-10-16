import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().trim().min(1).required(),
  lastName: Joi.string().trim().min(1).required(),
  phone: Joi.string().optional(),
  globalRole: Joi.string().valid('tech', 'admin', 'customer_admin', 'vendor_admin').required(),
  tenantId: Joi.string().optional(),
  tenantRoleId: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const tenantSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  type: Joi.string().valid('admin', 'customer', 'vendor').required(),
  organizationName: Joi.string().trim().min(1).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    postalCode: Joi.string().optional(),
  }).optional(),
  metadata: Joi.object().optional(),
});

export const tenantRoleSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  displayName: Joi.string().trim().min(1).required(),
  tenantId: Joi.string().required(),
  permissions: Joi.array().items(Joi.string()).default([]),
  description: Joi.string().optional(),
});

export const rfqSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().optional(),
  items: Joi.array().items(
    Joi.object({
      partNumber: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
      quantity: Joi.number().min(1).required(),
      unit: Joi.string().trim().required(),
      requiredBy: Joi.date().optional(),
      specifications: Joi.string().optional(),
    })
  ).min(1).required(),
  deadline: Joi.date().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  metadata: Joi.object().optional(),
});

export const quoteSchema = Joi.object({
  rfqId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      rfqItemId: Joi.string().required(),
      partNumber: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
      quantity: Joi.number().min(1).required(),
      unit: Joi.string().trim().required(),
      unitPrice: Joi.number().min(0).required(),
      totalPrice: Joi.number().min(0).required(),
      currency: Joi.string().uppercase().default('USD'),
      leadTime: Joi.number().min(0).optional(),
      leadTimeUnit: Joi.string().valid('days', 'weeks', 'months').optional(),
      notes: Joi.string().optional(),
    })
  ).min(1).required(),
  totalAmount: Joi.number().min(0).required(),
  currency: Joi.string().uppercase().default('USD'),
  validUntil: Joi.date().optional(),
  terms: Joi.string().optional(),
  notes: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  metadata: Joi.object().optional(),
});

