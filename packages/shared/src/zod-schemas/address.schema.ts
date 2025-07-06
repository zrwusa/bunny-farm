import { z } from 'zod';

export const AddressSchema =  z.object({
    recipientName: z.string().min(1, { message: "Recipient name is required" }),
    phone: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    addressLine1: z.string().min(1, { message: "Address line 1 is required" }),
    addressLine2: z.string().optional(),
    suburb: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof AddressSchema>;
