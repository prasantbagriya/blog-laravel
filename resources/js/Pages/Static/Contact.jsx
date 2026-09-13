import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { Mail, MapPin, Phone, Send, MessageSquare, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { PageHero, InfoCard, AmberPillButton } from '../../NextComponents/UI';
import AnimatedBorderCard from '../../Components/AnimatedBorderCard';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email Us',
            value: 'contact@coachingsikar.com',
            sub: 'We reply within 24 hours',
            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        },
        {
            icon: Phone,
            label: 'Call Us',
            value: '+91 98765 43210',
            sub: 'Mon – Sat, 9am – 6pm IST',
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        },
        {
            icon: MapPin,
            label: 'Location',
            value: 'Sikar, Rajasthan, India',
            sub: 'Education Hub of India',
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        },
        {
            icon: Clock,
            label: 'Working Hours',
            value: '9:00 AM – 6:00 PM',
            sub: 'Monday to Saturday',
            color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
        },
    ];

    return (
        <div className="bg-white dark:bg-[#09090b] min-h-screen flex flex-col font-sans">
            <Head title="Contact Us | Coaching Sikar" />
            <GlobalNavbar />

            {/* Hero Section */}
            <PageHero
                badge="Get In Touch"
                badgeIcon={MessageSquare}
                title={<>We'd love to <span className="text-amber-500">hear from you</span></>}
                description="Have a question about coaching institutes, want to list your institute, or just want to say hello? Reach out — we'll get back to you quickly."
                className="text-center"
            />

            {/* Contact Info Cards */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800/60">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {contactInfo.map((item) => (
                        <AnimatedBorderCard key={item.label} containerClassName="h-full">
                            <InfoCard
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                sub={item.sub}
                                color={item.color}
                            />
                        </AnimatedBorderCard>
                    ))}
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#09090b] flex-grow">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left — Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                                Let's start a <span className="text-amber-500">conversation</span>
                            </h2>
                            <p className="text-slate-500 dark:text-zinc-400 text-base leading-relaxed">
                                Whether you're a student looking for the right coaching, an institute wanting to list your services, or a partner — our team is here to help.
                            </p>
                        </div>

                        {/* Reasons to contact */}
                        <div className="space-y-3">
                            {[
                                'General inquiries about the platform',
                                'Business listing & verification requests',
                                'Report a review or incorrect listing',
                                'Press & media inquiries',
                                'Partnership & collaboration opportunities',
                            ].map((reason) => (
                                <div key={reason} className="flex items-center gap-3 text-sm text-slate-600 dark:text-zinc-400">
                                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                                    {reason}
                                </div>
                            ))}
                        </div>

                        {/* Quick links */}
                        <div className="bg-slate-900 dark:bg-zinc-900 rounded-2xl p-6 border border-slate-800 dark:border-zinc-800">
                            <p className="text-white font-bold mb-1">Browse our FAQ first</p>
                            <p className="text-slate-400 text-sm mb-4">You might find a quick answer to your question there.</p>
                            <AmberPillButton as={Link} href="/#faq">
                                View FAQ <ArrowRight className="w-4 h-4" />
                            </AmberPillButton>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 shadow-sm">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Message Sent!</h3>
                                <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-xs">
                                    Thank you for reaching out. Our team will get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                    className="mt-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">Send us a message</h3>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Your Name</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-transparent hover:border-amber-400 dark:hover:border-amber-500 outline-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
                                                placeholder="Rahul Sharma"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-transparent hover:border-amber-400 dark:hover:border-amber-500 outline-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
                                                placeholder="rahul@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Subject</label>
                                        <input
                                            type="text"
                                            value={form.subject}
                                            onChange={e => setForm({ ...form, subject: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-transparent hover:border-amber-400 dark:hover:border-amber-500 outline-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
                                            placeholder="What's this about?"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Message</label>
                                        <textarea
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-transparent hover:border-amber-400 dark:hover:border-amber-500 outline-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all h-32 resize-none"
                                            placeholder="Tell us how we can help you..."
                                            required
                                        ></textarea>
                                    </div>

                                    <AmberPillButton type="submit" className="w-full mt-4">
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </AmberPillButton>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <BlogFooter />
        </div>
    );
}
