import React from 'react';
import AuthorForm from './AuthorForm';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function EditAuthorPage({ author }) {
  return <AuthorForm author={author} />;
}

EditAuthorPage.layout = page => <AdminLayout>{page}</AdminLayout>;
