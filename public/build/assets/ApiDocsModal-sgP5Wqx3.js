import{i as e}from"./rolldown-runtime-aKtaBQYM.js";import{o as t}from"./@headlessui-LjYw_IeJ.js";import{D as n}from"./@tiptap-BmSRQcam.js";import{Ot as r,_ as i,mt as a,n as o,w as s}from"./lucide-react-BCYHs8t4.js";var c=e(t(),1),l=n(),u=({onClose:e})=>{let[t,n]=(0,c.useState)(`reviews`),[u,d]=(0,c.useState)(!1),f=()=>t===`reviews`?`// Fetch Verified Reviews for a Business
const response = await fetch('https://trustpulse.ai/api/businesses/aether-cloud/reviews', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const reviews = await response.json();
console.log(reviews);`:t===`ai_sentiment`?`// Run Server-Side Gemini Review Analysis
const response = await fetch('https://trustpulse.ai/api/ai/analyze-review', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Migrated 12 microservices in under 4 hours',
    description: 'We switched our workload and latency dropped from 140ms to 18ms.',
    rating: 5,
    businessName: 'Aether Cloud Engine'
  })
});
const result = await response.json();
// Returns { sentiment, aiFraudScore, fraudRiskLevel, extractedPros, extractedCons }`:`// Verify Trust Score & Badges for an Order Number
const response = await fetch('https://trustpulse.ai/api/businesses/verify-invoice', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    businessSlug: 'aether-cloud',
    orderNumber: 'INV-AETHER-2026-8891'
  })
});
const verification = await response.json();`;return(0,l.jsx)(`div`,{className:`fixed inset-0 z-50 bg-zinc-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto`,children:(0,l.jsxs)(`div`,{className:`w-full max-w-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-2xl p-6 sm:p-8 space-y-6 my-8`,children:[(0,l.jsxs)(`div`,{className:`flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800`,children:[(0,l.jsxs)(`div`,{className:`flex items-center gap-2.5`,children:[(0,l.jsx)(`div`,{className:`w-9 h-9 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center`,children:(0,l.jsx)(i,{className:`w-5 h-5`})}),(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`h2`,{className:`text-base font-bold text-zinc-900 dark:text-white`,children:`TrustPulse REST & AI API Documentation`}),(0,l.jsx)(`p`,{className:`text-xs font-mono text-zinc-500 dark:text-zinc-400`,children:`Integrate verified reviews, fraud scores, and badges into your platform`})]})]}),(0,l.jsx)(`button`,{onClick:e,className:`text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition`,children:(0,l.jsx)(o,{className:`w-5 h-5`})})]}),(0,l.jsxs)(`div`,{className:`flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1 text-xs font-mono font-bold`,children:[(0,l.jsx)(`button`,{onClick:()=>n(`reviews`),className:`px-3.5 py-2 rounded-sm transition ${t===`reviews`?`bg-blue-600 text-white`:`text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800`}`,children:`GET /api/reviews`}),(0,l.jsxs)(`button`,{onClick:()=>n(`ai_sentiment`),className:`px-3.5 py-2 rounded-sm transition flex items-center gap-1.5 ${t===`ai_sentiment`?`bg-blue-600 text-white`:`text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800`}`,children:[(0,l.jsx)(s,{className:`w-3.5 h-3.5`}),`POST /api/ai/analyze-review`]}),(0,l.jsx)(`button`,{onClick:()=>n(`trust_score`),className:`px-3.5 py-2 rounded-sm transition ${t===`trust_score`?`bg-blue-600 text-white`:`text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800`}`,children:`POST /api/verify-invoice`})]}),(0,l.jsxs)(`div`,{className:`space-y-3`,children:[(0,l.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,l.jsx)(`span`,{className:`text-xs font-mono font-bold uppercase tracking-widest text-zinc-400`,children:`cURL / JavaScript SDK Example`}),(0,l.jsxs)(`button`,{onClick:()=>{navigator.clipboard.writeText(f()),d(!0),setTimeout(()=>d(!1),2e3)},className:`px-3 py-1.5 text-xs font-mono font-bold rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 text-zinc-900 dark:text-zinc-100 flex items-center gap-1`,children:[u?(0,l.jsx)(r,{className:`w-3.5 h-3.5 text-blue-600`}):(0,l.jsx)(a,{className:`w-3.5 h-3.5`}),(0,l.jsx)(`span`,{children:u?`Copied`:`Copy Code`})]})]}),(0,l.jsx)(`pre`,{className:`p-4 rounded-sm bg-zinc-900 text-blue-400 text-xs font-mono overflow-x-auto border border-zinc-800 leading-relaxed`,children:f()})]})]})})};export{u as ApiDocsModal};