import React from 'react';
import StoryForm from './StoryForm';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function EditStoryPage({ story }) {
  return <StoryForm story={story} />;
}

EditStoryPage.layout = page => <AdminLayout>{page}</AdminLayout>;
