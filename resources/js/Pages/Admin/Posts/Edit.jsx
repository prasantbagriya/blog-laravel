import React, { Suspense } from 'react';

const PostForm = React.lazy(() => import('../PostForm'));
const AdminLayout = React.lazy(() => import('../../../Layouts/AdminLayout'));

export default function EditPostPage({ post }) {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Sovereign Editor...</div>}>
      <PostForm post={post} />
    </Suspense>
  );
}

EditPostPage.layout = page => (
  <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Workspace...</div>}>
    <AdminLayout>{page}</AdminLayout>
  </Suspense>
);
