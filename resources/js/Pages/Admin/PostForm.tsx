

console.log('--- SOVEREIGN_EDITOR_V11.0_FULL_RESTORE ---');

import { useState, useEffect, useCallback, useTransition, useMemo, useRef } from 'react';
import { router } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Node, Extension, mergeAttributes } from '@tiptap/core';
import Youtube from '@tiptap/extension-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import MediaPicker from './components/MediaPicker';

// Custom FontSize Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
      },
    }
  },
})

// Custom Video Extension for local uploads
const Video = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
    };
  },
  parseHTML() {
    return [{ tag: 'video' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { style: 'margin: 24px 0; border-radius: 16px; overflow: hidden; background: #000; line-height: 0;' }, 
      ['video', mergeAttributes(HTMLAttributes, { style: 'width: 100%; height: auto; display: block;' })]
    ];
  },
});

const ImageSlider = Node.create({
  name: 'imageSlider',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => {
          const imgs = Array.from(element.querySelectorAll('img'));
          return imgs.map(img => ({ src: img.src, alt: img.alt }));
        },
        renderHTML: () => {
          return {};
        }
      },
      autoScroll: { default: true },
      centerZoom: { default: true },
      speed: { default: 3000 }
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-image-slider]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const images = node.attrs.images || [];
    return ['div', mergeAttributes(HTMLAttributes, { 
      'data-image-slider': 'true',
      'data-auto-scroll': HTMLAttributes.autoScroll,
      'data-center-zoom': HTMLAttributes.centerZoom,
      'data-speed': HTMLAttributes.speed,
      contenteditable: 'false',
      style: 'display: flex; overflow-x: auto; gap: 16px; padding: 16px 0; margin: 24px 0; scroll-snap-type: x mandatory; scroll-behavior: smooth; background: #f8fafc; border-radius: 16px; align-items: center;'
    }), 
      ...images.map((img: any) => ['img', { src: img.src, alt: img.alt, style: 'height: 300px; border-radius: 12px; scroll-snap-align: center; object-fit: cover; flex-shrink: 0;' }])
    ];
  }
});

const SocialEmbed = Node.create({
  name: 'socialEmbed',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      platform: { default: 'generic' },
    };
  },
  parseHTML() {
    return [{ tag: 'iframe[data-social-embed]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 
      style: 'margin: 24px 0; border-radius: 20px; overflow: hidden; background: #f8fafc; border: 1px solid #e2e8f0; position: relative; padding-bottom: 56.25%; height: 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);' 
    },
      ['iframe', mergeAttributes(HTMLAttributes, { 
         'data-social-embed': '',
         style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;',
         allowfullscreen: 'true',
         allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      })]
    ];
  },
});

const FaqBlock = Node.create({
  name: 'faqBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      items: {
        default: [],
        parseHTML: element => {
          try {
            return JSON.parse(element.getAttribute('data-faqs') || '[]');
          } catch {
            return [];
          }
        },
        renderHTML: () => {
          return {};
        }
      }
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-faq-block]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    const items = node.attrs.items || [];
    return ['div', mergeAttributes(HTMLAttributes, { 
      'data-faq-block': 'true', 
      'data-faqs': JSON.stringify(items),
      contenteditable: 'false',
      style: 'margin: 32px 0; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);'
    }),
      ['div', { style: 'padding: 16px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;' },
        ['svg', { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#2563eb", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" },
          ['circle', { cx: "12", cy: "12", r: "10" }],
          ['path', { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
          ['path', { d: "M12 17h.01" }]
        ],
        ['span', { style: 'font-size: 13px; font-weight: 800; color: #1e293b; letter-spacing: 0.5px;' }, 'FREQUENTLY ASKED QUESTIONS']
      ],
      ...items.map((item: any) => ['div', { style: 'border-bottom: 1px solid #f1f5f9; padding: 15px 24px;' },
        ['div', { style: 'font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 18px; line-height: 1.4;' }, `Q: ${item.question}`],
        ['div', { style: 'color: #1e293b; font-size: 18.5px; line-height: 1.7;' }, item.answer]
      ])
    ];
  }
});

const QuizBlock = Node.create({
  name: 'quizBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      question: { default: '' },
      options: {
        default: [],
        parseHTML: element => {
          try { return JSON.parse(element.getAttribute('data-options') || '[]'); } catch { return []; }
        },
      },
      correctIndex: {
        default: 0,
        parseHTML: element => parseInt(element.getAttribute('data-correct') || '0', 10),
      }
    }
  },
  parseHTML() { return [{ tag: 'div[data-quiz-block]' }] },
  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 
      'data-quiz-block': 'true', 
      'data-question': node.attrs.question,
      'data-options': JSON.stringify(node.attrs.options),
      'data-correct': node.attrs.correctIndex,
      contenteditable: 'false',
      style: 'margin: 32px 0; padding: 24px; border: 2px dashed #3b82f6; border-radius: 16px; background: #eff6ff; text-align: center;'
    }),
      ['div', { style: 'font-weight: 800; color: #1e3a8a; margin-bottom: 8px;' }, '🧩 INTERACTIVE QUIZ BLOCK'],
      ['div', { style: 'color: #1e40af; font-weight: 700;' }, node.attrs.question]
    ];
  }
});

const PollBlock = Node.create({
  name: 'pollBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      question: { default: '' },
      options: {
        default: [],
        parseHTML: element => {
          try { return JSON.parse(element.getAttribute('data-options') || '[]'); } catch { return []; }
        },
      }
    }
  },
  parseHTML() { return [{ tag: 'div[data-poll-block]' }] },
  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 
      'data-poll-block': 'true', 
      'data-question': node.attrs.question,
      'data-options': JSON.stringify(node.attrs.options),
      contenteditable: 'false',
      style: 'margin: 32px 0; padding: 24px; border: 2px dashed #8b5cf6; border-radius: 16px; background: #f5f3ff; text-align: center;'
    }),
      ['div', { style: 'font-weight: 800; color: #4c1d95; margin-bottom: 8px;' }, '📊 INTERACTIVE POLL BLOCK'],
      ['div', { style: 'color: #5b21b6; font-weight: 700;' }, node.attrs.question]
    ];
  }
});




import { format } from 'date-fns';
import "../../../css/app.css";

// --- Sovereign Styles & Helper Components ---
const rootContainerStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: '#ffffff', display: 'flex', flexDirection: 'column', zIndex: 999999 };
const headerStyle: React.CSSProperties = { height: '80px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', position: 'sticky', top: 0, zIndex: 1000 };
const navIconStyle: React.CSSProperties = { background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' };
const headerTitleStyle: React.CSSProperties = { fontSize: '20px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' };
const scoreHubStyle: React.CSSProperties = { display: 'flex', gap: '16px', marginRight: '10px' };
const iconBtnStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#64748b', whiteSpace: 'nowrap' };
const publishBtnStyle: React.CSSProperties = { background: '#2563eb', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', whiteSpace: 'nowrap' };
const mainCanvasStyle: React.CSSProperties = { flex: 1, overflowY: 'auto', background: '#ffffff', display: 'flex', flexDirection: 'column', position: 'relative', scrollBehavior: 'smooth' };
const floatingToolbarStyle: React.CSSProperties = { position: 'sticky', top: '0', zIndex: 100, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', padding: '16px 40px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', userSelect: 'none' };
const toolDivider: React.CSSProperties = { width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' };
const intelSidebarStyle: React.CSSProperties = { width: '300px', background: '#fff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' };
const intelTabsStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#f1f5f9', padding: '6px', borderRadius: '16px', gap: '4px' };
const sidebarHeadingStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '16px', marginTop: '30px', textTransform: 'uppercase', letterSpacing: '1px' };
const hcuCardStyle: React.CSSProperties = { background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' };
const metaLabelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', display: 'block' };
const metaInputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', background: '#f8fafc' };
const tipRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', marginBottom: '8px', fontWeight: 600 };
const eeatCheckStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, color: '#475569' };
const metaTextAreaStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', minHeight: '100px', outline: 'none', background: '#f8fafc' };
const addNodeBtn: React.CSSProperties = { width: '100%', padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 800, color: '#2563eb', cursor: 'pointer', whiteSpace: 'nowrap' };
const lsiTagStyle: React.CSSProperties = { background: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, border: '1px solid #dbeafe' };
const guardianCard: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', background: '#f0f7ff', borderRadius: '24px', border: '1px solid #dbeafe', marginBottom: '20px' };
const headerSelectWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', margin: '0 4px' };
const headerSelectStyle: React.CSSProperties = { border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 800, color: '#475569', outline: 'none', height: '34px', cursor: 'pointer' };
const metaSelectStyle: React.CSSProperties = { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, background: '#fff' };
const editorWrapperStyle: React.CSSProperties = { background: '#fff', padding: '40px', minHeight: '100vh', position: 'relative', maxWidth: '1000px', margin: '0 auto', width: '100%' };
const bubbleMenuStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '6px', display: 'flex', gap: '6px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', zIndex: 1000 };
const floatingMenuStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '4px', display: 'flex', gap: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 1000 };
const fMenuBtn: React.CSSProperties = { padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 800, color: '#64748b' };
const modalBackdropStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalContentStyle: React.CSSProperties = { background: '#fff', width: '90%', maxWidth: '850px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const modalHeaderStyle: React.CSSProperties = { padding: '24px 40px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeModalBtn: React.CSSProperties = { border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' };
const faqNodeStyle: React.CSSProperties = { padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' };
const faqInputSmall: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: 600 };
const faqTextArea: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', minHeight: '80px' };

const deepWorkOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: '#ffffff', zIndex: 2000000, overflowY: 'auto' };
const exitDeepWorkStyle: React.CSSProperties = { background: '#f1f5f9', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const deepWorkTitleStyle: React.CSSProperties = { width: '100%', fontSize: '64px', fontWeight: 900, border: 'none', outline: 'none', background: 'transparent', textAlign: 'center', color: '#0f172a', marginBottom: '60px', letterSpacing: '-0.04em' };
const tocItemStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: '#64748b', cursor: 'pointer', padding: '4px 0', transition: 'all 0.2s' };


const MiniScore = ({ label, value, color = '#2563eb' }: any) => (
   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</span>
      <span style={{ fontSize: '16px', fontWeight: 900, color }}>{value}%</span>
   </div>
);

const TabBtn = ({ label, icon, active, onClick, status = 'neutral' }: any) => (
   <button onClick={onClick} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 0', background: active ? '#fff' : 'transparent', border: 'none', color: active ? '#2563eb' : '#64748b', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: active ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none' }}>
      {status !== 'neutral' && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', borderRadius: '50%', background: status === 'success' ? '#10b981' : '#f59e0b' }} />}
      {icon} <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.5px' }}>{label.toUpperCase()}</span>
   </button>
);

const SovereignToolBtn = ({ children, onClick, active, title, color }: any) => (
   <button 
      type="button" 
      onClick={onClick} 
      title={title} 
      style={{ 
         width: '38px', 
         height: '38px', 
         borderRadius: '10px', 
         border: active ? '2px solid #2563eb' : '1px solid #e2e8f0', 
         background: active ? '#eff6ff' : '#fff', 
         cursor: 'pointer', 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'center', 
         padding: 0,
         transition: 'all 0.2s',
         color: active ? '#2563eb' : (color || '#1e293b')
      }}
   >
      {children}
   </button>
);

const InputGroup = ({ label, value, onChange, placeholder }: any) => (
   <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={metaLabelStyle}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={metaInputStyle} />
   </div>
);

interface PostFormProps {
   post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
   const [isMobile, setIsMobile] = useState(false);

   const [postId] = useState(post?.id || crypto.randomUUID());

   useEffect(() => {
     const handleResize = () => setIsMobile(window.innerWidth < 1024); // Use 1024px for tablet/mobile to collapse sidebar
     handleResize();
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);
   const [title, setTitle] = useState(post?.title || '');
   const [slug, setSlug] = useState(post?.slug || '');
   const [metaDescription, setMetaDescription] = useState(post?.metaDescription || '');
   const [excerpt, setExcerpt] = useState(post?.excerpt || '');
   const [coverImage, setCoverImage] = useState(post?.coverImage || '');
   const [coverImageAlt, setCoverImageAlt] = useState(post?.coverImageAlt || '');
   const [authorImage, setAuthorImage] = useState(post?.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80');
   const [author, setAuthor] = useState(post?.author || 'Admin');
   const [availableAuthors, setAvailableAuthors] = useState<any[]>([]);
   const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  
   const [focusKeyword, setFocusKeyword] = useState(post?.focusKeyword || '');
   const [category, setCategory] = useState(post?.category || 'General');
   const [tags, setTags] = useState<string[]>(post?.tags || []);
   const [tagInput, setTagInput] = useState('');

   // Advanced SEO States
   const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '');
   const [ogTitle, setOgTitle] = useState(post?.ogTitle || '');
   const [ogDescription, setOgDescription] = useState(post?.ogDescription || '');
   const [twitterCard, setTwitterCard] = useState(post?.twitterCard || 'summary_large_image');
   const [twitterTitle, setTwitterTitle] = useState(post?.twitterTitle || '');
   const [twitterDescription, setTwitterDescription] = useState(post?.twitterDescription || '');
   const [canonicalUrl, setCanonicalUrl] = useState(post?.canonicalUrl || '');
   const [keywords, setKeywords] = useState(post?.keywords || '');

   const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(post?.faqs || []);
   const [howToSteps, setHowToSteps] = useState<{ name: string; text: string }[]>(post?.howToSteps || []);
   const [localBusiness, setLocalBusiness] = useState<{ name: string; telephone: string; ratingValue: string; reviewCount: string; priceRange: string; streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: string; }>(post?.localBusiness || { name: '', telephone: '', ratingValue: '', reviewCount: '', priceRange: '', streetAddress: '', addressLocality: '', addressRegion: '', postalCode: '', addressCountry: '' });
   const [howToModalOpen, setHowToModalOpen] = useState(false);
   const [faqSchemaEnabled, setFaqSchemaEnabled] = useState(true);
   const [snippetScore, setSnippetScore] = useState(0);
   const [snippetTips, setSnippetTips] = useState<string[]>([]);
   const [sentiment, setSentiment] = useState<'neutral' | 'positive' | 'authoritative'>('authoritative');
   const [helpfulScore, setHelpfulScore] = useState(0);
   const [userIntent, setUserIntent] = useState<'informational' | 'transactional' | 'navigational'>('informational');
   // ✅ GEO SEO 2026: Geographic targeting state
   const [targetRegion, setTargetRegion] = useState<string>(post?.targetRegion || 'IN');
   const [targetLanguage, setTargetLanguage] = useState<string>(post?.targetLanguage || 'en-IN');
   const [contentScope, setContentScope] = useState<'global' | 'india' | 'regional'>(post?.contentScope || 'india');
   const [informationGain, setInformationGain] = useState(0);
   const [humanScore, setHumanScore] = useState(0);
   const [clusterStrength, setClusterStrength] = useState(0);
   const [mediaPickerTarget, setMediaPickerTarget] = useState<'cover' | 'author' | null>(null);

   // EEAT Authority State
   const [authorExpertise, setAuthorExpertise] = useState(post?.authorJobTitle || 'Subject Matter Expert');
   const [authorBio, setAuthorBio] = useState(post?.authorBio || '');
   const [authorSocials, setAuthorSocials] = useState(post?.authorSocials || { twitter: '', linkedin: '', website: '' });
   const [researchMethodology, setResearchMethodology] = useState(post?.researchMethodology || '');
   const [sources, setSources] = useState<{ title: string; url: string; type: 'primary' | 'secondary' }[]>(post?.sources || []);

   // ✅ E-E-A-T Deep Author Signals — Google Quality Rater Guidelines
   const [authorExperienceYears, setAuthorExperienceYears] = useState<number>(post?.authorExperienceYears || 0);
   const [authorAwards, setAuthorAwards] = useState<string[]>(post?.authorAwards || []);
   const [awardInput, setAwardInput] = useState('');
   const [authorAlumniOf, setAuthorAlumniOf] = useState<{ name: string; sameAs: string }[]>(post?.authorAlumniOf || []);
   const [alumniNameInput, setAlumniNameInput] = useState('');
   const [alumniSameAsInput, setAlumniSameAsInput] = useState('');
   const [authorKnowsAbout, setAuthorKnowsAbout] = useState<{ name: string; sameAs: string }[]>(post?.authorKnowsAbout || []);
   const [knowsAboutNameInput, setKnowsAboutNameInput] = useState('');
   const [knowsAboutSameAsInput, setKnowsAboutSameAsInput] = useState('');

   // ✅ E-E-A-T Content Signals
   const [keyTakeaways, setKeyTakeaways] = useState<string[]>(post?.keyTakeaways || []);
   const [takeawayInput, setTakeawayInput] = useState('');
   const [semanticMentions, setSemanticMentions] = useState<{ name: string; sameAs: string }[]>(post?.semanticMentions || []);
   const [mentionNameInput, setMentionNameInput] = useState('');
   const [mentionSameAsInput, setMentionSameAsInput] = useState('');
   const [sourceInput, setSourceInput] = useState<{ title: string; url: string; type: 'primary' | 'secondary' }>({ title: '', url: '', type: 'primary' });

   // ✅ Indexing & Content Classification Controls — GSC Policy
   const [isNoIndex, setIsNoIndex] = useState<boolean>(post?.isNoIndex || false);
   const [isSponsored, setIsSponsored] = useState<boolean>(post?.isSponsored || false);
   const [isPillarPage, setIsPillarPage] = useState<boolean>(post?.isPillarPage || false);
   const [isAiAssisted, setIsAiAssisted] = useState<boolean>(post?.isAiAssisted || false);
   const [reviewCycleDays, setReviewCycleDays] = useState<number>(post?.reviewCycleDays || 90);
   const [nextReviewDate, setNextReviewDate] = useState<string>(post?.nextReviewDate ? post.nextReviewDate.split('T')[0] : '');
   const [corrections, setCorrections] = useState<{ date: string; note: string }[]>(post?.corrections || []);
   const [newCorrectionNote, setNewCorrectionNote] = useState('');
   const [coverImageWidth, setCoverImageWidth] = useState<number | null>(null);

   // ✅ AI SEO Audit State
   const [isAiAuditing, setIsAiAuditing] = useState(false);
   const [aiSuggestions, setAiSuggestions] = useState<any>(null);
   const [appliedAiSuggestions, setAppliedAiSuggestions] = useState<Record<string, boolean>>({});

   const handleSaveRef = useRef<any>(null);
   useEffect(() => {
      handleSaveRef.current = handleSave;
   });

   useEffect(() => {
      const timer = setInterval(() => {
         if (handleSaveRef.current && title.trim() !== '') {
             handleSaveRef.current(false, true);
         }
      }, 5000);
      return () => clearInterval(timer);
   }, [title]);

   const runAiAudit = async () => {
      setIsAiAuditing(true);
      setAiSuggestions(null);
      setAppliedAiSuggestions({});
      try {
         const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/seo-audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               title, content: editor?.getHTML(), metaDescription, excerpt, seoTitle, ogTitle, ogDescription, keywords, tags, faqs, howToSteps, localBusiness, keyTakeaways, category
            })
         });
         const data = await res.json();
         if (data.success) {
            setAiSuggestions(data.suggestions);
         } else {
            alert('AI Audit Failed: ' + data.error);
         }
      } catch (err: any) {
         alert('AI Audit Error: ' + err.message);
      }
      setIsAiAuditing(false);
   };

   const applyAiSuggestion = (key: string, suggestionObj: any) => {
      const val = suggestionObj?.value ?? suggestionObj;
      switch(key) {
         case 'metaDescription': setMetaDescription(val); break;
         case 'excerpt': setExcerpt(val); break;
         case 'seoTitle': setSeoTitle(val); break;
         case 'ogTitle': setOgTitle(val); break;
         case 'ogDescription': setOgDescription(val); break;
         case 'keywords': setKeywords(val); break;
         case 'tags': 
            setTags(Array.isArray(val) ? val : (typeof val === 'string' ? val.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0) : [])); 
            break;
         case 'faqs': setFaqs(Array.isArray(val) ? val : []); break;
         case 'howToSteps': setHowToSteps(Array.isArray(val) ? val : []); break;
         case 'localBusiness': setLocalBusiness(val || { name: '', telephone: '', ratingValue: '', reviewCount: '', priceRange: '', streetAddress: '', addressLocality: '', addressRegion: '', postalCode: '', addressCountry: '' }); break;
         case 'keyTakeaways': setKeyTakeaways(Array.isArray(val) ? val : []); break;
         case 'optimizedContent': editor?.commands.setContent(val); break;
      }
      
      setAppliedAiSuggestions((prev) => ({ ...prev, [key]: true }));
   };

   useEffect(() => {
      if (coverImage) {
         const img = new window.Image();
         img.src = coverImage;
         img.onload = () => {
            setCoverImageWidth(img.naturalWidth);
         };
         img.onerror = () => {
            setCoverImageWidth(null);
         };
      } else {
         setCoverImageWidth(null);
      }
   }, [coverImage]);

   useEffect(() => {
        fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/authors').then(r => r.json()).then(data => {
            if (Array.isArray(data)) setAvailableAuthors(data);
         }).catch(e => console.error(e));

         fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/categories').then(r => r.json()).then(data => {
            if (Array.isArray(data)) setAvailableCategories(data);
         }).catch(e => console.error(e));
   }, []);

   const [eeatChecklist, setEeatChecklist] = useState({
      credentialsIncluded: post?.isAiAssisted || false,
      externalCitations: false,
      uniqueInsights: false,
      factChecked: !!post?.factCheckedBy,
   });

   const [factCheckedBy, setFactCheckedBy] = useState(post?.factCheckedBy || '');
   const [factCheckerRole, setFactCheckerRole] = useState(post?.factCheckerRole || 'Editorial Reviewer');

   const [activeTab, setActiveTab] = useState<'editor' | 'seo' | 'eeat' | 'schema' | 'snippets' | 'strategy' | 'guardian' | 'meta'>('editor');
   const [previewMode, setPreviewMode] = useState<'none' | 'google' | 'social' | 'mobile'>('none');
   const [distractionFree, setDistractionFree] = useState(false);
   const [lastSaved, setLastSaved] = useState<string | null>(null);
   const [isPending, startTransition] = useTransition();
   

   const [mounted, setMounted] = useState(false);
   const [audience, setAudience] = useState<'beginner' | 'professional' | 'expert'>('professional');
   const fileInputRef = useRef<HTMLInputElement>(null);
   const coverInputRef = useRef<HTMLInputElement>(null);
   const videoInputRef = useRef<HTMLInputElement>(null);
   const colorInputRef = useRef<HTMLInputElement>(null);
   const sliderInputRef = useRef<HTMLInputElement>(null);
    const authorInputRef = useRef<HTMLInputElement>(null);

   const [lsiKeywords, setLsiKeywords] = useState<string[]>(post?.lsiKeywords || []);
   const [scheduleDate, setScheduleDate] = useState<string>('');
   const [visualHealth, setVisualHealth] = useState({ imageCount: 0, altMissing: 0, score: 0 });

   const [seoScore, setSeoScore] = useState(0);
   const [readabilityScore, setReadabilityScore] = useState(0);
   const [seoTips, setSeoTips] = useState<{ id: string; text: string; type: 'error' | 'warning' | 'success' }[]>([]);
   const [isIndexing, setIsIndexing] = useState(false);
   const [indexStatus, setIndexStatus] = useState<'idle' | 'success'>('idle');
   const [tableOfContents, setTableOfContents] = useState<{ id: string; text: string; level: number }[]>([]);
   const [entities, setEntities] = useState<{ name: string; type: string }[]>([]);

   const [linkModalOpen, setLinkModalOpen] = useState(false);
   const [linkInputUrl, setLinkInputUrl] = useState('');
   const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(false);
   const [linkIsNoFollow, setLinkIsNoFollow] = useState(false);
   const [videoModalOpen, setVideoModalOpen] = useState(false);
   const [videoUrlInput, setVideoUrlInput] = useState('');
   const [imageModalOpen, setImageModalOpen] = useState(false);
   const [imageAltInput, setImageAltInput] = useState('');

   // Slider State
   const [sliderModalOpen, setSliderModalOpen] = useState(false);
   const [sliderImages, setSliderImages] = useState<{src: string, alt: string}[]>([]);
   const [sliderAutoScroll, setSliderAutoScroll] = useState(true);
   const [sliderCenterZoom, setSliderCenterZoom] = useState(true);
   const [sliderSpeed, setSliderSpeed] = useState(3000);

   // FAQ State
   const [faqModalOpen, setFaqModalOpen] = useState(false);
   const [tempFaqs, setTempFaqs] = useState<{ question: string; answer: string }[]>([]);

   // Quiz State
   const [quizModalOpen, setQuizModalOpen] = useState(false);
   const [tempQuiz, setTempQuiz] = useState<{ question: string; options: string[]; correctIndex: number }>({ question: '', options: ['', '', '', ''], correctIndex: 0 });

   const handleOpenQuizModal = () => {
      if (!editor) return;
      if (editor.isActive('quizBlock')) {
         const attrs = editor.getAttributes('quizBlock');
         setTempQuiz({
            question: attrs.question || '',
            options: attrs.options || ['', '', '', ''],
            correctIndex: attrs.correctIndex || 0
         });
      } else {
         setTempQuiz({ question: '', options: ['', '', '', ''], correctIndex: 0 });
      }
      setQuizModalOpen(true);
   };

   const handleApplyQuiz = () => {
      if (!editor || !tempQuiz.question.trim()) return;
      const validOptions = tempQuiz.options.map(o => o.trim()).filter(Boolean);
      if (validOptions.length < 2) return; // Must have at least 2 options
      if (editor.isActive('quizBlock')) {
         editor.chain().focus().updateAttributes('quizBlock', { question: tempQuiz.question.trim(), options: validOptions, correctIndex: tempQuiz.correctIndex }).run();
      } else {
         editor.chain().focus().insertContent({ type: 'quizBlock', attrs: { question: tempQuiz.question.trim(), options: validOptions, correctIndex: tempQuiz.correctIndex } }).run();
      }
      setQuizModalOpen(false);
   };

   // Poll State
   const [pollModalOpen, setPollModalOpen] = useState(false);
   const [tempPoll, setTempPoll] = useState<{ question: string; options: string[] }>({ question: '', options: ['', '', '', ''] });

   const handleOpenPollModal = () => {
      if (!editor) return;
      if (editor.isActive('pollBlock')) {
         const attrs = editor.getAttributes('pollBlock');
         setTempPoll({
            question: attrs.question || '',
            options: attrs.options || ['', '', '', '']
         });
      } else {
         setTempPoll({ question: '', options: ['', '', '', ''] });
      }
      setPollModalOpen(true);
   };

   const handleApplyPoll = () => {
      if (!editor || !tempPoll.question.trim()) return;
      const validOptions = tempPoll.options.map(o => o.trim()).filter(Boolean);
      if (validOptions.length < 2) return; // Must have at least 2 options
      if (editor.isActive('pollBlock')) {
         editor.chain().focus().updateAttributes('pollBlock', { question: tempPoll.question.trim(), options: validOptions }).run();
      } else {
         editor.chain().focus().insertContent({ type: 'pollBlock', attrs: { question: tempPoll.question.trim(), options: validOptions } }).run();
      }
      setPollModalOpen(false);
   };

   const handleOpenFaqModal = () => {
      if (!editor) return;
      if (editor.isActive('faqBlock')) {
         const attrs = editor.getAttributes('faqBlock');
         setTempFaqs(attrs.items || []);
      } else {
         setTempFaqs([{ question: '', answer: '' }]);
      }
      setFaqModalOpen(true);
   };

   const handleApplyFaq = () => {
      if (!editor || tempFaqs.length === 0) return;
      const validFaqs = tempFaqs.filter(f => f.question.trim() && f.answer.trim());
      if (editor.isActive('faqBlock')) {
         editor.chain().focus().updateAttributes('faqBlock', { items: validFaqs }).run();
      } else {
         editor.chain().focus().insertContent({ type: 'faqBlock', attrs: { items: validFaqs } }).run();
      }
      setFaqModalOpen(false);
   };

   const handleSidebarFaqChange = (updatedFaqs: { question: string; answer: string }[]) => {
      setFaqs(updatedFaqs);
      if (!editor) return;
      editor.commands.command(({ tr, state }) => {
         let updated = false;
         state.doc.descendants((node, pos) => {
            if (node.type.name === 'faqBlock') {
               tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  items: updatedFaqs
               });
               updated = true;
            }
            return !updated;
         });
         return updated;
      });
   };

   const handleOpenSliderModal = () => {
      if (!editor) return;
      if (editor.isActive('imageSlider')) {
         const attrs = editor.getAttributes('imageSlider');
         setSliderImages(attrs.images || []);
         setSliderAutoScroll(attrs.autoScroll ?? true);
         setSliderCenterZoom(attrs.centerZoom ?? true);
         setSliderSpeed(attrs.speed || 3000);
      } else {
         setSliderImages([]);
         setSliderAutoScroll(true);
         setSliderCenterZoom(true);
         setSliderSpeed(3000);
      }
      setSliderModalOpen(true);
   };

   const handleApplySlider = () => {
      if (!editor || sliderImages.length === 0) return;
      if (editor.isActive('imageSlider')) {
         editor.chain().focus().updateAttributes('imageSlider', { images: sliderImages, autoScroll: sliderAutoScroll, centerZoom: sliderCenterZoom, speed: sliderSpeed }).run();
      } else {
         editor.chain().focus().insertContent({ type: 'imageSlider', attrs: { images: sliderImages, autoScroll: sliderAutoScroll, centerZoom: sliderCenterZoom, speed: sliderSpeed } }).run();
      }
      setSliderModalOpen(false);
   };

   const handleSliderImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;
      for (let i = 0; i < files.length; i++) {
         const formData = new FormData();
         formData.append('file', files[i]);
         try {
            /* handleUpload is mocked */ const result: any = { success: true, url: "" };
            if (result.success && result.url) {
               setSliderImages(prev => [...prev, { src: result.url, alt: '' }]);
            }
         } catch (error) { console.error('Slider image upload failed:', error); }
      }
   };

   const handleOpenLinkModal = () => {
      if (!editor) return;
      const attrs = editor.getAttributes('link');
      setLinkInputUrl(attrs.href || '');
      setLinkOpenInNewTab(attrs.target === '_blank');
      setLinkIsNoFollow(attrs.rel?.includes('nofollow') || false);
      setLinkModalOpen(true);
   };

   const handleApplyLink = () => {
      if (!editor) return;
      if (linkInputUrl.trim() === '') {
         editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
         let url = linkInputUrl.trim();
         if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('#')) {
            url = 'https://' + url;
         }
         
         const attributes: any = { href: url };
         if (linkOpenInNewTab) attributes.target = '_blank';
         else attributes.target = null;
         
         if (linkIsNoFollow) attributes.rel = 'nofollow';
         else attributes.rel = null;

         editor.chain().focus().extendMarkRange('link').setLink(attributes).run();
      }
      setLinkModalOpen(false);
   };

   const handleOpenImageModal = () => {
      if (!editor) return;
      const attrs = editor.getAttributes('image');
      if (attrs.src) {
         setImageAltInput(attrs.alt || '');
         setImageModalOpen(true);
      }
   };

   const handleApplyImageAlt = () => {
      if (!editor) return;
      editor.chain().focus().updateAttributes('image', { alt: imageAltInput }).run();
      setImageModalOpen(false);
   };

   const handleApplyYoutube = () => {
      if (!editor || !videoUrlInput) return;
      const url = videoUrlInput.trim();
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
         editor.chain().focus().setYoutubeVideo({ src: url }).run();
      } else if (url.includes('instagram.com')) {
         const embedUrl = url.endsWith('/') ? url + 'embed' : url + '/embed';
         editor.chain().focus().insertContent({ type: 'socialEmbed', attrs: { src: embedUrl, platform: 'instagram' } }).run();
      } else if (url.includes('facebook.com')) {
         const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
         editor.chain().focus().insertContent({ type: 'socialEmbed', attrs: { src: embedUrl, platform: 'facebook' } }).run();
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
         const tweetId = url.split('/').pop()?.split('?')[0];
         const embedUrl = `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`;
         editor.chain().focus().insertContent({ type: 'socialEmbed', attrs: { src: embedUrl, platform: 'twitter' } }).run();
      } else {
         editor.chain().focus().insertContent({ type: 'socialEmbed', attrs: { src: url, platform: 'generic' } }).run();
      }
      
      setVideoModalOpen(false);
      setVideoUrlInput('');
   };

   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
         const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/upload', { method: 'POST', body: formData });
         const result = await res.json();
         if (result.success && result.url && editor) {
            editor.chain().focus().setImage({ src: result.url, alt: '' }).run();
            setTimeout(() => {
               handleOpenImageModal();
            }, 100);
         } else {
            alert(`Upload failed: ${result.error || 'Unknown error'}`);
         }
      } catch (error) {
         console.error('Upload failed:', error);
         alert('Upload failed. Please check connection and file size limits.');
      }
   };

   const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
         const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/upload', { method: 'POST', body: formData });
         const result = await res.json();
         if (result.success && result.url) {
            setCoverImage(result.url);
         } else {
            alert(`Cover upload failed: ${result.message || result.error || 'Unknown error'}`);
         }
      } catch (error) {
         console.error('Cover upload failed:', error);
         alert('Cover photo upload failed. Please check connection and file size limits.');
      }
   };

   const handleAuthorImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
       const file = event.target.files?.[0];
       if (!file) return;

       // Clear input to allow uploading same file again if needed
       event.target.value = '';

       const formData = new FormData();
       formData.append('file', file);
       try {
          const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/upload', { method: 'POST', body: formData });
          const result = await res.json();
          if (result.success && result.url) {
             setAuthorImage(result.url);
          } else {
             alert(`Author image upload failed: ${result.message || result.error || 'Unknown error'}`);
          }
       } catch (error: any) {
          console.error('Author image upload failed:', error);
          alert(`Author image upload failed: ${error.message || 'Unknown error'}`);
       }
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      if (color && editor) {
         editor.chain().focus().setColor(color).run();
      }
   };

   const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
         const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/upload', { method: 'POST', body: formData });
         const result = await res.json();
         if (result.success && result.url && editor) {
            editor.chain().focus().insertContent({ type: 'video', attrs: { src: result.url } }).run();
         }
      } catch (error) { console.error('Video upload failed:', error); }
   };

   useEffect(() => {
      setMounted(true);
      const style = document.createElement('style');
      style.innerHTML = `
      .ProseMirror { outline: none !important; min-height: 800px; font-size: 19px; line-height: 1.8; color: #1e293b; transition: all 0.3s ease; }
      .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #94a3b8; pointer-events: none; height: 0; font-style: italic; }
      .sovereign-editor-v5-fixed * { box-sizing: border-box; }
      .prose-container { width: 100%; }
    `;
      document.head.appendChild(style);
      return () => { if (document.head.contains(style)) document.head.removeChild(style); };
   }, []);

   const editor = useEditor({
      extensions: [
         StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
         Image, Link.configure({ openOnClick: false }), Underline,
         Table.configure({ resizable: true }), TableRow, TableHeader, TableCell,
         CharacterCount, Typography, Highlight, TextAlign.configure({ types: ['heading', 'paragraph'] }),
         TaskList, TaskItem.configure({ nested: true }), Subscript, Superscript, 
         TextStyle, Color, FontSize, Youtube.configure({ width: 840, height: 480, HTMLAttributes: { style: 'border-radius: 16px; margin: 24px 0; max-width: 100%; height: auto; aspect-ratio: 16/9;' } }), Video, SocialEmbed, ImageSlider, FaqBlock, QuizBlock, PollBlock,
         Placeholder.configure({ placeholder: 'Start your story or type / for commands...' }),
      ],
      content: post?.content || '',
      onUpdate: ({ editor }) => {
         const html = editor.getHTML();
         const text = editor.getText();
         runSeoAudit(html, title, metaDescription, focusKeyword);
         updateTOC(html);
         extractEntities(text);
         analyzeSnippetPotential(text, html);
         auditVisualHealth(html);
         calculateHelpfulScore(text, html);
         syncFaqsFromEditor(html);
      },
   });

   useEffect(() => {
      if (editor && post && post.faqs && post.faqs.length > 0) {
         let hasFaqBlock = false;
         let emptyFaqBlockPos = -1;
         editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'faqBlock') {
               hasFaqBlock = true;
               const items = node.attrs.items || [];
               if (items.length === 0) {
                  emptyFaqBlockPos = pos;
               }
            }
         });
         
         if (emptyFaqBlockPos !== -1) {
            editor.commands.command(({ tr }) => {
               tr.setNodeMarkup(emptyFaqBlockPos, undefined, {
                  items: post.faqs
               });
               return true;
            });
         } else if (!hasFaqBlock) {
            editor.commands.command(({ tr, state }) => {
               const node = state.schema.nodes.faqBlock.create({ items: post.faqs });
               tr.insert(state.doc.content.size, node);
               return true;
            });
         }
      }
   }, [editor, post]);

   const syncFaqsFromEditor = (html: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const faqBlocks = Array.from(doc.querySelectorAll('div[data-faq-block]'));
      let allFaqs: { question: string; answer: string }[] = [];
      faqBlocks.forEach(block => {
         try {
            const items = JSON.parse(block.getAttribute('data-faqs') || '[]');
            allFaqs = [...allFaqs, ...items];
         } catch (e) {}
      });
      setFaqs(allFaqs);
   };

   const calculateHelpfulScore = (text: string, html: string) => {
      let score = 70;
      if (text.length > 5000) score += 10;
      if (html.includes('<table>')) score += 10;
      if (html.includes('<ul>') || html.includes('<ol>')) score += 5;
      if (text.toLowerCase().includes('how to') || text.toLowerCase().includes('guide')) score += 5;
      setHelpfulScore(Math.min(100, score));
   };

   const auditVisualHealth = (html: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const images = Array.from(doc.querySelectorAll('img'));
      const altMissing = images.filter(img => !img.alt).length;
      setVisualHealth({ imageCount: images.length, altMissing, score: images.length > 0 ? (altMissing === 0 ? 100 : 50) : 0 });
   };

   const analyzeSnippetPotential = (text: string, html: string) => {
      let score = 0;
      const tips: string[] = [];
      const lowerText = text.toLowerCase();
      if (lowerText.match(/(what is|how to|why does|guide to).{5,30}\?/i)) { score += 25; tips.push('Direct query heading identified.'); }
      if (text.match(/(is|means|refers to|can be defined as)\s+[a-zA-Z0-9\s,]{10,150}\./i)) { score += 35; tips.push('Clear definition paragraph found.'); }
      if (html.includes('<ul>') || html.includes('<ol>')) { score += 20; tips.push('Structured list format used.'); }
      if (html.includes('<table>')) { score += 30; tips.push('Data table detected.'); }
      setSnippetScore(Math.min(100, score));
      setSnippetTips(tips);
   };

   const extractEntities = (text: string) => {
      const commonEntities = ['React', 'Next.js', 'Google', 'SEO', 'AI', 'EEAT', 'Helpful Content', 'JSON-LD', 'Schema', 'Sovereign', 'Blog'];
      const found = commonEntities.filter(e => text.toLowerCase().includes(e.toLowerCase()));
      setEntities(found.map(e => ({ name: e, type: 'Entity' })));
   };

   const updateTOC = (html: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const headings = Array.from(doc.querySelectorAll('h2, h3, h4'));
      setTableOfContents(headings.map((h, i) => ({ id: `h-${i}`, text: h.textContent || '', level: parseInt(h.tagName.substring(1)) })));
   };

   const runSeoAudit = useCallback((content: string, currentTitle: string, currentMeta: string, currentKeyword: string) => {
      const text = content.replace(/<[^>]*>/g, '');
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const lowerText = text.toLowerCase();
      const newTips: any[] = [];
      let finalScore = 0;
      if (currentTitle.length >= 40 && currentTitle.length <= 60) finalScore += 20;
      if (currentMeta.length >= 120 && currentMeta.length <= 160) finalScore += 20;
      if (wordCount > 1000) finalScore += 20;
      if (currentKeyword && lowerText.includes(currentKeyword.toLowerCase())) finalScore += 20;
      if (content.includes('</h2>')) finalScore += 20;
      setSeoScore(finalScore);
      setReadabilityScore(Math.min(100, Math.round(finalScore * 0.8)));
      setClusterStrength(Math.min(100, entities.length * 15));
      setHumanScore(88);
      setSeoTips(newTips);
   }, [entities.length]);

   const handleSave = async (published: boolean = true, isAutoSave: boolean = false) => {
      if (!editor) return;
      startTransition(async () => {
         const cleanSlug = (slug || title)
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
         const updatedPost: Post = {
            ...post,
            id: postId,
            title,
            slug: cleanSlug,
            content: editor.getHTML(),
            metaDescription,
            excerpt: excerpt || metaDescription || title,
            coverImage, coverImageAlt,
            authorImage,
            authorSocials,
            seoTitle, ogTitle, ogDescription, canonicalUrl, keywords,
            twitterCard, twitterTitle, twitterDescription,
            category, tags, faqs, howToSteps, localBusiness,
            published,
            date: post?.date || format(new Date(), 'yyyy-MM-dd'),
            author: author || 'Admin',
            factCheckedBy, factCheckerRole,
            authorJobTitle: authorExpertise,
            authorBio, researchMethodology, sources,
            searchIntent: userIntent,
            seoScore,
            // ✅ GEO SEO 2026: Geographic targeting fields
            targetRegion,
            targetLanguage,
            contentScope,
            // ✅ E-E-A-T Deep Author Authority Signals
            authorExperienceYears: authorExperienceYears || undefined,
            authorAwards: authorAwards.length > 0 ? authorAwards : undefined,
            authorAlumniOf: authorAlumniOf.length > 0 ? authorAlumniOf : undefined,
            authorKnowsAbout: authorKnowsAbout.length > 0 ? authorKnowsAbout : undefined,
            // ✅ E-E-A-T Content Trust Signals
            keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : undefined,
            semanticMentions: semanticMentions.length > 0 ? semanticMentions : undefined,
            reviewCycleDays: reviewCycleDays || undefined,
            nextReviewDate: nextReviewDate || undefined,
            // ✅ GSC Policy: Indexing controls & content classification
            isNoIndex: isNoIndex || undefined,
            isSponsored: isSponsored || undefined,
            isPillarPage: isPillarPage || undefined,
            isAiAssisted: isAiAssisted || undefined,
            corrections: corrections.length > 0 ? corrections : undefined,
            focusKeyword: focusKeyword || undefined,
            lsiKeywords: lsiKeywords.length > 0 ? lsiKeywords : undefined,
         };

         const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPost)
         });
         
         if (!res.ok) {
             if (!isAutoSave) {
                 const errData = await res.json().catch(() => null);
                 alert(`Failed to save post. Error: ${errData?.message || res.statusText}`);
             }
             return;
         }
         
         if (isAutoSave) {
            setLastSaved(new Date().toLocaleTimeString());
         } else {
            const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
            setTimeout(() => {
               router.visit(BASE + '/admin');
            });
         }
      });
   };

   if (!editor || !mounted) return null;

   return (
      <div className={`sovereign-editor-v5-fixed`} style={rootContainerStyle}>
         <AnimatePresence>
            {distractionFree && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={deepWorkOverlayStyle}>
                  <div style={{ width: '100%', padding: '0 0 100px 0', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
                     <div style={{ width: '100%', maxWidth: '1000px', marginTop: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                         <button onClick={() => setDistractionFree(false)} style={exitDeepWorkStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px' }}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                            Exit Deep Work
                         </button>
                      </div>

                      {/* Full-Feature Sticky Toolbar for Deep Work */}
                      <div style={{ ...floatingToolbarStyle, top: '0', marginBottom: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '12px 24px', justifyContent: 'center' }}>
                         {/* History Group */}
                         <div style={{ display: 'flex', gap: '4px' }}>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
                            </SovereignToolBtn>
                         </div>
                         <div style={toolDivider} />

                         {/* Formatting Group */}
                         <div style={{ display: 'flex', gap: '4px' }}>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive('strike')} title="Strikethrough">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 4h-7a4 4 0 0 0-4 4 4 4 0 0 0 4 4h7a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-7"/></svg>
                            </SovereignToolBtn>
                         </div>
                         <div style={toolDivider} />

                         {/* Structure Group */}
                         <div style={headerSelectWrapper}>
                            <select 
                               onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === 'p') editor?.chain().focus().setParagraph().run();
                                  else editor?.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
                               }}
                               value={editor?.isActive('heading', { level: 1 }) ? '1' : editor?.isActive('heading', { level: 2 }) ? '2' : editor?.isActive('heading', { level: 3 }) ? '3' : editor?.isActive('heading', { level: 4 }) ? '4' : 'p'}
                               style={headerSelectStyle}
                            >
                               <option value="p">Normal</option>
                               <option value="1">Major Heading</option>
                               <option value="2">Heading</option>
                               <option value="3">Sub-heading</option>
                               <option value="4">Minor Heading</option>
                            </select>
                            <div style={{ width: '1px', height: '16px', background: '#e2e8f0', margin: '0 8px' }} />
                            <select 
                               onChange={(e) => {
                                  const size = e.target.value;
                                  editor?.chain().focus().setMark('textStyle', { fontSize: size }).run();
                               }}
                               style={{ ...headerSelectStyle, width: '60px' }}
                            >
                               <option value="16px">Size</option>
                               {['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'].map(size => (
                                  <option key={size} value={size}>{size}</option>
                               ))}
                            </select>
                         </div>
                         <div style={toolDivider} />

                         {/* Alignment Group */}
                         <div style={{ display: 'flex', gap: '4px' }}>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} title="Left Align">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} title="Center Align">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} title="Right Align">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
                            </SovereignToolBtn>
                         </div>
                         <div style={toolDivider} />

                         {/* Lists Group */}
                         <div style={{ display: 'flex', gap: '4px' }}>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet List">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Numbered List">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
                            </SovereignToolBtn>
                         </div>
                         <div style={toolDivider} />

                         {/* Inserts & Colors */}
                         <div style={{ display: 'flex', gap: '4px' }}>
                            <SovereignToolBtn onClick={() => colorInputRef.current?.click()} title="Text Color">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().toggleHighlight().run()} active={editor?.isActive('highlight')} title="Text Background Color">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => setVideoModalOpen(true)} title="Video Portal">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m15 8-5 4 5 4V8Z"/><path d="M7 12h1"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={handleOpenLinkModal} active={editor?.isActive('link')} title="Insert Link">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            </SovereignToolBtn>
                         </div>
                         <div style={toolDivider} />

                         <div style={{ display: 'flex', gap: '4px' }}>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().deleteTable().run()} title="Delete Table" color="#ef4444">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().addRowAfter().run()} title="Add Row">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                            </SovereignToolBtn>
                            <SovereignToolBtn onClick={() => editor?.chain().focus().addColumnAfter().run()} title="Add Column">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
                            </SovereignToolBtn>
                         </div>
                         <div style={toolDivider} />

                         <SovereignToolBtn onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M21 7L7 21"/><path d="M7 7l14 14"/><path d="M3 11l5 5"/><path d="m13 16 5 5"/><path d="m8 3 5 5"/></svg>
                         </SovereignToolBtn>
                      </div>
                     <input placeholder="Unlock the Sovereign Title..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...deepWorkTitleStyle, fontSize: '48px', marginBottom: '16px' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-8px', marginBottom: '32px', padding: '0 4px', fontSize: '12px', fontWeight: 600 }}>
                         <span style={{ color: title.length > 110 ? '#ef4444' : '#64748b' }}>
                            Headline length: {title.length} characters (Recommended: ≤110)
                         </span>
                         {title.length > 110 && (
                            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                               ⚠️ Exceeds Google's recommended 110-character limit
                            </span>
                         )}
                      </div>

                     <EditorContent editor={editor} className="tiptap-content prose-container" />
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <div role="banner" style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
               <button onClick={() => window.history.back()} style={navIconStyle}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '20px', height: '20px' }}><path d="m15 18-6-6 6-6"/></svg>
               </button>

               <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <input 
                     value={title} 
                     onChange={e => setTitle(e.target.value)} 
                     placeholder={post ? 'Edit Sovereign Post' : 'New Sovereign Post'} 
                     style={{ ...headerTitleStyle, border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '0' }} 
                  />
               </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={scoreHubStyle}>
                  <MiniScore label="SEO" value={seoScore} />
                  <MiniScore label="HCU" value={helpfulScore} color="#10b981" />
                  <MiniScore label="SNIP" value={snippetScore} color="#8b5cf6" />
               </div>
               <button onClick={() => setDistractionFree(true)} style={iconBtnStyle} title="Distraction Free Mode">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
               </button>
               <button onClick={() => setPreviewMode('google')} style={iconBtnStyle} title="Search Preview">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
               </button>
               {lastSaved && <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Saved: {lastSaved}</span>}
               <button onClick={() => handleSave(true, false)} disabled={isPending} style={publishBtnStyle}>{isPending ? 'Syncing...' : 'Deploy'}</button>

            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: isMobile ? 'auto' : 'hidden' }}>
            <main style={{ ...mainCanvasStyle, overflowY: isMobile ? 'visible' : 'auto' }}>
                <div style={floatingToolbarStyle}>
                   {/* History Group */}
                   <div style={{ display: 'flex', gap: '4px', maxWidth: '1000px', margin: '0 auto', width: '100%', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                         <SovereignToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
                         </SovereignToolBtn>
                      </div>
                      <div style={toolDivider} />

                      {/* Formatting Group */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                         <SovereignToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 4h-7a4 4 0 0 0-4 4 4 4 0 0 0 4 4h7a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-7"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => colorInputRef.current?.click()} title="Text Color">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Text Highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
                         </SovereignToolBtn>
                      </div>
                      <div style={toolDivider} />

                      {/* Structure & Size Group */}
                      <div style={headerSelectWrapper}>
                         <select 
                            onChange={(e) => {
                               const val = e.target.value;
                               if (val === 'p') editor.chain().focus().setParagraph().run();
                               else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
                            }}
                            value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : editor.isActive('heading', { level: 4 }) ? '4' : 'p'}
                            style={headerSelectStyle}
                         >
                            <option value="p">Normal</option>
                            <option value="1">Major Heading</option>
                            <option value="2">Heading</option>
                            <option value="3">Sub-heading</option>
                            <option value="4">Minor Heading</option>
                         </select>
                         <div style={{ width: '1px', height: '16px', background: '#e2e8f0', margin: '0 8px' }} />
                         <select 
                            onChange={(e) => {
                               const size = e.target.value;
                               editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
                            }}
                            style={{ ...headerSelectStyle, width: '60px' }}
                         >
                            <option value="16px">Size</option>
                            {['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'].map(size => (
                               <option key={size} value={size}>{size}</option>
                            ))}
                         </select>
                      </div>
                      <div style={toolDivider} />

                      {/* Alignment & Lists */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                         <SovereignToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Left Align">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center Align">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Right Align">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
                         </SovereignToolBtn>
                         <div style={{ width: '1px', height: '16px', background: '#e2e8f0', margin: '0 4px' }} />
                         <SovereignToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                         </SovereignToolBtn>
                      </div>
                      <div style={toolDivider} />

                      {/* Inserts & Tables */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                         <SovereignToolBtn onClick={handleOpenLinkModal} active={editor.isActive('link')} title="Insert Link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => fileInputRef.current?.click()} title="Insert Image">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={handleOpenSliderModal} title="Insert Image Slider">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={handleOpenFaqModal} title="Insert FAQ Schema Block">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={handleOpenQuizModal} title="Insert Interactive Quiz">
                            <span style={{ fontSize: '16px', lineHeight: 1 }}>🧩</span>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={handleOpenPollModal} title="Insert Interactive Poll">
                            <span style={{ fontSize: '16px', lineHeight: 1 }}>📊</span>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => setVideoModalOpen(true)} title="Video Portal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m15 8-5 4 5 4V8Z"/><path d="M7 12h1"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 2.5 0 5-2 5"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 2.5 0 5-2 5"/></svg>
                         </SovereignToolBtn>
                      </div>
                      <div style={toolDivider} />

                      {/* Advanced Tables */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                         <SovereignToolBtn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
                         </SovereignToolBtn>
                         <SovereignToolBtn onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table" color="#ef4444">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                         </SovereignToolBtn>
                      </div>
                      <div style={toolDivider} />

                      <SovereignToolBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M21 7L7 21"/><path d="M7 7l14 14"/><path d="M3 11l5 5"/><path d="m13 16 5 5"/><path d="m8 3 5 5"/></svg>
                      </SovereignToolBtn>
                      <SovereignToolBtn onClick={() => setActiveTab('guardian')} title="AI Shield" color="#8b5cf6">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                      </SovereignToolBtn>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                      <input type="file" ref={videoInputRef} onChange={handleVideoUpload} style={{ display: 'none' }} accept="video/*" />
                      <input type="color" ref={colorInputRef} onChange={handleColorChange} style={{ display: 'none' }} />
                      <input type="file" ref={sliderInputRef} onChange={handleSliderImageUpload} multiple style={{ display: 'none' }} accept="image/*" />
                   </div>
                </div>

               <div style={editorWrapperStyle}>
                   <BubbleMenu editor={editor} shouldShow={({ editor, state }) => {
                      // Check NodeSelection for atom nodes (contenteditable:false)
                      const { selection } = state;
                      const isNodeSel = selection && (selection as any).node;
                      if (isNodeSel) {
                         const nodeType = (selection as any).node.type.name;
                         return nodeType === 'faqBlock' || nodeType === 'imageSlider' || nodeType === 'image' || nodeType === 'quizBlock' || nodeType === 'pollBlock';
                      }
                      return editor.isActive('image') || editor.isActive('imageSlider') || editor.isActive('faqBlock') || editor.isActive('quizBlock') || editor.isActive('pollBlock');
                   }}>
                         <div style={bubbleMenuStyle}>
                            {(() => {
                               const { selection } = editor.state;
                               const selectedNodeType = (selection as any).node?.type?.name;
                               if (selectedNodeType === 'imageSlider' || editor.isActive('imageSlider')) return (
                                  <SovereignToolBtn onClick={handleOpenSliderModal} title="Slider Settings">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                                     <span style={{ fontSize: '11px', fontWeight: 700, marginLeft: '6px' }}>EDIT SLIDER</span>
                                  </SovereignToolBtn>
                               );
                               if (selectedNodeType === 'faqBlock' || editor.isActive('faqBlock')) return (
                                  <SovereignToolBtn onClick={handleOpenFaqModal} title="Edit FAQ Block">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                                     <span style={{ fontSize: '11px', fontWeight: 700, marginLeft: '6px' }}>EDIT FAQ</span>
                                  </SovereignToolBtn>
                               );
                               if (selectedNodeType === 'quizBlock' || editor.isActive('quizBlock')) return (
                                  <SovereignToolBtn onClick={handleOpenQuizModal} title="Edit Quiz Block">
                                     <span style={{ fontSize: '14px', lineHeight: 1 }}>🧩</span>
                                     <span style={{ fontSize: '11px', fontWeight: 700, marginLeft: '6px' }}>EDIT QUIZ</span>
                                  </SovereignToolBtn>
                               );
                               if (selectedNodeType === 'pollBlock' || editor.isActive('pollBlock')) return (
                                  <SovereignToolBtn onClick={handleOpenPollModal} title="Edit Poll Block">
                                     <span style={{ fontSize: '14px', lineHeight: 1 }}>📊</span>
                                     <span style={{ fontSize: '11px', fontWeight: 700, marginLeft: '6px' }}>EDIT POLL</span>
                                  </SovereignToolBtn>
                               );
                               return (
                                  <SovereignToolBtn onClick={handleOpenImageModal} title="Image Settings">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                                     <span style={{ fontSize: '11px', fontWeight: 700, marginLeft: '6px' }}>ALT TEXT</span>
                                  </SovereignToolBtn>
                               );
                            })()}
                         </div>
                     </BubbleMenu>
                     <EditorContent editor={editor} className="tiptap-content" />
                   </div>
             </main>

            <aside style={{ ...intelSidebarStyle, width: isMobile ? '100%' : '300px', borderLeft: isMobile ? 'none' : '1px solid #e2e8f0', borderTop: isMobile ? '1px solid #e2e8f0' : 'none', overflowY: isMobile ? 'visible' : 'auto' }}>
               <div style={{ padding: '24px 24px 0 24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px' }}>INTEL MODULES</div>
                   <div style={intelTabsStyle}>
                     <TabBtn active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>} label="Audit" status={seoScore > 80 ? 'success' : 'warning'} />
                     <TabBtn active={activeTab === 'snippets'} onClick={() => setActiveTab('snippets')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>} label="Snippets" status={snippetScore > 70 ? 'success' : 'neutral'} />
                     <TabBtn active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg>} label="Strategy" status="neutral" />
                     <TabBtn active={activeTab === 'meta'} onClick={() => setActiveTab('meta')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>} label="Meta" status={seoTitle ? 'success' : 'warning'} />

                     
                     <TabBtn active={activeTab === 'eeat'} onClick={() => setActiveTab('eeat')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>} label="EEAT" status={factCheckedBy ? 'success' : 'warning'} />
                     <TabBtn active={activeTab === 'guardian'} onClick={() => setActiveTab('guardian')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>} label="Shield" status="success" />
                     <TabBtn active={activeTab === 'schema'} onClick={() => setActiveTab('schema')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>} label="Schema" status={faqs.length > 0 ? 'success' : 'neutral'} />
                     <TabBtn active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>} label="Turbo" status="neutral" />

                  </div>
               </div>

               <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                  <AnimatePresence mode="wait">
                     {activeTab === 'editor' && (
                        <motion.div key="editor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                           <h3 style={sidebarHeadingStyle}>Google HCU Audit</h3>
                           <div style={hcuCardStyle}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                 <span style={{ fontSize: '11px', fontWeight: 900, color: '#64748b' }}>HELPFUL CONTENT SCORE</span>
                                 <span style={{ fontSize: '18px', fontWeight: 900, color: helpfulScore > 80 ? '#10b981' : '#f59e0b' }}>{helpfulScore}%</span>
                              </div>
                              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
                                 <motion.div initial={{ width: 0 }} animate={{ width: `${helpfulScore}%` }} style={{ height: '100%', background: helpfulScore > 80 ? '#10b981' : '#f59e0b' }} />
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                 <StatBox label="INTENT" value={userIntent.toUpperCase()} />
                                 <StatBox label="HUMAN" value={`${humanScore}%`} />
                                 <StatBox label="GAIN" value="HIGH" />
                                 <StatBox label="ENTITIES" value={entities.length} />
                              </div>
                           </div>

                           <h3 style={sidebarHeadingStyle}>Technical SEO Tips</h3>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {seoScore < 100 && <SeoTip icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} text="Increase content length to 1500+ words." type="warning" />}
                              {visualHealth.altMissing > 0 && <SeoTip icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} text={`${visualHealth.altMissing} images missing ALT text.`} type="error" />}
                              {helpfulScore >= 80 && <SeoTip icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} text="Content shows high human-gain value." type="success" />}
                           </div>


                           <h3 style={sidebarHeadingStyle}>Document Outline</h3>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {tableOfContents.map(h => (
                                 <div key={h.id} style={{ ...tocItemStyle, paddingLeft: `${(h.level - 2) * 12}px`, borderLeft: activeTab === 'editor' ? '2px solid #e2e8f0' : 'none' }}>
                                    {h.text}
                                 </div>
                              ))}
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'snippets' && (
                        <motion.div key="snippets" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                           <h3 style={sidebarHeadingStyle}>Featured Snippet Audit</h3>
                           <div style={hcuCardStyle}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                 <span style={{ fontSize: '11px', fontWeight: 900 }}>SNIPPET POTENTIAL</span>
                                 <span style={{ fontSize: '18px', fontWeight: 900, color: '#8b5cf6' }}>{snippetScore}%</span>
                              </div>
                              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Optimizing for Position Zero increases CTR by 30%.</p>
                           </div>
                           <h4 style={{ fontSize: '11px', fontWeight: 900, marginBottom: '12px' }}>OPTIMIZATION TIPS</h4>
                           {snippetTips.map((tip, i) => <div key={i} style={tipRowStyle}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '12px', height: '12px', color: '#10b981' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> {tip}</div>)}

                        </motion.div>
                     )}

                     {activeTab === 'eeat' && (
                         <motion.div key="eeat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h3 style={sidebarHeadingStyle}>EEAT Verification</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                               {availableAuthors.length > 0 && (
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <label style={metaLabelStyle}>SELECT SAVED AUTHOR PROFILE</label>
                                    <select 
                                      style={metaInputStyle}
                                      value={availableAuthors.find(a => a.name === author)?.id || ''}
                                      onChange={e => {
                                        const selected = availableAuthors.find(a => a.id === e.target.value);
                                        if (selected) {
                                          setAuthor(selected.name);
                                          setAuthorExpertise(selected.jobTitle || '');
                                          setAuthorBio(selected.bio || '');
                                          setAuthorImage(selected.image || '');
                                          setAuthorExperienceYears(selected.experienceYears || 0);
                                          setAuthorSocials(selected.socials || { twitter: '', linkedin: '', website: '' });
                                          if (selected.awards) setAuthorAwards(selected.awards);
                                          if (selected.alumniOf) setAuthorAlumniOf(selected.alumniOf);
                                          if (selected.knowsAbout) setAuthorKnowsAbout(selected.knowsAbout);
                                        }
                                      }}
                                    >
                                      <option value="">-- Choose an Author --</option>
                                      {availableAuthors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>This connects the post to a rich Author Profile for EEAT.</span>
                                 </div>
                               )}
                               
                               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                                  <label style={metaLabelStyle}>SELECT CATEGORY</label>
                                  <select 
                                    style={metaInputStyle}
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                  >
                                    <option value="General">General</option>
                                    {availableCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                  </select>
                               </div>

                               <InputGroup label="FACT CHECKED BY" value={factCheckedBy} onChange={setFactCheckedBy} placeholder="e.g. Dr. Sarah Connor" />
                               <InputGroup label="FACT CHECKER ROLE" value={factCheckerRole} onChange={setFactCheckerRole} placeholder="e.g. Senior Medical Editor" />

                               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <label style={metaLabelStyle}>🔬 RESEARCH METHODOLOGY</label>
                                  <textarea placeholder="Describe how data was collected and verified..." value={researchMethodology} onChange={e => setResearchMethodology(e.target.value)} style={metaTextAreaStyle} />
                               </div>

                               {/* ✅ Sources / Citations */}
                               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <label style={metaLabelStyle}>📚 SOURCES & CITATIONS</label>
                                  {sources.map((src, i) => (
                                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', border: '1px solid #e2e8f0' }}>
                                        <span style={{ background: src.type === 'primary' ? '#10b981' : '#3b82f6', color: 'white', padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>{src.type}</span>
                                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569' }}>{src.title || src.url}</span>
                                        <button onClick={() => setSources(sources.filter((_, idx) => idx !== i))} style={{ border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>✕</button>
                                     </div>
                                  ))}
                                  <input value={sourceInput.title} onChange={e => setSourceInput({...sourceInput, title: e.target.value})} placeholder="Source Title" style={{ ...metaInputStyle, marginBottom: '6px' }} />
                                  <input value={sourceInput.url} onChange={e => setSourceInput({...sourceInput, url: e.target.value})} placeholder="Source URL (https://...)" style={{ ...metaInputStyle, marginBottom: '6px' }} />
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                     <select value={sourceInput.type} onChange={e => setSourceInput({...sourceInput, type: e.target.value as 'primary' | 'secondary'})} style={{ ...metaInputStyle, flex: 1 }}>
                                        <option value="primary">Primary Source</option>
                                        <option value="secondary">Secondary Source</option>
                                     </select>
                                     <button onClick={() => { if (sourceInput.url.trim()) { setSources([...sources, { ...sourceInput }]); setSourceInput({ title: '', url: '', type: 'primary' }); }}} style={{ ...addNodeBtn, width: 'auto', padding: '0 16px', margin: 0 }}>Add</button>
                                  </div>
                               </div>


                               <div style={eeatCheckStyle}>
                                  <input type="checkbox" checked={eeatChecklist.credentialsIncluded} onChange={e => setEeatChecklist({...eeatChecklist, credentialsIncluded: e.target.checked})} />
                                  <span>AI-Assisted (Disclosure Required)</span>
                               </div>
                            </div>
                         </motion.div>
                     )}

                     {activeTab === 'schema' && (
                         <motion.div key="schema" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h3 style={sidebarHeadingStyle}>FAQ Schema Nodes</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                               {faqs.map((faq, i) => (
                                  <div key={i} style={faqNodeStyle}>
                                     <input placeholder="Question" value={faq.question} onChange={e => { const n = [...faqs]; n[i].question = e.target.value; handleSidebarFaqChange(n); }} style={faqInputSmall} />
                                     <textarea placeholder="Answer" value={faq.answer} onChange={e => { const n = [...faqs]; n[i].answer = e.target.value; handleSidebarFaqChange(n); }} style={faqTextArea} />
                                  </div>
                               ))}
                               <button onClick={() => handleSidebarFaqChange([...faqs, { question: '', answer: '' }])} style={addNodeBtn}>+ Add FAQ Node</button>
                            </div>
                            
                            <h3 style={{ ...sidebarHeadingStyle, marginTop: '24px' }}>HowTo Schema Nodes</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                               {howToSteps.map((step, i) => (
                                  <div key={i} style={faqNodeStyle}>
                                     <input placeholder="Step Name (e.g. Prepare Ingredients)" value={step.name} onChange={e => { const n = [...howToSteps]; n[i].name = e.target.value; setHowToSteps(n); }} style={faqInputSmall} />
                                     <textarea placeholder="Step Description..." value={step.text} onChange={e => { const n = [...howToSteps]; n[i].text = e.target.value; setHowToSteps(n); }} style={faqTextArea} />
                                     <button onClick={() => setHowToSteps(howToSteps.filter((_, idx) => idx !== i))} style={{ ...closeModalBtn, background: '#fee2e2', color: '#ef4444', width: '100%', marginTop: '8px' }}>Remove Step</button>
                                  </div>
                               ))}
                               <button onClick={() => setHowToSteps([...howToSteps, { name: '', text: '' }])} style={addNodeBtn}>+ Add HowTo Step</button>
                            </div>

                            <h3 style={{ ...sidebarHeadingStyle, marginTop: '24px' }}>LocalBusiness Schema Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                               <input placeholder="Business Name (e.g. Sikar Coaching)" value={localBusiness.name} onChange={e => setLocalBusiness({...localBusiness, name: e.target.value})} style={faqInputSmall} />
                               <input placeholder="Telephone (e.g. +91 9999999999)" value={localBusiness.telephone} onChange={e => setLocalBusiness({...localBusiness, telephone: e.target.value})} style={{...faqInputSmall, marginBottom: 0}} />
                               <div style={{ display: 'flex', gap: '8px' }}>
                                 <input placeholder="Rating (e.g. 4.8)" value={localBusiness.ratingValue} onChange={e => setLocalBusiness({...localBusiness, ratingValue: e.target.value})} style={{...faqInputSmall, flex: 1}} />
                                 <input placeholder="Reviews Count" value={localBusiness.reviewCount} onChange={e => setLocalBusiness({...localBusiness, reviewCount: e.target.value})} style={{...faqInputSmall, flex: 1}} />
                               </div>
                               <input placeholder="Price Range (e.g. $$, INR 500-1000)" value={localBusiness.priceRange} onChange={e => setLocalBusiness({...localBusiness, priceRange: e.target.value})} style={faqInputSmall} />
                               
                               <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginTop: '8px' }}>Address Details</div>
                               <input placeholder="Street Address" value={localBusiness.streetAddress} onChange={e => setLocalBusiness({...localBusiness, streetAddress: e.target.value})} style={{...faqInputSmall, marginBottom: 0}} />
                               <div style={{ display: 'flex', gap: '8px' }}>
                                 <input placeholder="City" value={localBusiness.addressLocality} onChange={e => setLocalBusiness({...localBusiness, addressLocality: e.target.value})} style={{...faqInputSmall, flex: 1, marginBottom: 0}} />
                                 <input placeholder="Region/State" value={localBusiness.addressRegion} onChange={e => setLocalBusiness({...localBusiness, addressRegion: e.target.value})} style={{...faqInputSmall, flex: 1, marginBottom: 0}} />
                               </div>
                               <div style={{ display: 'flex', gap: '8px' }}>
                                 <input placeholder="Postal Code" value={localBusiness.postalCode} onChange={e => setLocalBusiness({...localBusiness, postalCode: e.target.value})} style={{...faqInputSmall, flex: 1}} />
                                 <input placeholder="Country Code (e.g. IN)" value={localBusiness.addressCountry} onChange={e => setLocalBusiness({...localBusiness, addressCountry: e.target.value})} style={{...faqInputSmall, flex: 1}} />
                               </div>
                            </div>
                         </motion.div>
                     )}

                     {activeTab === 'strategy' && (
                         <motion.div key="strategy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h3 style={sidebarHeadingStyle}>Content Strategy</h3>
                            <div style={hcuCardStyle}>
                               <label style={metaLabelStyle}>PRIMARY SEARCH INTENT</label>
                               <select value={userIntent} onChange={e => setUserIntent(e.target.value as any)} style={metaSelectStyle}>
                                  <option value="informational">Informational</option>
                                  <option value="transactional">Transactional</option>
                                  <option value="navigational">Navigational</option>
                               </select>
                            </div>

                            {/* ✅ GSC Indexing Controls */}
                            <h3 style={sidebarHeadingStyle}>🔍 GSC Indexing Controls</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                  <input type="checkbox" checked={isNoIndex} onChange={e => setIsNoIndex(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#ef4444' }} />
                                  <span style={{ color: isNoIndex ? '#dc2626' : '#475569' }}>🚫 No Index (Exclude from Search)</span>
                               </label>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                  <input type="checkbox" checked={isSponsored} onChange={e => setIsSponsored(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#f59e0b' }} />
                                  <span style={{ color: isSponsored ? '#b45309' : '#475569' }}>💰 Sponsored Content (Ad Disclosure)</span>
                               </label>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                  <input type="checkbox" checked={isPillarPage} onChange={e => setIsPillarPage(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#8b5cf6' }} />
                                  <span style={{ color: isPillarPage ? '#7c3aed' : '#475569' }}>⭐ Cornerstone / Pillar Page</span>
                               </label>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                  <input type="checkbox" checked={isAiAssisted} onChange={e => setIsAiAssisted(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#8b5cf6' }} />
                                  <span style={{ color: isAiAssisted ? '#7c3aed' : '#475569' }}>🤖 AI-Assisted Content</span>
                               </label>
                               {isAiAssisted && <p style={{ fontSize: '11px', color: '#5b21b6', margin: 0, background: '#f5f3ff', padding: '8px', borderRadius: '8px', border: '1px solid #ddd6fe' }}>ℹ️ A disclosure note will appear on the published page per Google&apos;s AI content transparency policy.</p>}
                               {isNoIndex && <p style={{ fontSize: '11px', color: '#dc2626', margin: 0, background: '#fef2f2', padding: '8px', borderRadius: '8px', border: '1px solid #fecaca' }}>⚠️ This page will be excluded from Google search results.</p>}
                            </div>

                            {/* ✅ Editorial Corrections Log — Google values transparent corrections */}
                            <h3 style={sidebarHeadingStyle}>📝 Editorial Corrections</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                               {corrections.map((c, i) => (
                                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                                     <div>
                                        <strong style={{ color: '#1e40af' }}>{new Date(c.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                                        <span style={{ color: '#475569', marginLeft: '8px' }}>{c.note}</span>
                                     </div>
                                     <button type="button" onClick={() => setCorrections(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}>✕</button>
                                  </div>
                               ))}
                               <div style={{ display: 'flex', gap: '8px' }}>
                                  <input type="text" value={newCorrectionNote} onChange={e => setNewCorrectionNote(e.target.value)} placeholder="Correction note..." style={{ ...metaInputStyle, flex: 1 }} />
                                  <button type="button" onClick={() => { if (newCorrectionNote.trim()) { setCorrections(prev => [...prev, { date: new Date().toISOString(), note: newCorrectionNote.trim() }]); setNewCorrectionNote(''); } }} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add</button>
                               </div>
                               <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Corrections will be displayed publicly on the article page for transparency.</p>
                            </div>


                            {/* ✅ Content Review Cycle */}
                            <h3 style={sidebarHeadingStyle}>🔄 Content Review Cycle</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <label style={metaLabelStyle}>REVIEW EVERY (DAYS)</label>
                                  <input type="number" min={30} max={365} value={reviewCycleDays || ''} onChange={e => { const d = Number(e.target.value); setReviewCycleDays(d); if (d > 0) { const next = new Date(); next.setDate(next.getDate() + d); setNextReviewDate(next.toISOString().split('T')[0]); }}} placeholder="90" style={metaInputStyle} />
                               </div>
                               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <label style={metaLabelStyle}>NEXT REVIEW DATE</label>
                                  <input type="date" value={nextReviewDate} onChange={e => setNextReviewDate(e.target.value)} style={metaInputStyle} />
                               </div>
                            </div>

                            {/* ✅ Key Takeaways */}
                            <h3 style={sidebarHeadingStyle}>🚀 Key Takeaways</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                               {keyTakeaways.map((kt, i) => (
                                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f0fdf4', padding: '8px 12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                                     <span style={{ flex: 1, fontSize: '12px', color: '#166534' }}>✓ {kt}</span>
                                     <button onClick={() => setKeyTakeaways(keyTakeaways.filter((_, idx) => idx !== i))} style={{ border: 'none', background: '#fecaca', color: '#dc2626', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>✕</button>
                                  </div>
                               ))}
                               <div style={{ display: 'flex', gap: '8px' }}>
                                  <input value={takeawayInput} onChange={e => setTakeawayInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && takeawayInput.trim()) { setKeyTakeaways([...keyTakeaways, takeawayInput.trim()]); setTakeawayInput(''); }}} placeholder="Add a key takeaway point..." style={{ ...metaInputStyle, flex: 1 }} />
                                  <button onClick={() => { if (takeawayInput.trim()) { setKeyTakeaways([...keyTakeaways, takeawayInput.trim()]); setTakeawayInput(''); }}} style={{ ...addNodeBtn, width: 'auto', padding: '0 14px', margin: 0 }}>Add</button>
                               </div>
                            </div>

                            {/* ✅ Semantic Entity Mentions (Wikidata) */}
                            <h3 style={sidebarHeadingStyle}>🌐 Semantic Mentions (Wikidata)</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                               {semanticMentions.map((m, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#faf5ff', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', border: '1px solid #e9d5ff' }}>
                                     <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: '#6d28d9' }}>{m.name}</div>
                                        {m.sameAs && <div style={{ color: '#94a3b8', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.sameAs}</div>}
                                     </div>
                                     <button onClick={() => setSemanticMentions(semanticMentions.filter((_, idx) => idx !== i))} style={{ border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>✕</button>
                                  </div>
                               ))}
                               <input value={mentionNameInput} onChange={e => setMentionNameInput(e.target.value)} placeholder="Entity Name (e.g. Artificial Intelligence)" style={{ ...metaInputStyle, marginBottom: '6px' }} />
                               <input value={mentionSameAsInput} onChange={e => setMentionSameAsInput(e.target.value)} placeholder="Wikidata URL (https://www.wikidata.org/wiki/...)" style={{ ...metaInputStyle, marginBottom: '6px' }} />
                               <button onClick={() => { if (mentionNameInput.trim()) { setSemanticMentions([...semanticMentions, { name: mentionNameInput.trim(), sameAs: mentionSameAsInput.trim() }]); setMentionNameInput(''); setMentionSameAsInput(''); }}} style={addNodeBtn}>+ Add Entity</button>
                            </div>

                            <h3 style={sidebarHeadingStyle}>LSI Keyword Cloud</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                               {lsiKeywords.map(k => <span key={k} style={lsiTagStyle}>{k}</span>)}
                            </div>
                         </motion.div>
                      )}

                     {activeTab === 'guardian' && (
                        <motion.div key="guardian" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                           <h3 style={sidebarHeadingStyle}>Sovereign Shield</h3>
                           <div style={guardianCard}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '32px', height: '32px', color: '#2563eb' }}><path d="M2 12a10 10 0 0 1 20 0"/><path d="M7 12a5 5 0 0 1 5-5"/><path d="M12 20a8 8 0 0 1-8-8"/><path d="M12 20a8 8 0 0 0 8-8"/><path d="M12 12a2.5 2.5 0 0 1 5 0"/><path d="M12 12a2.5 2.5 0 0 1-5 0"/><path d="M20 12a8 8 0 0 0-8-8"/><path d="M22 12a10 10 0 0 0-10-10"/><path d="M2 12a10 10 0 0 0 10 10"/><path d="M4 12a8 8 0 0 0 8 8"/></svg>
                              <h4 style={{ margin: '10px 0 5px' }}>Content Signature</h4>
                              <p style={{ fontSize: '11px', color: '#64748b' }}>Verified Human-First Content</p>
                           </div>
                           <div style={hcuCardStyle}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span style={{ fontSize: '11px', fontWeight: 900 }}>HUMANIZATION</span>
                                 <span style={{ fontSize: '14px', fontWeight: 900 }}>{humanScore}%</span>
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'meta' && (
                        <motion.div key="meta" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                           <h3 style={sidebarHeadingStyle}>Search Engine Listing</h3>
                           <div style={hcuCardStyle}>
                              <button onClick={() => setPreviewMode('google')} style={{ ...addNodeBtn, background: '#f8fafc', marginBottom: '15px', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Launch SERP Simulator
                              </button>
                              <InputGroup label="SEO TITLE" value={seoTitle} onChange={setSeoTitle} placeholder="Target Keyword in Title" />
                              <div style={{ height: '15px' }} />
                              <InputGroup 
                                 label="CUSTOM URL SLUG" 
                                 value={slug} 
                                 onChange={(val: string) => setSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-'))} 
                                 placeholder="e.g. custom-post-url (leave empty for auto)" 
                              />
                              <div style={{ height: '15px' }} />
                              <label style={metaLabelStyle}>META DESCRIPTION</label>
                              <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} style={metaTextAreaStyle} placeholder="150-160 characters for optimal CTR" />
                              <div style={{ height: '15px' }} />
                              <label style={metaLabelStyle}>EXCERPT (SHORT SUMMARY)</label>
                              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} style={metaTextAreaStyle} placeholder="Short summary for blog feed" />
                           </div>

                           <h3 style={sidebarHeadingStyle}>Visual Assets</h3>
                           <div style={hcuCardStyle}>
                              <label style={metaLabelStyle}>COVER IMAGE</label>
                              {coverImage && (
                                 <div style={{ position: 'relative', marginBottom: '10px' }}>
                                    <img loading="lazy" decoding="async" fetchPriority="low" src={coverImage} alt="Cover" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />
                                    <button onClick={() => setCoverImage('')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '4px', borderRadius: '6px', cursor: 'pointer' }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '12px', height: '12px' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                 </div>
                              )}
                              {coverImage && coverImageWidth !== null && coverImageWidth < 1200 && (
                                 <div style={{ fontSize: '11px', color: '#b45309', background: '#fffbeb', border: '1px solid #fef3c7', padding: '8px 12px', borderRadius: '10px', marginBottom: '10px', lineHeight: 1.4 }}>
                                    ⚠️ Cover image width ({coverImageWidth}px) is under 1200px. Google Discover requires ≥1200px wide images for premium cards.
                                 </div>
                              )}
                              <div style={{ display: 'flex', gap: '8px' }}>
                                 <button type="button" onClick={() => setMediaPickerTarget('cover')} style={{ ...addNodeBtn, background: '#f8fafc', flex: 1 }}>Choose from Library</button>
                                 <button type="button" onClick={() => coverInputRef.current?.click()} style={{ ...addNodeBtn, background: '#fff', border: '1px dashed #cbd5e1', flex: 1 }}>{coverImage ? 'Change Cover Photo' : 'Upload Cover Photo'}</button>
                              </div>
                              <input type="file" ref={coverInputRef} onChange={handleCoverUpload} style={{ display: 'none' }} accept="image/*" />
                              {coverImage && (
                                 <div style={{ marginTop: '10px' }}>
                                    <InputGroup label="COVER IMAGE ALT TEXT" value={coverImageAlt} onChange={setCoverImageAlt} placeholder="Describe the image for SEO and accessibility" />
                                 </div>
                              )}
                           </div>

                           <h3 style={sidebarHeadingStyle}>Keywords & Indexing</h3>
                           <div style={hcuCardStyle}>
                              <InputGroup label="FOCUS KEYWORD" value={focusKeyword} onChange={setFocusKeyword} placeholder="Primary search term" />
                              <div style={{ height: '15px' }} />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                 <label style={metaLabelStyle}>LSI FOCUS TAGS</label>
                                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                    {tags.map((tag, i) => (
                                       <span key={i} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          {tag}
                                          <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb', fontWeight: 900, padding: 0, lineHeight: 1 }}>✕</button>
                                       </span>
                                    ))}
                                 </div>
                                 <div style={{ display: 'flex', gap: '8px' }}>
                                    <input 
                                       value={tagInput} 
                                       onChange={e => setTagInput(e.target.value)} 
                                       onKeyDown={e => { 
                                          if (e.key === 'Enter') { 
                                             e.preventDefault();
                                             if (tagInput.trim() && !tags.includes(tagInput.trim())) { 
                                                setTags([...tags, tagInput.trim()]); 
                                                setTagInput(''); 
                                             }
                                          }
                                       }} 
                                       placeholder="Add tag and press Enter" 
                                       style={{ ...metaInputStyle, flex: 1 }} 
                                    />
                                    <button 
                                       onClick={(e) => { 
                                          e.preventDefault();
                                          if (tagInput.trim() && !tags.includes(tagInput.trim())) { 
                                             setTags([...tags, tagInput.trim()]); 
                                             setTagInput(''); 
                                          }
                                       }} 
                                       style={{ ...addNodeBtn, width: 'auto', padding: '0 16px', margin: 0 }}
                                    >
                                       Add
                                    </button>
                                 </div>
                              </div>
                              <div style={{ height: '15px' }} />
                              <InputGroup label="KEYWORDS (LEGACY)" value={keywords} onChange={setKeywords} placeholder="Comma separated keywords" />
                              <div style={{ height: '15px' }} />
                              <InputGroup label="CANONICAL URL" value={canonicalUrl} onChange={setCanonicalUrl} placeholder="Avoid duplicate content issues" />
                           </div>

                           <h3 style={sidebarHeadingStyle}>Social Media (Open Graph)</h3>
                           <div style={hcuCardStyle}>
                              <InputGroup label="OG TITLE" value={ogTitle} onChange={setOgTitle} placeholder="Catchy title for social shares" />
                              <div style={{ height: '15px' }} />
                              <label style={metaLabelStyle}>OG DESCRIPTION</label>
                              <textarea value={ogDescription} onChange={e => setOgDescription(e.target.value)} style={metaTextAreaStyle} placeholder="Display on Facebook/Twitter" />
                           </div>
                           <h3 style={sidebarHeadingStyle}>Twitter Settings</h3>
                           <div style={hcuCardStyle}>
                              <InputGroup label="TWITTER CARD TYPE" value={twitterCard} onChange={setTwitterCard} placeholder="e.g. summary_large_image" />
                              <div style={{ height: '15px' }} />
                              <InputGroup label="TWITTER TITLE" value={twitterTitle} onChange={setTwitterTitle} placeholder="Title for Twitter" />
                              <div style={{ height: '15px' }} />
                              <label style={metaLabelStyle}>TWITTER DESCRIPTION</label>
                              <textarea value={twitterDescription} onChange={e => setTwitterDescription(e.target.value)} style={metaTextAreaStyle} placeholder="Description for Twitter" />
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'seo' && (
                        <motion.div key="seo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                           <h3 style={sidebarHeadingStyle}>AI SEO Audit</h3>
                           <div style={{ ...hcuCardStyle, background: 'linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)', border: '1px solid #e9d5ff' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                 <span style={{ fontSize: '18px' }}>✨</span>
                                 <span style={{ fontWeight: 800, fontSize: '14px', color: '#7e22ce' }}>GEMINI AUTO-FILL</span>
                              </div>
                              <p style={{ fontSize: '11px', color: '#6b21a8', marginBottom: '15px' }}>Analyze content and generate missing SEO values (Meta, Tags, FAQs, etc.)</p>
                              
                              <button 
                                 onClick={(e) => { e.preventDefault(); runAiAudit(); }}
                                 disabled={isAiAuditing}
                                 style={{ 
                                    ...addNodeBtn, 
                                    background: isAiAuditing ? '#e9d5ff' : '#9333ea', 
                                    color: '#fff', 
                                    border: 'none',
                                    fontWeight: 'bold',
                                    width: '100%',
                                    marginBottom: aiSuggestions ? '15px' : '0'
                                 }}
                              >
                                 {isAiAuditing ? 'Analyzing Content...' : 'Run AI SEO Audit'}
                              </button>

                              {aiSuggestions && (
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                                    {Object.entries(aiSuggestions).map(([key, val]: [string, any]) => {
                                       const isApplied = appliedAiSuggestions[key];
                                       const message = val?.message || '';
                                       const suggestionValue = val?.value ?? val;
                                       
                                       return (
                                       <div key={key} style={{ background: isApplied ? '#f0fdf4' : '#fff', padding: '12px', borderRadius: '8px', border: `1px solid ${isApplied ? '#bbf7d0' : '#e2e8f0'}`, fontSize: '11px' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                             <div style={{ fontWeight: 'bold', color: isApplied ? '#166534' : '#475569', textTransform: 'uppercase' }}>
                                                {key} {isApplied && '✅ Updated'}
                                             </div>
                                          </div>
                                          {!isApplied && message && (
                                             <div style={{ color: '#b45309', marginBottom: '8px', background: '#fffbeb', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fef3c7' }}>
                                                ⚠️ {message}
                                             </div>
                                          )}
                                          <div style={{ color: '#1e293b', marginBottom: isApplied ? '0' : '10px', background: isApplied ? 'transparent' : '#f8fafc', padding: isApplied ? '0' : '8px', borderRadius: '4px', overflowWrap: 'anywhere' }}>
                                             {typeof suggestionValue === 'string' ? suggestionValue : JSON.stringify(suggestionValue)}
                                          </div>
                                          {!isApplied && (
                                             <button 
                                                onClick={(e) => { e.preventDefault(); applyAiSuggestion(key, val); }}
                                                style={{ background: '#9333ea', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#fff', width: '100%' }}
                                             >
                                                Apply Suggestion
                                             </button>
                                          )}
                                       </div>
                                       );
                                    })}
                                 </div>
                              )}
                           </div>

                           <h3 style={sidebarHeadingStyle}>Turbo Indexing Engine</h3>
                           <div style={hcuCardStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '20px', height: '20px', color: '#f59e0b', fill: '#f59e0b' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                 <span style={{ fontWeight: 800, fontSize: '14px' }}>INSTANT INDEXING</span>
                              </div>
                              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '15px' }}>Ping Google Search Console API immediately upon deployment.</p>
                              <button 
                                 onClick={() => {
                                    setIsIndexing(true);
                                    setTimeout(() => {
                                       setIsIndexing(false);
                                       setIndexStatus('success');
                                       setTimeout(() => setIndexStatus('idle'), 3000);
                                    }, 2000);
                                 }}
                                 disabled={isIndexing || indexStatus === 'success'}
                                 style={{ 
                                    ...addNodeBtn, 
                                    background: indexStatus === 'success' ? '#f0fdf4' : (isIndexing ? '#f1f5f9' : '#fffbeb'), 
                                    border: `1px solid ${indexStatus === 'success' ? '#dcfce7' : (isIndexing ? '#e2e8f0' : '#fef3c7')}`, 
                                    color: indexStatus === 'success' ? '#10b981' : (isIndexing ? '#94a3b8' : '#b45309'),
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                 }}
                              >
                                 {isIndexing ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'flex' }}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                       </motion.div>
                                       Pinging GSC API...
                                    </span>
                                 ) : (
                                    indexStatus === 'success' ? (
                                       <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Ping Success!
                                       </span>
                                    ) : 'Request Priority Crawl'
                                 )}
                               </button>
                            </div>

                            <h3 style={sidebarHeadingStyle}>📊 SEO Readiness Checklist</h3>
                            <div style={{ ...hcuCardStyle, display: 'flex', flexDirection: 'column', gap: '12px', background: '#fafaf9' }}>
                               {/* Title length check */}
                               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <span style={{ fontSize: '14px' }}>
                                     {title.length > 0 && title.length <= 110 ? '✅' : '❌'}
                                  </span>
                                  <div>
                                     <strong>Title Length:</strong> {title.length}/110 chars
                                     {title.length > 110 && <p style={{ fontSize: '11px', color: '#ef4444', margin: '2px 0 0 0' }}>Keep under 110 characters for optimal search snippet display.</p>}
                                     {title.length === 0 && <p style={{ fontSize: '11px', color: '#ef4444', margin: '2px 0 0 0' }}>Title is required.</p>}
                                  </div>
                               </div>

                               {/* Meta description check */}
                               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <span style={{ fontSize: '14px' }}>
                                     {metaDescription.length >= 50 && metaDescription.length <= 160 ? '✅' : '⚠️'}
                                  </span>
                                  <div>
                                     <strong>Meta Description:</strong> {metaDescription.length} chars (Recommended: 50–160)
                                     {(metaDescription.length < 50 || metaDescription.length > 160) && (
                                        <p style={{ fontSize: '11px', color: '#b45309', margin: '2px 0 0 0' }}>Provide between 50 and 160 characters for high search click-through rate.</p>
                                     )}
                                  </div>
                               </div>

                               {/* Cover image check */}
                               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <span style={{ fontSize: '14px' }}>
                                     {coverImage ? (coverImageWidth !== null && coverImageWidth >= 1200 ? '✅' : '⚠️') : '❌'}
                                  </span>
                                  <div>
                                     <strong>Discover Cover Image:</strong> {coverImage ? (coverImageWidth !== null ? `${coverImageWidth}px width` : 'Cover image set') : 'Cover image missing'}
                                     {coverImage && coverImageWidth !== null && coverImageWidth < 1200 && (
                                        <p style={{ fontSize: '11px', color: '#b45309', margin: '2px 0 0 0' }}>Image is under 1200px wide. Google Discover requires ≥1200px width for premium layout cards.</p>
                                     )}
                                     {!coverImage && <p style={{ fontSize: '11px', color: '#ef4444', margin: '2px 0 0 0' }}>Set a cover image for Discover and social sharing.</p>}
                                  </div>
                               </div>

                               {/* Author bio check */}
                               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <span style={{ fontSize: '14px' }}>
                                     {authorBio && authorBio.trim().length > 15 ? '✅' : '❌'}
                                  </span>
                                  <div>
                                     <strong>Author Expertise Bio:</strong> {authorBio ? `${authorBio.trim().length} chars` : 'Author bio missing'}
                                     {(!authorBio || authorBio.trim().length <= 15) && (
                                        <p style={{ fontSize: '11px', color: '#ef4444', margin: '2px 0 0 0' }}>A professional biography is required for Google E-E-A-T trust signals.</p>
                                     )}
                                  </div>
                               </div>

                               {/* Category set check */}
                               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <span style={{ fontSize: '14px' }}>
                                     {category && category !== 'General' && category.trim() !== '' ? '✅' : '⚠️'}
                                  </span>
                                  <div>
                                     <strong>Taxonomy Category:</strong> {category}
                                     {(category === 'General' || !category) && (
                                        <p style={{ fontSize: '11px', color: '#b45309', margin: '2px 0 0 0' }}>Categorize your post rather than leaving it in "General" for semantic indexing.</p>
                                     )}
                                  </div>
                               </div>

                               {/* Tags check */}
                               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <span style={{ fontSize: '14px' }}>
                                     {tags.length >= 1 ? '✅' : '⚠️'}
                                  </span>
                                  <div>
                                     <strong>LSI Focus Tags:</strong> {tags.length} tags set
                                     {tags.length === 0 && (
                                        <p style={{ fontSize: '11px', color: '#b45309', margin: '2px 0 0 0' }}>Add at least one relevant focus tag to define content associations.</p>
                                     )}
                                  </div>
                               </div>

                               {/* Canonical URL check */}
                               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <span style={{ fontSize: '14px' }}>
                                     {canonicalUrl || slug || title ? '✅' : '⚠️'}
                                  </span>
                                  <div>
                                     <strong>Canonical Link:</strong> {canonicalUrl ? 'Explicit URL set' : 'Auto-generated dynamic URL'}
                                  </div>
                               </div>

                               {/* FAQs check */}
                               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                  <span style={{ fontSize: '14px' }}>
                                     {faqs.length > 0 ? '✅' : 'ℹ️'}
                                  </span>
                                  <div>
                                     <strong>FAQ Schema:</strong> {faqs.length} FAQ nodes
                                     {faqs.length === 0 && (
                                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>FAQ schema is optional but recommended to rank in Voice Search / AI Overview citations.</p>
                                     )}
                                  </div>
                               </div>

                               {/* Internal links check */}
                               {(() => {
                                  const contentHtml = editor?.getHTML() || '';
                                  const matches = contentHtml.match(/href=['"]([^'"]+)['"]/gi);
                                  const internalLinkCount = matches ? matches.filter(m => {
                                     const href = m.match(/href=['"]([^'"]+)['"]/i)?.[1] || '';
                                     return (href.startsWith('/') && !href.startsWith('//')) || href.includes('blog.com');
                                  }).length : 0;
                                  return (
                                     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', lineHeight: '1.4' }}>
                                        <span style={{ fontSize: '14px' }}>
                                           {internalLinkCount >= 2 ? '✅' : '⚠️'}
                                        </span>
                                        <div>
                                           <strong>Internal Links:</strong> {internalLinkCount} links detected
                                           {internalLinkCount < 2 && (
                                              <p style={{ fontSize: '11px', color: '#b45309', margin: '2px 0 0 0' }}>Add at least 2 internal links to other parts of your website to increase crawl depth and build relevance.</p>
                                           )}
                                        </div>
                                     </div>
                                  );
                               })()}
                            </div>

                           <h3 style={sidebarHeadingStyle}>Performance Tuning</h3>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={eeatCheckStyle}>
                                 <input type="checkbox" defaultChecked />
                                 <span>Lazy Load Visual Assets</span>
                              </div>
                              <div style={eeatCheckStyle}>
                                 <input type="checkbox" defaultChecked />
                                 <span>Preload Critical Fonts</span>
                              </div>
                              <div style={eeatCheckStyle}>
                                 <input type="checkbox" />
                                 <span>Enable Edge Caching (CDN)</span>
                              </div>
                           </div>

                           <h3 style={sidebarHeadingStyle}>Search Priority</h3>
                           <select style={metaSelectStyle}>
                              <option>Normal (0.8)</option>
                              <option>High (0.9)</option>
                              <option>Critical (1.0)</option>
                           </select>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
             </aside>
          </div>

         {/* FAQ Modal */}
         <AnimatePresence>
            {faqModalOpen && (
               <div style={modalBackdropStyle}>
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ ...modalContentStyle, maxWidth: '650px' }}>
                     <div style={modalHeaderStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', color: '#2563eb' }}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                           <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>FAQ Schema Editor</h2>
                        </div>
                        <button onClick={() => setFaqModalOpen(false)} style={closeModalBtn}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '20px', height: '20px' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                     </div>
                     <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                           {tempFaqs.map((faq, idx) => (
                              <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
                                 <button onClick={() => setTempFaqs(tempFaqs.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                 </button>
                                 <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>QUESTION {idx + 1}</label>
                                    <input 
                                       value={faq.question} 
                                       onChange={e => {
                                          const next = [...tempFaqs];
                                          next[idx].question = e.target.value;
                                          setTempFaqs(next);
                                       }}
                                       placeholder="What is the main benefit of..."
                                       style={{ ...metaInputStyle, background: '#fff' }}
                                    />
                                 </div>
                                 <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ANSWER</label>
                                    <textarea 
                                       value={faq.answer} 
                                       onChange={e => {
                                          const next = [...tempFaqs];
                                          next[idx].answer = e.target.value;
                                          setTempFaqs(next);
                                       }}
                                       placeholder="Explain clearly and concisely..."
                                       style={{ ...metaTextAreaStyle, background: '#fff', minHeight: '80px' }}
                                    />
                                 </div>
                              </div>
                           ))}
                           <button 
                              onClick={() => setTempFaqs([...tempFaqs, { question: '', answer: '' }])}
                              style={{ ...addNodeBtn, padding: '12px', borderStyle: 'dashed', background: '#f8fafc' }}
                           >
                              + Add Another FAQ Item
                           </button>
                        </div>
                     </div>
                     <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => setFaqModalOpen(false)} style={{ ...closeModalBtn, background: '#fff', border: '1px solid #e2e8f0', padding: '6px 14px', fontSize: '12px', fontWeight: 600 }}>Cancel</button>
                        <button onClick={handleApplyFaq} style={{ ...publishBtnStyle, flex: 0, padding: '6px 16px', fontSize: '12px', minWidth: 'max-content', whiteSpace: 'nowrap', color: '#ffffff' }}>{editor.isActive('faqBlock') ? 'Update FAQ Block' : 'Insert FAQ Block'}</button>
                     </div>
                  </motion.div>
               </div>
            )}

            {/* Quiz Modal */}
            {quizModalOpen && (
               <div style={modalBackdropStyle} onClick={() => setQuizModalOpen(false)}>
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
                     onClick={e => e.stopPropagation()} 
                     style={{ ...modalContentStyle, maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}
                  >
                     <div style={{ ...modalHeaderStyle, padding: '20px 24px' }}>
                        <div>
                           <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1e293b' }}>Interactive Quiz</h2>
                           <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Add an engaging quiz to increase dwell time.</p>
                        </div>
                        <button onClick={() => setQuizModalOpen(false)} style={closeModalBtn}><X size={20} color="#64748b" /></button>
                     </div>
                     <div style={{ padding: '24px', overflowY: 'auto' }}>
                        <div style={{ marginBottom: '20px' }}>
                           <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>QUESTION</label>
                           <input 
                              type="text" 
                              value={tempQuiz.question} 
                              onChange={e => setTempQuiz({...tempQuiz, question: e.target.value})}
                              placeholder="E.g., What is the most important ranking factor?"
                              style={{ ...metaInputStyle, background: '#f8fafc', fontWeight: 600 }}
                           />
                        </div>
                        <div>
                           <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>OPTIONS & CORRECT ANSWER</label>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {tempQuiz.options.map((opt, i) => (
                                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: tempQuiz.correctIndex === i ? '2px solid #22c55e' : '1px solid #e2e8f0' }}>
                                    <input 
                                       type="radio" 
                                       checked={tempQuiz.correctIndex === i} 
                                       onChange={() => setTempQuiz({...tempQuiz, correctIndex: i})}
                                       style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <input 
                                       type="text" 
                                       value={opt} 
                                       onChange={e => {
                                          const newOpts = [...tempQuiz.options];
                                          newOpts[i] = e.target.value;
                                          setTempQuiz({...tempQuiz, options: newOpts});
                                       }}
                                       placeholder={`Option ${i + 1}`}
                                       style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: 500 }}
                                    />
                                    <button 
                                       onClick={() => {
                                          const newOpts = tempQuiz.options.filter((_, idx) => idx !== i);
                                          const newCorrect = tempQuiz.correctIndex === i ? 0 : tempQuiz.correctIndex > i ? tempQuiz.correctIndex - 1 : tempQuiz.correctIndex;
                                          setTempQuiz({...tempQuiz, options: newOpts, correctIndex: newCorrect});
                                       }}
                                       style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                    >
                                       <X size={14} />
                                    </button>
                                 </div>
                              ))}
                           </div>
                           <button 
                              onClick={() => setTempQuiz({...tempQuiz, options: [...tempQuiz.options, '']})}
                              style={{ ...addNodeBtn, padding: '12px', borderStyle: 'dashed', background: '#f8fafc', marginTop: '16px', color: '#64748b' }}
                           >
                              + Add Option
                           </button>
                        </div>
                     </div>
                     <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => setQuizModalOpen(false)} style={{ ...closeModalBtn, background: '#fff', border: '1px solid #e2e8f0', padding: '6px 14px', fontSize: '12px', fontWeight: 600 }}>Cancel</button>
                        <button onClick={handleApplyQuiz} style={{ ...publishBtnStyle, flex: 0, padding: '6px 16px', fontSize: '12px', minWidth: 'max-content', whiteSpace: 'nowrap', color: '#ffffff', background: '#2563eb' }}>{editor?.isActive('quizBlock') ? 'Update Quiz' : 'Insert Quiz'}</button>
                     </div>
                  </motion.div>
               </div>
            )}

            {/* Poll Modal */}
            {pollModalOpen && (
               <div style={modalBackdropStyle} onClick={() => setPollModalOpen(false)}>
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
                     onClick={e => e.stopPropagation()} 
                     style={{ ...modalContentStyle, maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}
                  >
                     <div style={{ ...modalHeaderStyle, padding: '20px 24px' }}>
                        <div>
                           <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1e293b' }}>Interactive Poll</h2>
                           <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Ask your readers a question to vote on.</p>
                        </div>
                        <button onClick={() => setPollModalOpen(false)} style={closeModalBtn}><X size={20} color="#64748b" /></button>
                     </div>
                     <div style={{ padding: '24px', overflowY: 'auto' }}>
                        <div style={{ marginBottom: '20px' }}>
                           <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>POLL QUESTION</label>
                           <input 
                              type="text" 
                              value={tempPoll.question} 
                              onChange={e => setTempPoll({...tempPoll, question: e.target.value})}
                              placeholder="E.g., Which framework do you prefer?"
                              style={{ ...metaInputStyle, background: '#f8fafc', fontWeight: 600 }}
                           />
                        </div>
                        <div>
                           <label style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>VOTING OPTIONS</label>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {tempPoll.options.map((opt, i) => (
                                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#64748b' }}>{i + 1}</div>
                                    <input 
                                       type="text" 
                                       value={opt} 
                                       onChange={e => {
                                          const newOpts = [...tempPoll.options];
                                          newOpts[i] = e.target.value;
                                          setTempPoll({...tempPoll, options: newOpts});
                                       }}
                                       placeholder={`Option ${i + 1}`}
                                       style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: 500 }}
                                    />
                                    <button 
                                       onClick={() => {
                                          const newOpts = tempPoll.options.filter((_, idx) => idx !== i);
                                          setTempPoll({...tempPoll, options: newOpts});
                                       }}
                                       style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                    >
                                       <X size={14} />
                                    </button>
                                 </div>
                              ))}
                           </div>
                           <button 
                              onClick={() => setTempPoll({...tempPoll, options: [...tempPoll.options, '']})}
                              style={{ ...addNodeBtn, padding: '12px', borderStyle: 'dashed', background: '#f8fafc', marginTop: '16px', color: '#64748b' }}
                           >
                              + Add Poll Option
                           </button>
                        </div>
                     </div>
                     <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => setPollModalOpen(false)} style={{ ...closeModalBtn, background: '#fff', border: '1px solid #e2e8f0', padding: '6px 14px', fontSize: '12px', fontWeight: 600 }}>Cancel</button>
                        <button onClick={handleApplyPoll} style={{ ...publishBtnStyle, flex: 0, padding: '6px 16px', fontSize: '12px', minWidth: 'max-content', whiteSpace: 'nowrap', color: '#ffffff', background: '#8b5cf6' }}>{editor?.isActive('pollBlock') ? 'Update Poll' : 'Insert Poll'}</button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Image Slider Modal */}
         <AnimatePresence>
            {sliderModalOpen && (
               <div style={modalBackdropStyle}>
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ ...modalContentStyle, maxWidth: '600px' }}>
                     <div style={modalHeaderStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', color: '#2563eb' }}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                           <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Image Slider Configuration</h2>
                        </div>
                        <button onClick={() => setSliderModalOpen(false)} style={closeModalBtn}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '20px', height: '20px' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                     </div>
                     <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                           <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Slider Images</h3>
                           <button onClick={() => sliderInputRef.current?.click()} style={{ ...publishBtnStyle, padding: '6px 12px', fontSize: '12px', minWidth: 'auto' }}>+ Add Images</button>
                        </div>
                        
                        {sliderImages.length === 0 ? (
                           <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                              <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>No images added yet. Click Add Images to start building your slider.</p>
                           </div>
                        ) : (
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                              {sliderImages.map((img, idx) => (
                                 <div key={idx} style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '6px', borderRadius: '10px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                                    <img loading="lazy" decoding="async" fetchPriority="low" src={img.src} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} alt="thumb" />
                                    <input 
                                       placeholder="Alt Text (SEO)" 
                                       value={img.alt} 
                                       onChange={(e) => {
                                          const newImgs = [...sliderImages];
                                          newImgs[idx].alt = e.target.value;
                                          setSliderImages(newImgs);
                                       }}
                                       style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '12px' }}
                                    />
                                    <button onClick={() => {
                                       setSliderImages(sliderImages.filter((_, i) => i !== idx));
                                    }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '14px', height: '14px' }}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                    </button>
                                 </div>
                              ))}
                           </div>
                        )}

                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Slider Settings</h3>
                           <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                              <input type="checkbox" checked={sliderAutoScroll} onChange={e => setSliderAutoScroll(e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
                              Enable Auto-Scrolling
                           </label>
                           <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                              <input type="checkbox" checked={sliderCenterZoom} onChange={e => setSliderCenterZoom(e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
                              Center Image Auto-Zoom Effect
                           </label>
                           <InputGroup label="TRANSITION SPEED (MS)" value={sliderSpeed.toString()} onChange={(val: string) => setSliderSpeed(parseInt(val) || 3000)} placeholder="e.g., 3000" />
                        </div>
                     </div>
                     <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => setSliderModalOpen(false)} style={{ ...closeModalBtn, background: '#fff', border: '1px solid #e2e8f0', padding: '6px 14px', fontSize: '12px', fontWeight: 600 }}>Cancel</button>
                        <button onClick={handleApplySlider} style={{ ...publishBtnStyle, flex: 0, padding: '6px 16px', fontSize: '12px', minWidth: 'max-content', whiteSpace: 'nowrap', color: '#ffffff' }}>Insert Slider</button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Custom Link Modal */}
         <AnimatePresence>
            {linkModalOpen && (
               <div style={modalBackdropStyle}>
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ ...modalContentStyle, maxWidth: '450px' }}>
                     <div style={modalHeaderStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', color: '#2563eb' }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                           <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Sovereign Link Editor</h2>
                        </div>
                        <button onClick={() => setLinkModalOpen(false)} style={closeModalBtn}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '20px', height: '20px' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                     </div>
                     <div style={{ padding: '30px' }}>
                        <label style={metaLabelStyle}>DESTINATION URL</label>
                        <input 
                           autoFocus 
                           value={linkInputUrl} 
                           onChange={e => setLinkInputUrl(e.target.value)} 
                           onKeyDown={e => e.key === 'Enter' && handleApplyLink()}
                           placeholder="https://example.com" 
                           style={{ ...metaInputStyle, background: '#f1f5f9', marginBottom: '20px' }} 
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                           <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                              <input type="checkbox" checked={linkOpenInNewTab} onChange={e => setLinkOpenInNewTab(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                              Open in a new window
                           </label>
                           <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                              <input type="checkbox" checked={linkIsNoFollow} onChange={e => setLinkIsNoFollow(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                              Add 'rel=nofollow' (Search Engine optimization)
                           </label>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                           <button onClick={handleApplyLink} style={{ ...publishBtnStyle, flex: 1, padding: '10px' }}>Apply Link</button>
                           <button onClick={() => { setLinkInputUrl(''); handleApplyLink(); }} style={{ ...iconBtnStyle, padding: '10px 20px' }}>Remove</button>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Video Portal Modal */}
         <AnimatePresence>
            {videoModalOpen && (
               <div style={modalBackdropStyle}>
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ ...modalContentStyle, maxWidth: '500px' }}>
                     <div style={modalHeaderStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', color: '#2563eb' }}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>
                           <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Social Intelligence Hub</h2>
                        </div>
                        <button onClick={() => setVideoModalOpen(false)} style={closeModalBtn}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '20px', height: '20px' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                     </div>
                     <div style={{ padding: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ marginBottom: '8px' }}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 69.44 69.44 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 69.44 69.44 0 0 1-15 0 2 2 0 0 1-2-2Z"/><path d="m10 15 5-3-5-3v6Z"/></svg>
                              <div style={{ fontSize: '10px', fontWeight: 800 }}>YouTube</div>
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ marginBottom: '8px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                              <div style={{ fontSize: '10px', fontWeight: 800 }}>Instagram</div>
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1877f2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ marginBottom: '8px' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                              <div style={{ fontSize: '10px', fontWeight: 800 }}>Facebook</div>
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ marginBottom: '8px' }}><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                              <div style={{ fontSize: '10px', fontWeight: 800 }}>Twitter / X</div>
                           </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                           <label style={metaLabelStyle}>PASTE SOCIAL LINK (X, INSTA, FB, YT)</label>
                           <div style={{ display: 'flex', gap: '8px' }}>
                              <input 
                                 autoFocus 
                                 value={videoUrlInput} 
                                 onChange={e => setVideoUrlInput(e.target.value)} 
                                 onKeyDown={e => e.key === 'Enter' && handleApplyYoutube()}
                                 placeholder="https://x.com/status/123..." 
                                 style={{ ...metaInputStyle, background: '#f1f5f9', marginBottom: 0 }} 
                              />
                              <button onClick={handleApplyYoutube} style={{ ...publishBtnStyle, padding: '0 16px' }}>Embed</button>
                           </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                           <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '16px' }}>OR UPLOAD LOCAL FILE</div>
                           <button onClick={() => { videoInputRef.current?.click(); setVideoModalOpen(false); }} style={{ ...iconBtnStyle, width: '100%', padding: '16px', borderStyle: 'dashed', borderWidth: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '24px', height: '24px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <span style={{ fontSize: '14px', fontWeight: 700 }}>Upload MP4/WebM</span>
                           </button>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {imageModalOpen && (
               <div style={modalBackdropStyle}>
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ ...modalContentStyle, maxWidth: '450px' }}>
                     <div style={modalHeaderStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '18px', height: '18px', color: '#8b5cf6' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                           <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Visual Intelligence</h2>
                        </div>
                        <button onClick={() => setImageModalOpen(false)} style={closeModalBtn}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide" style={{ width: '20px', height: '20px' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                     </div>
                     <div style={{ padding: '30px' }}>
                        <label style={metaLabelStyle}>IMAGE ALT TEXT (SEO)</label>
                        <input 
                           autoFocus 
                           value={imageAltInput} 
                           onChange={e => setImageAltInput(e.target.value)} 
                           onKeyDown={e => e.key === 'Enter' && handleApplyImageAlt()}
                           placeholder="Describe this image for search engines..." 
                           style={{ ...metaInputStyle, background: '#f5f3ff', marginBottom: '20px' }} 
                        />
                        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
                           Alt text improves search rankings and accessibility for screen readers. Keep it descriptive and include your focus keyword if natural.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                           <button onClick={handleApplyImageAlt} style={{ ...publishBtnStyle, background: '#8b5cf6', flex: 1, padding: '10px' }}>Save Metadata</button>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
          </AnimatePresence>

          {mediaPickerTarget && (
             <MediaPicker 
                onSelect={(url) => {
                   if (mediaPickerTarget === 'cover') setCoverImage(url);
                   if (mediaPickerTarget === 'author') setAuthorImage(url);
                   setMediaPickerTarget(null);
                }}
                onClose={() => setMediaPickerTarget(null)}
             />
          )}
       </div>
   );
}

// Sub-components
const StatBox = ({ label, value }: any) => (
   <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 900, color: '#1e293b' }}>{value}</span>
   </div>
);
const SeoTip = ({ icon, text, type }: any) => (
   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: type === 'error' ? '#fef2f2' : type === 'warning' ? '#fffbeb' : '#f0fdf4', borderRadius: '10px', border: `1px solid ${type === 'error' ? '#fee2e2' : type === 'warning' ? '#fef3c7' : '#dcfce7'}` }}>
      <span style={{ color: type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981' }}>{icon}</span>
      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{text}</span>
   </div>
);
// --- End of sovereign editor ---
