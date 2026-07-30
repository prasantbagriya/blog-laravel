import React, { Suspense } from 'react';
import PostForm from '../PostForm';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function EditPostPage({ post }) {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Sovereign Editor...</div>}>
      <PostForm post={post} />
    </Suspense>
  );
}

EditPostPage.layout = page => <AdminLayout>{page}</AdminLayout>;
