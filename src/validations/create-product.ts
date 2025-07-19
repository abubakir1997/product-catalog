import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU must be less than 50 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  brand: z.string().max(50, 'Brand must be less than 50 characters').optional(),
  image: z
    .string()
    .optional()
    .refine((val) => val === '' || z.string().url().safeParse(val).success, {
      message: 'Please enter a valid URL or leave empty',
    }),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>
