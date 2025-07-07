// import { z } from 'zod';
//
// const envSchema = z.object({
//   VITE_CLERK_PUBLISHABLE_KEY: z
//     .string()
//     .min(1, 'Clerk publishable key is required'),
//   VITE_API_URL: z.string().url(),
//   // VITE_FEATURE_FLAG: z
//   //   .enum(['true', 'false'])
//   //   .transform((val) => val === 'true'),
// });
//
// const _env = envSchema.safeParse(import.meta.env);
//
// if (!_env.success) {
//   console.error(
//     '❌ Invalid environment variables:',
//     _env.error.flatten().fieldErrors,
//   );
//   throw new Error('Invalid environment variables');
// }
//
// export const env = _env.data;

// TODO: Validation is removed because these variables are set at runtime for docker and kubernetes.

export const env = {
  VITE_CLERK_PUBLISHABLE_KEY: '__VITE_CLERK_PUBLISHABLE_KEY__',
  VITE_API_URL: '__VITE_API_URL__',
};

// TODO Remove comment
// export const API_BASE_URL =
//   env.VITE_API_URL && env.VITE_API_URL !== '__VITE_API_URL__'
//     ? env.VITE_API_URL
//     : 'http://localhost:8087';
