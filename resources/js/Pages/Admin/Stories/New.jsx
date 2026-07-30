import React from 'react';
import StoryForm from './StoryForm';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function NewStoryPage() {
  return <StoryForm />;
}

NewStoryPage.layout = page => <AdminLayout>{page}</AdminLayout>;
