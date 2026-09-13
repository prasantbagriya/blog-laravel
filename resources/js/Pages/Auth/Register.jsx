import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-[#F5F5F2] dark:bg-[#161615] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors selection:bg-[#0052FF]/30">
            <Head title="Sign Up | CoachingInSikar" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 mb-6 group">
                    <div className="w-10 h-10 rounded-xl bg-[#0052FF] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
                        CoachingInSikar
                    </span>
                </Link>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-[#555555] dark:text-[#A0A09C]">
                    Join our community of reviewers and students
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-[#20201F] py-8 px-4 shadow-xl shadow-black/5 dark:shadow-black/20 sm:rounded-2xl sm:px-10 border border-[#E5E5E1] dark:border-[#2A2A28]">
                    
                    <form className="space-y-5" onSubmit={submit}>
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500 stroke-[1.5]" />
                                </div>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#3A3A38] rounded-lg text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all"
                                    placeholder="John Doe"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.name && <p className="mt-1.5 text-sm font-medium text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 stroke-[1.5]" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#3A3A38] rounded-lg text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            {errors.email && <p className="mt-1.5 text-sm font-medium text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 stroke-[1.5]" />
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#3A3A38] rounded-lg text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password && <p className="mt-1.5 text-sm font-medium text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 stroke-[1.5]" />
                                </div>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#3A3A38] rounded-lg text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password_confirmation && <p className="mt-1.5 text-sm font-medium text-red-500">{errors.password_confirmation}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="group w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0052FF] hover:bg-[#0040D0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {processing ? 'Creating account...' : 'Create Account'}
                                {!processing && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-[#555555] dark:text-[#A0A09C]">
                        Already have an account?{' '}
                        <Link href={route('login')} className="font-bold text-[#1A1A1A] dark:text-white hover:text-[#0052FF] dark:hover:text-[#80B0FF] transition-colors">
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
