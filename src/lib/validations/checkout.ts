import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  line1: z.string().min(4, "Address is too short").max(120),
  line2: z.string().max(120).optional().or(z.literal("")),
  city: z.string().min(2, "Enter your city").max(60),
  state: z.string().min(2, "Enter your state").max(60),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  country: z.string().min(1).catch("India"),
  type: z.enum(["HOME", "WORK", "OTHER"]).catch("HOME"),
});

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().min(1).max(20),
});

export const createOrderSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Your bag is empty"),
  address: addressSchema,
  couponCode: z.string().optional().nullable(),
  giftWrap: z.boolean().default(false),
  orderNotes: z.string().max(500).optional().or(z.literal("")),
  deliverySlot: z.string().optional().nullable(),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
