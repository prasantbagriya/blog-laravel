import React from 'react';
import AuthorForm from './AuthorForm';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function NewAuthorPage() {
  return <AuthorForm />;
}

NewAuthorPage.layout = page => <AdminLayout>{page}</AdminLayout>;
