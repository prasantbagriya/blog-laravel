import React, { Suspense } from 'react';

const StoryForm = React.lazy(() => import('./StoryForm'));
const AdminLayout = React.lazy(() => import('../../../Layouts/AdminLayout'));

export default function NewStoryPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Editor...</div>}>
      <StoryForm />
    </Suspense>
  );
}

NewStoryPage.layout = page => (
  <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Workspace...</div>}>
    <AdminLayout>{page}</AdminLayout>
  </Suspense>
);
