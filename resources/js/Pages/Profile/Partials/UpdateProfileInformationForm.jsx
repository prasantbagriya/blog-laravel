import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            flair: user.flair || '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-[#555555] dark:text-[#A0A09C]">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-[#1A1A1A] dark:text-white" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-[#1A1A1A] dark:text-white" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="flair" value="User Flair (Optional)" className="text-[#1A1A1A] dark:text-white" />

                    <TextInput
                        id="flair"
                        type="text"
                        className="mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]"
                        value={data.flair}
                        onChange={(e) => setData('flair', e.target.value)}
                        placeholder="e.g. Laravel Expert, Designer, Moderator"
                    />

                    <InputError className="mt-2" message={errors.flair} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-[#1A1A1A] dark:text-white">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-[#0052FF] hover:text-[#0040CC] focus:outline-none"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button 
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 bg-[#0052FF] border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#0040CC] focus:bg-[#0040CC] active:bg-[#0033A0] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                    >
                        Save
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-[#555555] dark:text-[#A0A09C]">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
