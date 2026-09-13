import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Contact Us | Blog" />
            <GlobalNavbar />
            <main className="w-full px-[25px] pb-8 flex-grow" style={{ paddingTop: '100px' }}>
                <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <p className="text-lg text-gray-700 mb-8">Have a question, suggestion, or just want to say hi? We'd love to hear from you. Reach out to our team using the contact details below.</p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Email Us</h3>
                                    <p className="text-gray-600">contact@ourblog.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Call Us</h3>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Location</h3>
                                    <p className="text-gray-600">123 Tech Avenue, Innovation City</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-8 rounded-2xl">
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Name</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="John Doe" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="john@example.com" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg h-32" placeholder="How can we help you?" required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">Send Message</button>
                        </form>
                    </div>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
