import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth?.user;
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold leading-tight text-[#1A1A1A] dark:text-white">
                        Profile Settings
                    </h2>
                    {user?.username && (
                        <Link
                            href={`/u/${user.username}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-zinc-700 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-lg transition-colors"
                        >
                            View Profile &rarr;
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Profile Settings" />

            <div className="py-12 bg-[#FDFCFB] dark:bg-[#0F0F0E]">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-[#161615] p-4 shadow-sm sm:rounded-xl sm:p-8 border border-[#E5E5E1] dark:border-[#2A2A28]">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white dark:bg-[#161615] p-4 shadow-sm sm:rounded-xl sm:p-8 border border-[#E5E5E1] dark:border-[#2A2A28]">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-[#161615] p-4 shadow-sm sm:rounded-xl sm:p-8 border border-[#E5E5E1] dark:border-[#2A2A28]">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
