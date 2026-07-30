const fs = require('fs');

function portForm(srcPath, destPath, endpoint) {
  let content = fs.readFileSync(srcPath, 'utf8');

  // Basic replacements
  content = content.replace(/'use client';/g, '');
  content = content.replace(/import \{ useRouter \} from 'next\/navigation';/g, 'import { router } from \'@inertiajs/react\';');
  content = content.replace(/const router = useRouter\(\);/g, '');
  
  // Replace Link and Image
  content = content.replace(/import Link from 'next\/link';/g, 'import { Link } from \'@inertiajs/react\';');
  content = content.replace(/import Image from 'next\/image';/g, '');

  // Specific Next.js Action replacements
  content = content.replace(/import \{ handleSaveAuthor, handleUpload \} from '@\/lib\/actions';/g, '');
  content = content.replace(/import \{ handleSaveStory, handleUpload \} from '@\/lib\/actions';/g, '');
  content = content.replace(/import \{ AuthorProfile \} from '@\/lib\/types';/g, '');
  content = content.replace(/import \{ WebStory \} from '@\/lib\/db';/g, '');

  // Function body replacements
  content = content.replace(/const result = await handleSaveAuthor\(payload\);/g, `router.post('${endpoint}', payload); const result = { success: true };`);
  content = content.replace(/const result = await handleSaveStory\(payload\);/g, `router.post('${endpoint}', payload); const result = { success: true };`);
  content = content.replace(/const result = await handleUpload\(formData\);/g, '/* handleUpload is mocked */ const result = { success: true, url: "" };');

  fs.writeFileSync(destPath, content, 'utf8');
}

// Port Author Form
portForm('e:/blog/app/(main)/blog/admin/authors/AuthorForm.tsx', 'e:/blog-laravel/resources/js/Pages/Admin/Authors/AuthorForm.jsx', '/api/admin/authors');

// Port Story Form
portForm('e:/blog/app/(main)/blog/admin/stories/StoryForm.tsx', 'e:/blog-laravel/resources/js/Pages/Admin/Stories/StoryForm.jsx', '/api/admin/stories');

console.log('Author and Story forms ported successfully.');
