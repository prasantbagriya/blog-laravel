import React, { useCallback } from 'react';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Video,
    Heading1, Heading2, Quote, Table as TableIcon
} from 'lucide-react';


const ToolbarButton = ({ onClick, disabled, isActive, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded transition-colors flex items-center justify-center border-0 outline-none focus:outline-none focus:ring-0 ${
            isActive 
            ? 'bg-[#E2E2E2] dark:bg-zinc-700 text-[#1C1C1C] dark:text-zinc-100' 
            : 'text-[#878A8C] dark:text-zinc-400 hover:bg-[#E2E2E2] dark:hover:bg-zinc-700 hover:text-[#1C1C1C] dark:hover:text-zinc-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={title}
    >
        {children}
    </button>
);

const MenuBar = ({ editor, onOpenImageModal, onOpenVideoModal, onOpenLinkModal }) => {
    if (!editor) {
        return null;
    }

    const addImage = useCallback(() => {
        const url = window.prompt('URL of the image');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addVideo = useCallback(() => {
        onOpenVideoModal();
    }, [onOpenVideoModal]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        onOpenLinkModal(previousUrl || '');
    }, [editor, onOpenLinkModal]);

    const Divider = () => <div className="w-[1px] h-6 bg-gray-200 dark:bg-zinc-700 mx-1.5 hidden sm:block"></div>;

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-[#F6F7F8] dark:bg-zinc-800 border-b border-[#EDEFF1] dark:border-zinc-700">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
            >
                <Bold size={18} strokeWidth={editor.isActive('bold') ? 2.5 : 2} />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
            >
                <Italic size={18} strokeWidth={editor.isActive('italic') ? 2.5 : 2} />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline"
            >
                <UnderlineIcon size={18} strokeWidth={editor.isActive('underline') ? 2.5 : 2} />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="Strikethrough"
            >
                <Strikethrough size={18} strokeWidth={editor.isActive('strike') ? 2.5 : 2} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <Heading1 size={18} />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="Align Left"
            >
                <AlignLeft size={18} />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="Align Center"
            >
                <AlignCenter size={18} />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="Align Right"
            >
                <AlignRight size={18} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
            >
                <List size={18} />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numbered List"
            >
                <ListOrdered size={18} />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Quote"
            >
                <Quote size={18} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                onClick={setLink}
                isActive={editor.isActive('link')}
                title="Link"
            >
                <LinkIcon size={18} />
            </ToolbarButton>
            
            <ToolbarButton onClick={onOpenImageModal} title="Upload Image">
                <ImageIcon size={18} />
            </ToolbarButton>
            
            <ToolbarButton onClick={addVideo} title="YouTube Video">
                <Video size={18} />
            </ToolbarButton>
            
            <Divider />

            <ToolbarButton
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                title="Insert Table"
            >
                <TableIcon size={18} />
            </ToolbarButton>
        </div>
    );
};

export default function TipTapEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#0079D3] hover:underline',
                    rel: 'ugc nofollow',
                    target: '_blank'
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full rounded-md mt-4 mb-4 bg-gray-50',
                    loading: 'lazy',
                    decoding: 'async'
                },
            }),
            Youtube.configure({
                controls: true,
                nocookie: true,
                HTMLAttributes: {
                    class: 'w-full aspect-video rounded-md mt-4 mb-4',
                },
            }),
            Placeholder.configure({
                placeholder: 'Text (optional)',
                emptyEditorClass: 'is-editor-empty',
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'w-full mb-4 border-collapse table-auto',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose max-w-none prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4 text-[#1C1C1C] dark:text-zinc-200 dark:prose-invert editor-content',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // If it's just an empty paragraph, send empty string
            if (html === '<p></p>' || html === '') {
                onChange('');
            } else {
                onChange(html);
            }
        },
    });

    const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
    const [imageFile, setImageFile] = React.useState(null);
    const [imageAlt, setImageAlt] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
    const [videoUrl, setVideoUrl] = React.useState('');

    const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);
    const [linkUrl, setLinkUrl] = React.useState('');

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!imageFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: formData
            });
            const data = await res.json();
            
            if (data.success && editor) {
                editor.chain().focus().setImage({ src: data.url, alt: imageAlt }).run();
                setIsImageModalOpen(false);
                setImageFile(null);
                setImageAlt('');
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleVideoSubmit = (e) => {
        e.preventDefault();
        if (videoUrl.trim()) {
            editor.chain().focus().setYoutubeVideo({ src: videoUrl.trim() }).run();
        }
        setIsVideoModalOpen(false);
        setVideoUrl('');
    };

    const handleLinkSubmit = (e) => {
        e.preventDefault();
        const url = linkUrl;
        if (url.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            let finalUrl = url.trim();
            if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl) && !/^tel:/i.test(finalUrl)) {
                finalUrl = 'https://' + finalUrl;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
        }
        setIsLinkModalOpen(false);
        setLinkUrl('');
    };

    return (
        <div className="border border-[#EDEFF1] dark:border-zinc-700 focus-within:border-[#1C1C1C] dark:focus-within:border-zinc-500 rounded-md overflow-hidden bg-white dark:bg-zinc-900 transition-colors relative">
            <MenuBar 
                editor={editor} 
                onOpenImageModal={() => setIsImageModalOpen(true)} 
                onOpenVideoModal={() => setIsVideoModalOpen(true)}
                onOpenLinkModal={(prevUrl) => { setLinkUrl(prevUrl); setIsLinkModalOpen(true); }}
            />
            <EditorContent editor={editor} />
            
            {/* Video Modal */}
            {isVideoModalOpen && (
                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Add YouTube Video</h3>
                            <button onClick={() => setIsVideoModalOpen(false)} className="text-gray-400 hover:text-gray-500">&times;</button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">YouTube Video URL</label>
                                <input 
                                    type="url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleVideoSubmit(e);
                                        }
                                    }}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="block w-full px-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsVideoModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleVideoSubmit}
                                    className="px-5 py-2.5 rounded-full text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all shadow-lg shadow-amber-500/20"
                                >
                                    Add Video
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Link Modal */}
            {isLinkModalOpen && (
                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Add or Edit Link</h3>
                            <button onClick={() => setIsLinkModalOpen(false)} className="text-gray-400 hover:text-gray-500">&times;</button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Link URL</label>
                                <input 
                                    type="text"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleLinkSubmit(e);
                                        }
                                    }}
                                    placeholder="https://..."
                                    className="block w-full px-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        editor.chain().focus().extendMarkRange('link').unsetLink().run();
                                        setIsLinkModalOpen(false);
                                        setLinkUrl('');
                                    }}
                                    className="px-5 py-2.5 rounded-full text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                                >
                                    Remove Link
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleLinkSubmit}
                                    className="px-5 py-2.5 rounded-full text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all shadow-lg shadow-amber-500/20"
                                >
                                    Save Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {isImageModalOpen && (
                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Upload Image</h3>
                            <button onClick={() => setIsImageModalOpen(false)} className="text-gray-400 hover:text-gray-500">&times;</button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Select Image</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 dark:file:bg-amber-500/10 dark:file:text-amber-400 dark:hover:file:bg-amber-500/20 transition-all cursor-pointer"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">Alt Text (Optional)</label>
                                <input 
                                    type="text"
                                    value={imageAlt}
                                    onChange={(e) => setImageAlt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (imageFile && !isUploading) {
                                                handleImageUpload(e);
                                            }
                                        }
                                    }}
                                    placeholder="Description of image for accessibility"
                                    className="block w-full px-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsImageModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleImageUpload}
                                    disabled={!imageFile || isUploading}
                                    className="px-5 py-2.5 rounded-full text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload & Insert'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #878A8C;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .ProseMirror iframe {
                    width: 100%;
                    min-height: 400px;
                }
                .editor-content {
                    font-family: inherit;
                }
                .editor-content p {
                    margin-bottom: 0.5em;
                }
                .editor-content h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
                .editor-content h2 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
                .editor-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
                .editor-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
                .editor-content blockquote { border-left: 3px solid #EDEFF1; padding-left: 1em; margin-left: 0; color: #878A8C; font-style: italic; }
                .editor-content table { border-collapse: collapse; margin: 0 0 1em 0; overflow: hidden; table-layout: fixed; width: 100%; }
                .editor-content table td, .editor-content table th { border: 1px solid #ced4da; box-sizing: border-box; min-width: 1em; padding: 6px 8px; position: relative; vertical-align: top; }
                .editor-content table th { background-color: #f1f3f5; font-weight: bold; text-align: left; }
                .dark .editor-content table td, .dark .editor-content table th { border-color: #4b5563; }
                .dark .editor-content table th { background-color: #374151; }
            `}</style>
        </div>
    );
}
