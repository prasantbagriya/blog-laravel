import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#09090b] font-sans px-6 py-12">
            <Head title="Forgot Password | CoachingInSikar" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="inline-flex items-center gap-3 mb-8 group decoration-transparent">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden border border-slate-100 dark:border-zinc-800">
                        <img src="/uploads/logo.webp" alt="Coaching Sikar Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                        Coaching Sikar
                    </span>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                        Forgot password?
                    </h2>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
                        No problem. Enter your email address and we'll send you a password reset link.
                    </p>
                </div>

                {/* Success Status */}
                {status && (
                    <div className="mb-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {status}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border-0 outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800"
                                placeholder="you@example.com"
                                required
                                autoFocus
                            />
                        </div>
                        {errors.email && <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-full text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20"
                    >
                        {processing ? 'Sending...' : 'Send Reset Link'}
                        {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
