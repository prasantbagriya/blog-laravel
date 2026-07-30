const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'resources', 'js', 'Pages', 'Static');

const contents = {
    'About.jsx': `
import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function About() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="About Us | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh] flex-grow" style={{ paddingTop: '160px' }}>
                <h1 className="text-4xl font-bold mb-8">About Us</h1>
                <div className="prose max-w-none text-lg text-gray-700 space-y-6">
                    <p>Welcome to our platform, your number one source for all things digital marketing, tech insights, and automation strategies. We're dedicated to providing you the very best content, with an emphasis on actionable advice, industry trends, and technical excellence.</p>
                    <p>Founded by a team of passionate developers and marketers, we understand the challenges businesses face in the rapidly evolving digital landscape. Our mission is to bridge the gap between complex technology and practical business application.</p>
                    <p>Whether you're looking to scale your business with WhatsApp automation, master SEO, or stay ahead of the curve in web development, you'll find expert-verified strategies right here.</p>
                    <p>We hope you enjoy our insights as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
`,
    'Contact.jsx': `
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
            <main className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh] flex-grow" style={{ paddingTop: '160px' }}>
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
`,
    'Privacy.jsx': `
import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function Privacy() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Privacy Policy | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh] flex-grow" style={{ paddingTop: '160px' }}>
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose max-w-none text-gray-700 space-y-6">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
                    <p>Welcome to our Privacy Policy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">2. The Data We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies</h2>
                    <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
`,
    'Terms.jsx': `
import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function Terms() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Terms of Service | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh] flex-grow" style={{ paddingTop: '160px' }}>
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose max-w-none text-gray-700 space-y-6">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Agreement to Terms</h2>
                    <p>By accessing our website, you agree to be bound by these Terms of Service and to use the site in accordance with these Terms of Service, our Privacy Policy and any additional terms and conditions that may apply to specific sections of the site.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">2. Intellectual Property Rights</h2>
                    <p>Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved.</p>
                    <p>You may view, download for caching purposes only, and print pages from the website for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">3. Restrictions</h2>
                    <p>You must not:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Republish material from this website (including republication on another website);</li>
                        <li>Sell, rent or sub-license material from the website;</li>
                        <li>Reproduce, duplicate, copy or otherwise exploit material on our website for a commercial purpose;</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitations of Liability</h2>
                    <p>We will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special or consequential loss; or for any business losses, loss of revenue, income, profits or anticipated savings.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
`,
    'EditorialPolicy.jsx': `
import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function EditorialPolicy() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Editorial Policy | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh] flex-grow" style={{ paddingTop: '160px' }}>
                <h1 className="text-4xl font-bold mb-8">Editorial Policy</h1>
                <div className="prose max-w-none text-gray-700 space-y-6">
                    <p>Our editorial mission is to provide accurate, comprehensive, and unbiased information about technology, marketing, and business strategies.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Core Principles</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Accuracy:</strong> We strive to ensure that all information we publish is accurate and up-to-date. All articles undergo review by our editorial team.</li>
                        <li><strong>Independence:</strong> Our editorial content is not influenced by our advertisers. We maintain a strict separation between advertising and editorial content.</li>
                        <li><strong>Transparency:</strong> We are clear about any potential conflicts of interest. Sponsored content is always clearly labeled.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Content Updates</h2>
                    <p>The digital landscape changes rapidly. We regularly review and update our existing content to ensure it remains accurate and relevant. When significant updates are made, we note the date of the update at the top or bottom of the article.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">AI Usage Policy</h2>
                    <p>While we may use AI tools for research, outlining, or grammar checking, all final content is written, reviewed, and verified by human experts. We do not publish raw, unedited AI-generated articles.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
`,
    'FactCheckingPolicy.jsx': `
import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function FactCheckingPolicy() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Fact-Checking Policy | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh] flex-grow" style={{ paddingTop: '160px' }}>
                <h1 className="text-4xl font-bold mb-8">Fact-Checking Policy</h1>
                <div className="prose max-w-none text-gray-700 space-y-6">
                    <p>We take the accuracy of our content very seriously. Our readers rely on us for correct information, and we are committed to maintaining the highest standards of journalistic integrity.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Our Process</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Primary Sources:</strong> We rely on primary sources whenever possible, including official documentation, direct interviews, academic papers, and verified data sets.</li>
                        <li><strong>Verification:</strong> Claims of fact are cross-referenced against multiple reliable sources before publication.</li>
                        <li><strong>Expert Review:</strong> Highly technical or specialized content is reviewed by subject matter experts prior to publication.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Corrections Policy</h2>
                    <p>Despite our best efforts, errors occasionally occur. When they do, we are committed to correcting them promptly and transparently.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>If you spot an error, please report it to us via our Contact page.</li>
                        <li>Substantive corrections will be noted at the bottom of the article, detailing what was changed and when.</li>
                        <li>Minor typographical errors or formatting issues are corrected without a formal correction notice.</li>
                    </ul>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
`
};

for (const [filename, content] of Object.entries(contents)) {
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, content.trim(), 'utf8');
    console.log('Updated:', filename);
}
