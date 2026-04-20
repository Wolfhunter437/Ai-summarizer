'use server';

import { loginSchema, signUpSchema } from '@/lib/schemas/auth';
import { z } from 'zod';

export type AuthState = {
  success: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
};

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const data = Object.fromEntries(formData.entries());

  // Wait 1s to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Invalid credentials',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // MOCK SUCCESS
  console.log('User logged in (MOCKED):', parsed.data.email);
  return {
    success: true,
    message: 'Login successful! Welcome back.',
  };
}

export async function signUpAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const data = Object.fromEntries(formData.entries());

  // Wait 1s to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  const parsed = signUpSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Failed to create account. Please check your inputs.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // MOCK SUCCESS
  console.log('User registered (MOCKED):', parsed.data.email);
  return {
    success: true,
    message: 'Account created successfully! You can now log in.',
  };
}
