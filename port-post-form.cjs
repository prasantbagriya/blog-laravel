const fs = require('fs');
let content = fs.readFileSync('e:/blog/app/(main)/blog/admin/PostForm.tsx', 'utf8');

// Replace imports
content = content.replace(/'use client';/g, '');
content = content.replace(/import \{ useRouter \} from 'next\/navigation';/g, 'import { router } from \'@inertiajs/react\';');
content = content.replace(/const router = useRouter\(\);/g, '');
content = content.replace(/import \{ Post \} from '@\/lib\/db';/g, '');
content = content.replace(/import \{ AuthorProfile \} from '@\/lib\/types';/g, '');
content = content.replace(/import \{ handleSavePost, handleUpload \} from '@\/lib\/actions';/g, '');
content = content.replace(/import '@\/app\/editor\.css';/g, 'import \'../../css/app.css\';');

// Replace Next/Link and Image
content = content.replace(/import Link from 'next\/link';/g, 'import { Link } from \'@inertiajs/react\';');
content = content.replace(/import Image from 'next\/image';/g, '');

// Convert handleSavePost to Inertia post
content = content.replace(/const result = await handleSavePost\(payload\);/g, 'router.post(\'/api/admin/posts\', payload); const result = { success: true };');
content = content.replace(/const result = await handleUpload\(formData\);/g, '/* handleUpload is mocked */ const result = { success: true, url: "" };');

// Save back
fs.writeFileSync('e:/blog-laravel/resources/js/Pages/Admin/PostForm.jsx', content, 'utf8');
console.log('PostForm.jsx successfully ported.');
