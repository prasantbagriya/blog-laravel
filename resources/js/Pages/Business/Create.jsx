import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Building, MapPin, Globe, Phone, Mail, FileText, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck, Clock, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import TipTapEditor from '../../Components/TipTapEditor';

export default function Create({ auth }) {
    const { user } = auth;
    
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category_name: '',
        description: '',
        detailed_description: '',
        website: '',
        phone: '',
        email: '',
        address: '',
        city: 'Sikar',
        opening_hours: '',
        claimed_by_owner: true,
        faqs: [],
        services: [],
        tags: [],
        social_links: {
            youtube: '',
            instagram: '',
            facebook: '',
            telegram: '',
            twitter: '',
            linkedin: ''
        },
        logo: null,
        logo_url: '',
        cover_image: null,
        cover_image_url: ''
    });
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [createdUrl, setCreatedUrl] = useState('/dashboard');
    const [errors, setErrors] = useState({});

    // AI Deep Research & Website Scraper States
    const [aiPromptName, setAiPromptName] = useState('');
    const [aiCity, setAiCity] = useState('Sikar');
    const [aiWebsite, setAiWebsite] = useState('');
    const [isAiResearching, setIsAiResearching] = useState(false);
    const [isScrapingWebsite, setIsScrapingWebsite] = useState(false);
    const [scrapeMessage, setScrapeMessage] = useState(null);
    const [aiStepMessage, setAiStepMessage] = useState('');
    const [aiSuccessMessage, setAiSuccessMessage] = useState(null);
    const [aiError, setAiError] = useState(null);
    const [verifiedSources, setVerifiedSources] = useState([]);

    useEffect(() => {
        // Fetch categories for the dropdown
        axios.get('/api/businesses')
            .then(res => {
                // We actually want the categories. 
                // There is a /api/businesses route, but maybe we can fetch categories from an endpoint?
                // Wait, let's fetch from the business controller getCategories if it's available.
                // Wait, the api/businesses endpoint without params returns all businesses. 
                // In Api/BusinessController we have getCategories but no specific route defined for it?
                // Let's check if there's a route for categories. 
            })
            .catch(err => console.error(err));
            
        // Hardcoding categories as seen in BusinessController to ensure it works immediately
        setCategories([
            'SaaS & Cloud Platforms',
            'AI Tools & Models',
            'E-commerce & Retail',
            'Hospitals & Healthcare',
            'Web Hosting & Servers',
            'Coaching & Institutes',
            'Hotels & Hospitality',
            'Fintech & Banking',
            'Education'
        ]);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFaqChange = (index, field, value) => {
        const updatedFaqs = [...formData.faqs];
        updatedFaqs[index][field] = value;
        setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const addFaq = () => {
        setFormData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: '', answer: '' }]
        }));
    };

    const removeFaq = (index) => {
        const updatedFaqs = formData.faqs.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const handleServiceChange = (index, field, value) => {
        const updatedServices = [...formData.services];
        updatedServices[index][field] = value;
        setFormData(prev => ({ ...prev, services: updatedServices }));
    };

    const addService = () => {
        setFormData(prev => ({
            ...prev,
            services: [...prev.services, { id: 'prod-'+Date.now(), name: '', description: '', price: '' }]
        }));
    };

    const removeService = (index) => {
        const updatedServices = formData.services.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, services: updatedServices }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSocialChange = (network, value) => {
        setFormData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [network]: value
            }
        }));
    };

    const handleScrapeWebsite = async (explicitUrl) => {
        const targetUrl = (typeof explicitUrl === 'string' && explicitUrl ? explicitUrl : (formData.website || aiWebsite || '')).trim();
        if (!targetUrl) {
            setScrapeMessage('Pehle business ya institute ki official website URL enter karein.');
            return;
        }

        setIsScrapingWebsite(true);
        setScrapeMessage(null);
        try {
            const res = await axios.post('/api/ai/scrape-website', { url: targetUrl });
            if (res.data && res.data.success && res.data.data) {
                const d = res.data.data;
                const scrapedSocial = d.social_links || {};
                setFormData(prev => ({
                    ...prev,
                    website: d.website || targetUrl,
                    phone: d.phone || '',
                    email: d.email || '',
                    address: d.address || '',
                    logo_url: d.logo_url || prev.logo_url || '',
                    cover_image_url: d.cover_image_url || prev.cover_image_url || '',
                    social_links: {
                        youtube: scrapedSocial.youtube || '',
                        instagram: scrapedSocial.instagram || '',
                        facebook: scrapedSocial.facebook || '',
                        telegram: scrapedSocial.telegram || '',
                        twitter: scrapedSocial.twitter || '',
                        linkedin: scrapedSocial.linkedin || '',
                    }
                }));
                if (d.website && !aiWebsite) {
                    setAiWebsite(d.website);
                }
                const found = Object.keys(scrapedSocial).filter(k => Boolean(scrapedSocial[k]));
                const mediaFound = [];
                if (d.logo_url) mediaFound.push('Logo');
                if (d.cover_image_url) mediaFound.push('Cover Image');
                setScrapeMessage(found.length > 0 || mediaFound.length > 0
                    ? `Official website scanned! Found ${found.length} handles (${found.join(', ')})${mediaFound.length > 0 ? ` aur ${mediaFound.join(' + ')} auto-detected` : ''}.`
                    : `Website reachable! No public social media handles were detected on this page.`
                );
            }
        } catch (err) {
            console.error('Website scrape error:', err);
            const msg = err.response?.data?.message || 'Could not fetch from website. Please ensure URL is valid.';
            setScrapeMessage(msg);
        } finally {
            setIsScrapingWebsite(false);
        }
    };

    const handleAiResearch = async (overrideName) => {
        const queryName = (typeof overrideName === 'string' ? overrideName : (aiPromptName || formData.name)).trim();
        if (!queryName) {
            setAiError('Please enter an institute or business name to research.');
            return;
        }

        setIsAiResearching(true);
        setAiError(null);
        setAiSuccessMessage(null);
        setAiStepMessage(`Deep researching "${queryName}" across official portals & educational directories...`);

        const timer1 = setTimeout(() => {
            setAiStepMessage(`Verifying official website, contact helpline & campus address in ${aiCity}...`);
        }, 2200);

        const timer2 = setTimeout(() => {
            setAiStepMessage(`Compiling courses, realistic fees, official YouTube/social handles & FAQs...`);
        }, 5000);

        const timer3 = setTimeout(() => {
            setAiStepMessage(`Structuring short overview and comprehensive rich HTML about sections...`);
        }, 8500);

        // Only pass website if explicitly entered or if relevant to the new queryName
        let targetWebsite = (aiWebsite || '').trim();
        if (!targetWebsite && formData.website) {
            const host = formData.website.toLowerCase();
            const brandTokens = queryName.toLowerCase().split(/\s+/).filter(t => t.length >= 3);
            if (brandTokens.some(t => host.includes(t))) {
                targetWebsite = formData.website.trim();
            }
        }

        try {
            const response = await axios.post('/api/ai/research-business', {
                name: queryName,
                city: aiCity.trim() || 'Sikar',
                category: formData.category_name || 'Coaching & Institutes',
                website: targetWebsite
            });

            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);

            if (response.data && response.data.success && response.data.data) {
                const d = response.data.data;
                const finalName = queryName || d.name;
                if (d.website) {
                    setAiWebsite(d.website);
                } else {
                    setAiWebsite('');
                }
                setFormData(prev => ({
                    ...prev,
                    name: finalName,
                    slug: d.slug || prev.slug,
                    category_name: d.category_name || prev.category_name || 'Coaching & Institutes',
                    description: d.description || '',
                    detailed_description: d.detailed_description || '',
                    website: d.website || '',
                    phone: d.phone || '',
                    email: d.email || '',
                    logo_url: d.logo_url || '',
                    cover_image_url: d.cover_image_url || '',
                    address: d.address || '',
                    city: d.city || prev.city || 'Sikar',
                    opening_hours: d.opening_hours || '',
                    services: Array.isArray(d.services) && d.services.length > 0 ? d.services : [],
                    faqs: Array.isArray(d.faqs) && d.faqs.length > 0 ? d.faqs : [],
                    tags: Array.isArray(d.tags) ? d.tags : [],
                    social_links: {
                        youtube: d.social_links?.youtube || '',
                        instagram: d.social_links?.instagram || '',
                        facebook: d.social_links?.facebook || '',
                        telegram: d.social_links?.telegram || '',
                        twitter: d.social_links?.twitter || '',
                        linkedin: d.social_links?.linkedin || ''
                    }
                }));

                if (Array.isArray(d.verified_sources) && d.verified_sources.length > 0) {
                    setVerifiedSources(d.verified_sources);
                }

                setAiPromptName(finalName);
                setAiSuccessMessage(`Deep research complete for "${finalName}"! Short overview (40-70 words), long comprehensive guide, verified official handles, courses, and FAQs have all been auto-populated.`);
            } else {
                setAiError('Could not complete AI research. Please fill manually or try again.');
            }
        } catch (err) {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            console.error('AI Research Error:', err);
            let errMsg = err.response?.data?.message;
            if (err.response?.status === 419) {
                errMsg = 'Session expired. Please refresh the page and try again.';
            } else if (err.response?.status === 401) {
                errMsg = 'Please log in to use AI research.';
            } else if (err.response?.status === 429) {
                errMsg = 'Too many requests. Please wait a minute and try again.';
            } else if (!errMsg) {
                errMsg = 'AI research request timed out or network disconnected. Please check your connection and try again.';
            }
            setAiError(errMsg);
        } finally {
            setIsAiResearching(false);
            setAiStepMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'faqs') {
                    const cleanedFaqs = formData.faqs.filter(f => f.question && f.question.trim() !== '');
                    submitData.append(key, window.btoa(encodeURIComponent(JSON.stringify(cleanedFaqs))));
                } else if (key === 'services') {
                    const cleanedServices = formData.services.filter(s => s.name && s.name.trim() !== '');
                    submitData.append(key, window.btoa(encodeURIComponent(JSON.stringify(cleanedServices))));
                } else if (key === 'detailed_description') {
                    if (formData[key]) {
                        submitData.append(key, window.btoa(encodeURIComponent(formData[key])));
                    }
                } else if (key === 'tags') {
                    if (formData[key] && Array.isArray(formData[key])) {
                        submitData.append(key, JSON.stringify(formData[key]));
                    }
                } else if (key === 'social_links') {
                    if (formData[key] && typeof formData[key] === 'object') {
                        submitData.append(key, JSON.stringify(formData[key]));
                    }
                } else if (key === 'logo' || key === 'cover_image') {
                    if (formData[key]) submitData.append(key, formData[key]);
                } else {
                    submitData.append(key, formData[key]);
                }
            });
            submitData.append('user_id', user.id);
            submitData.append('_encoded_payloads', 'true');

            const response = await axios.post('/api/businesses', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.status === 201 || response.status === 200) {
                const createdData = response.data;
                const targetSlug = createdData?.slug || formData.slug;
                const targetCat = createdData?.category || formData.category || 'coaching-institutes';
                const profilePath = targetSlug ? `/business/${targetCat}/${targetSlug}` : '/dashboard';
                setCreatedUrl(profilePath);
                setSuccess(true);
                // Optionally redirect to profile after a delay
                setTimeout(() => {
                    window.location.href = profilePath;
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Add Business Listing | CoachingsInSikar" />
            
            <div className="w-full max-w-screen-2xl px-4 mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-4">
                        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Add Your Business Listing</h1>
                    <p className="mt-2 text-slate-600 dark:text-zinc-400">Provide details about your business to list it on our platform and reach more customers.</p>
                </div>

                {success ? (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center shadow-sm">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-2">Listing Created Successfully!</h2>
                        <p className="text-emerald-700 dark:text-emerald-400 mb-6">Your business has been added and is now visible on the platform.</p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link href={createdUrl} className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-colors">
                                View Profile
                            </Link>
                            <Link href="/dashboard" className="inline-block px-6 py-3 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold rounded-full transition-colors">
                                Return to Dashboard
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#09090b] shadow-xl rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative">
                        
                        {errors.general && (
                            <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 m-6">
                                <p className="text-sm text-rose-700 dark:text-rose-400">{errors.general}</p>
                            </div>
                        )}

                        <div className="p-8 sm:p-10 space-y-10 relative z-10">
                            {/* AI Deep Research Engine Card */}
                            <div className="bg-gradient-to-br from-amber-500/10 via-slate-50 to-amber-500/5 dark:from-amber-500/10 dark:via-zinc-900 dark:to-zinc-900 border-2 border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <span className="p-2 rounded-md bg-amber-500 text-black shadow-md shadow-amber-500/20">
                                            <Sparkles size={18} className="animate-pulse" />
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                AI Deep Research & Auto-Fill All Form Inputs
                                                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                                    Gemini AI
                                                </span>
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                                                Kisi bhi institute ya business ka name enter karein. AI online deep research karke sabhi form inputs (courses, fees, address, FAQs, description) auto-fill karega.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-7">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                                            Institute / Business Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Building className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={aiPromptName}
                                                onChange={(e) => {
                                                    setAiPromptName(e.target.value);
                                                    setFormData(prev => ({ ...prev, name: e.target.value }));
                                                }}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiResearch(); } }}
                                                placeholder="e.g. Matrix Academy Sikar, PCP Sikar, Allen Sikar..."
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-5">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                                            City / Region
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={aiCity}
                                                onChange={(e) => setAiCity(e.target.value)}
                                                placeholder="e.g. Sikar, Kota, Jaipur"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-8">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
                                            <span>Official Website URL</span>
                                            <span className="text-[11px] font-normal text-slate-500 dark:text-zinc-400">
                                                (Optional – Live scrape of verified YouTube, Instagram, Facebook, Phone & Email)
                                            </span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="url"
                                                value={aiWebsite}
                                                onChange={(e) => {
                                                    setAiWebsite(e.target.value);
                                                    setFormData(prev => ({ ...prev, website: e.target.value }));
                                                }}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiResearch(); } }}
                                                placeholder="e.g. https://www.matrixedu.in or https://gurukripa.ac.in"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-4 flex items-end">
                                        <button
                                            type="button"
                                            onClick={() => handleAiResearch()}
                                            disabled={isAiResearching || (!aiPromptName.trim() && !formData.name.trim())}
                                            className="w-full h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-sm rounded-full shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98]"
                                        >
                                            {isAiResearching ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    <span>Researching & Scraping...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={16} />
                                                    <span>Deep Research & Fill</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Live Step Progress */}
                                {isAiResearching && (
                                    <div className="mt-4 pt-3.5 border-t border-amber-500/20">
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-700 dark:text-amber-400 animate-pulse">
                                            <Loader2 size={15} className="animate-spin shrink-0 text-amber-500" />
                                            <span>{aiStepMessage}</span>
                                        </div>
                                        <div className="w-full bg-amber-200/50 dark:bg-amber-950/50 h-1.5 rounded-full overflow-hidden mt-2.5">
                                            <div className="bg-amber-500 h-full w-3/4 rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                )}

                                {/* Success Notice */}
                                {aiSuccessMessage && !isAiResearching && (
                                    <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-md flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                                        <CheckCircle size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                                        <div className="flex-1">
                                            <p className="font-bold">{aiSuccessMessage}</p>
                                            {verifiedSources.length > 0 && (
                                                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                                                    <span className="font-semibold text-[11px] text-emerald-900 dark:text-emerald-200">Verified From Official Sources:</span>
                                                    {verifiedSources.map((source, i) => (
                                                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                                                            ✓ {source}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="mt-1 opacity-90">Short overview (crisp), long detailed guide (rich HTML), verified phone/website, and official social handles auto-fill ho chuke hain.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Error Notice */}
                                {aiError && !isAiResearching && (
                                    <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-md flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
                                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                                        <div className="flex-1">
                                            <p className="font-bold">{aiError}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Basic Info Section */}
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center">
                                    <Building size={22} className="mr-3 text-amber-500" /> Basic Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">Business/Institute Name *</label>
                                            <button
                                                type="button"
                                                onClick={() => handleAiResearch(formData.name || aiPromptName)}
                                                disabled={isAiResearching || (!formData.name?.trim() && !aiPromptName?.trim())}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-xs font-extrabold text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all disabled:opacity-50"
                                            >
                                                <Sparkles size={13} className="text-amber-500" />
                                                <span>{isAiResearching ? 'Researching...' : '✨ Deep Research & Auto-Fill Rest of Fields'}</span>
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Building className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setAiPromptName(e.target.value);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAiResearch(formData.name);
                                                    }
                                                }}
                                                required
                                                placeholder="e.g. Matrix Academy Sikar, PCP Sikar, Allen Sikar..."
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                        {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.name[0]}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Business Username (Custom URL)</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-slate-400 group-focus-within:text-amber-500 transition-colors font-medium">@</span>
                                            </div>
                                            <input
                                                type="text"
                                                name="slug"
                                                value={formData.slug}
                                                onChange={handleChange}
                                                placeholder="e.g. acme-corp"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 ml-2">This will be your unique business URL: coachingsinsikar.com/business/{formData.category || 'coaching-institutes'}/<strong>{formData.slug ? formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-') : 'your-username'}</strong></p>
                                        {errors.slug && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.slug[0]}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Category *</label>
                                        <div className="relative group">
                                            <select
                                                name="category_name"
                                                value={formData.category_name}
                                                onChange={handleChange}
                                                required
                                                className="block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500 appearance-none"
                                            >
                                                <option value="" disabled>Select a category</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        {errors.category_name && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.category_name[0]}</p>}
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">
                                                Short Description (Card Overview / Tagline) *
                                            </label>
                                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                                                {formData.description ? formData.description.trim().split(/\s+/).filter(Boolean).length : 0} words (Target: 40–70 words)
                                            </span>
                                        </div>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            placeholder="Short & crisp overview (40-70 words): Key competitive exams, results, and faculty specialization..."
                                            className="block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500 resize-y"
                                        ></textarea>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 ml-2">Short summary: Ye listing cards aur search results me 2 lines me dikhega. Yahan short & concise data aata hai.</p>
                                        {errors.description && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.description[0]}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">
                                                Long Detailed Description (Comprehensive About Us / Full Guide)
                                            </label>
                                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                {formData.detailed_description ? `${formData.detailed_description.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length} Words (Full Rich Guide)` : 'Full Rich HTML'}
                                            </span>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-zinc-800/80 rounded-2xl overflow-hidden border border-transparent hover:border-amber-500 transition-all">
                                            <TipTapEditor
                                                value={formData.detailed_description}
                                                onChange={(content) => setFormData(prev => ({ ...prev, detailed_description: content }))}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 ml-2">Profile ke 'About Us' tab me ye pura deep guide aayega jisme Faculty, Hostels, Pedagogy, DPPs aur Test Series shamil hain.</p>
                                        {errors.detailed_description && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.detailed_description[0]}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Location Section */}
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center">
                                    <MapPin size={22} className="mr-3 text-amber-500" /> Contact & Location
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">Website *</label>
                                            {formData.website && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleScrapeWebsite(formData.website)}
                                                    disabled={isScrapingWebsite}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline disabled:opacity-50"
                                                >
                                                    {isScrapingWebsite ? (
                                                        <><Loader2 className="w-3 h-3 animate-spin" /> Fetching...</>
                                                    ) : (
                                                        <>⚡ Fetch Social Handles</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                required
                                                placeholder="https://example.com"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                        {errors.website && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.website[0]}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Phone Number</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 9876543210"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="contact@business.com"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Full Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="123 Business Street, City, State, ZIP"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Opening Hours</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Clock className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="opening_hours"
                                                value={formData.opening_hours}
                                                onChange={handleChange}
                                                placeholder="e.g., Mon-Fri: 9 AM - 6 PM"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Official Handles & Verified Social Links Section */}
                            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                                <Globe size={18} />
                                            </div>
                                            Official Handles & Social Links (Verified)
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                                            Institute ke verified official links (YouTube, Instagram, Facebook, Telegram, Twitter, LinkedIn).
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleScrapeWebsite(formData.website)}
                                            disabled={isScrapingWebsite || !formData.website}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                                            title={formData.website ? "Website se official social handles fetch karein" : "Pehle Website URL daalein"}
                                        >
                                            {isScrapingWebsite ? (
                                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Scraping Website...</>
                                            ) : (
                                                <>⚡ Auto-Fetch from Website</>
                                            )}
                                        </button>
                                        {verifiedSources.length > 0 && (
                                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800">
                                                ✓ Verified Handles
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {scrapeMessage && (
                                    <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                                        <span>{scrapeMessage}</span>
                                        <button type="button" onClick={() => setScrapeMessage('')} className="text-amber-600 hover:text-amber-800 font-bold ml-2">✕</button>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                                            <span className="text-red-500 font-bold">▶</span> Official YouTube Channel
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-red-500 font-extrabold text-sm">▶</span>
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.social_links?.youtube || ''}
                                                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                                                placeholder="https://www.youtube.com/@InstituteHandle"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                                            <span className="text-pink-500 font-bold">📷</span> Official Instagram Profile
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-pink-500 font-extrabold text-sm">📷</span>
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.social_links?.instagram || ''}
                                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                                placeholder="https://www.instagram.com/institute_handle"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                                            <span className="text-blue-600 font-bold">f</span> Official Facebook Page
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-blue-600 font-extrabold text-sm">f</span>
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.social_links?.facebook || ''}
                                                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                                placeholder="https://www.facebook.com/institute_handle"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                                            <span className="text-sky-500 font-bold">✈</span> Official Telegram Channel
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-sky-500 font-extrabold text-sm">✈</span>
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.social_links?.telegram || ''}
                                                onChange={(e) => handleSocialChange('telegram', e.target.value)}
                                                placeholder="https://t.me/institute_channel"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                                            <span className="text-slate-800 dark:text-zinc-200 font-bold">𝕏</span> Official X (Twitter) Profile
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-slate-800 dark:text-zinc-200 font-extrabold text-sm">𝕏</span>
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.social_links?.twitter || ''}
                                                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                                placeholder="https://twitter.com/institute_handle"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                                            <span className="text-blue-700 font-bold">in</span> Official LinkedIn Profile
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-blue-700 font-extrabold text-sm">in</span>
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.social_links?.linkedin || ''}
                                                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                                placeholder="https://www.linkedin.com/company/institute_handle"
                                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Media Uploads Section */}
                            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                    </div>
                                    Media & Branding (Logo & Background Cover)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">Business Logo (Optional)</label>
                                            {formData.logo_url && !formData.logo && (
                                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                                                    ⚡ Auto-fetched from website
                                                </span>
                                            )}
                                        </div>

                                        {(formData.logo || formData.logo_url) && (
                                            <div className="mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center gap-3">
                                                <img
                                                    src={formData.logo ? URL.createObjectURL(formData.logo) : formData.logo_url}
                                                    alt="Logo preview"
                                                    className="w-14 h-14 rounded-xl object-contain bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-1 shadow-sm"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                                                        {formData.logo ? formData.logo.name : 'Official Website Logo'}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                        {formData.logo ? 'Custom file selected' : 'Auto-detected & will be saved locally'}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, logo: null, logo_url: '' }))}
                                                    className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                                    title="Remove logo"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            name="logo"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-slate-500 dark:text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/20 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40 cursor-pointer border border-slate-200 dark:border-zinc-700 rounded-3xl p-2 bg-slate-50 dark:bg-zinc-800/50"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1 ml-2">PNG, JPG, WebP ya SVG. Auto-fetched logo ko replace karne ke liye file upload karein.</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300">Cover / Background Banner (Optional)</label>
                                            {formData.cover_image_url && !formData.cover_image && (
                                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                                                    ⚡ Auto-fetched from website
                                                </span>
                                            )}
                                        </div>

                                        {(formData.cover_image || formData.cover_image_url) && (
                                            <div className="mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center gap-3">
                                                <img
                                                    src={formData.cover_image ? URL.createObjectURL(formData.cover_image) : formData.cover_image_url}
                                                    alt="Cover preview"
                                                    className="w-24 h-14 rounded-xl object-cover bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-sm"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                                                        {formData.cover_image ? formData.cover_image.name : 'Official Website Banner'}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                        {formData.cover_image ? 'Custom file selected' : 'Auto-detected & will be saved locally'}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, cover_image: null, cover_image_url: '' }))}
                                                    className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                                    title="Remove cover"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            name="cover_image"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-slate-500 dark:text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/20 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40 cursor-pointer border border-slate-200 dark:border-zinc-700 rounded-3xl p-2 bg-slate-50 dark:bg-zinc-800/50"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1 ml-2">Recommended: 1200x630 banner. Auto-fetched cover ko replace karne ke liye file upload karein.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Services / Products Section */}
                            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                                        </div>
                                        Services & Products
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addService}
                                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all active:scale-[0.98]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                                        Add Service
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.services.map((service, index) => (
                                        <div key={index} className="p-5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 space-y-4 relative shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => removeService(index)}
                                                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-500 transition-all"
                                                title="Remove service"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Service Name</label>
                                                    <input
                                                        type="text"
                                                        value={service.name}
                                                        onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                                        placeholder="e.g. Graphic Design"
                                                        className="block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Price (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={service.price}
                                                        onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                                        placeholder="e.g. ₹500 / hr"
                                                        className="block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Description</label>
                                                <textarea
                                                    value={service.description}
                                                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                                    placeholder="Brief description of the service..."
                                                    rows="2"
                                                    className="block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500 resize-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {formData.services.length === 0 && (
                                        <p className="text-sm text-slate-500 dark:text-zinc-400 italic">No services added yet. Click "+ Add Service" to showcase what you offer.</p>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                        </div>
                                        Frequently Asked Questions
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addFaq}
                                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all active:scale-[0.98]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                                        Add FAQ
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.faqs.map((faq, index) => (
                                        <div key={index} className="p-5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 space-y-4 relative shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => removeFaq(index)}
                                                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-500 transition-all"
                                                title="Remove FAQ"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="pr-8">
                                                <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Question</label>
                                                <input
                                                    type="text"
                                                    value={faq.question}
                                                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                                    placeholder="e.g. Do you offer home delivery?"
                                                    className="block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Answer</label>
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                                    placeholder="e.g. Yes, we offer free home delivery on orders above ₹500."
                                                    rows="2"
                                                    className="block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500 resize-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {formData.faqs.length === 0 && (
                                        <p className="text-sm text-slate-500 dark:text-zinc-400 italic">No FAQs added yet. Click "+ Add FAQ" to provide helpful answers to your customers.</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Ownership Section */}
                            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="claimed_by_owner"
                                            checked={formData.claimed_by_owner}
                                            onChange={handleChange}
                                            className="peer sr-only"
                                        />
                                        <div className="w-6 h-6 border-2 border-slate-300 dark:border-zinc-700 rounded-md bg-slate-100 dark:bg-zinc-800/80 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors flex items-center justify-center">
                                            <svg className="w-4 h-4 text-black opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors flex items-center">
                                            I am the owner or authorized representative <ShieldCheck size={16} className="ml-1.5 text-emerald-500" />
                                        </span>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">By checking this, you claim ownership of this business listing and agree to our terms of service.</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex justify-end items-center">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3.5 mr-3 rounded-md text-sm font-bold text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-md transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 overflow-hidden active:scale-[0.98]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Create Listing'
                                    )}
                                </span>
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-black/5 to-transparent z-0 pointer-events-none"></div>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
