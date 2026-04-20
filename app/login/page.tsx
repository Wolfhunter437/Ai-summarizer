'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth';
import { loginAction, type AuthState } from '@/app/auth/actions';
import Link from 'next/link';

const initialState: AuthState = { success: false, message: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  const { register, trigger, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-gray-100 font-sans selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-neutral-950 to-neutral-950 -z-10 blur-3xl" />
      
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-10 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-neutral-400">Log in to enter your dashboard.</p>
        </div>

        {/* Success State */}
        {state.success && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-center">
            {state.message}
            <div className="mt-4">
              <Link href="/" className="text-white bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium transition-colors">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        )}

        {!state.success && (
          <form 
            action={async (formData) => {
              const isValid = await trigger();
              if (isValid) {
                formAction(formData);
              }
            }} 
            className="space-y-5"
          >
            {/* Global Server Error */}
            {state.message && !state.success && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {state.message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="you@example.com"
              />
              {(errors.email?.message || state.errors?.email) && (
                <p className="mt-1 text-sm text-red-400">{errors.email?.message || state.errors?.email?.[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1 flex justify-between">
                Password
                <a href="#" className="text-indigo-400 hover:text-indigo-300 text-xs">Forgot password?</a>
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="••••••••"
              />
              {(errors.password?.message || state.errors?.password) && (
                <p className="mt-1 text-sm text-red-400">{errors.password?.message || state.errors?.password?.[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className={`w-full py-3.5 px-4 mt-4 flex justify-center items-center rounded-xl text-white font-medium transition-all ${
                pending 
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed border border-neutral-700' 
                  : 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 active:scale-[0.98]'
              }`}
            >
              {pending ? 'Logging in...' : 'Log In'}
            </button>

            <p className="text-center text-sm text-neutral-400 mt-6">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Sign up
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
