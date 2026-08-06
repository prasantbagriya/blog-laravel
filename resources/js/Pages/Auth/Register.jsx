import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900">
            <Head title="Sign Up" />

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-md shadow-sm p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h1>
                    <p className="text-sm text-slate-500">Join the Nexus community today.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                            required
                            autoFocus
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                            required
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-sm transition-colors disabled:opacity-50"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="text-center mt-4 pt-4 border-t border-slate-100">
                        <Link href={route('login')} className="text-sm font-semibold text-blue-600 hover:underline">
                            Already have an account? Log In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
