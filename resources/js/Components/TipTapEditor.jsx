import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Video,
    Heading1, Heading2, Quote
} from 'lucide-react';

const ToolbarButton = ({ onClick, disabled, isActive, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded transition-colors flex items-center justify-center border-0 outline-none focus:outline-none focus:ring-0 ${
            isActive 
            ? 'bg-[#F6F7F8] text-[#1C1C1C]' 
            : 'text-[#878A8C] hover:bg-[#F6F7F8] hover:text-[#1C1C1C]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={title}
    >
        {children}
    </button>
);

const MenuBar = ({ editor }) => {
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
        const url = window.prompt('URL of the YouTube video');
        if (url) {
            editor.chain().focus().setYoutubeVideo({
                src: url,
            }).run();
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const Divider = () => <div className="w-[1px] h-6 bg-gray-200 mx-1.5 hidden sm:block"></div>;

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-[#F6F7F8] border-b border-[#EDEFF1]">
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
            
            <ToolbarButton onClick={addImage} title="Image URL">
                <ImageIcon size={18} />
            </ToolbarButton>
            
            <ToolbarButton onClick={addVideo} title="YouTube Video">
                <Video size={18} />
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
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose max-w-none prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4 text-[#1C1C1C] editor-content',
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

    return (
        <div className="border border-[#EDEFF1] focus-within:border-[#1C1C1C] rounded-md overflow-hidden bg-white transition-colors">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            
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
            `}</style>
        </div>
    );
}
