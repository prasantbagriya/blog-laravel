import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [isFocused, setIsFocused] = useState('');

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div style={styles.container}>
            <Head title="Admin Login" />

            {/* Background elements */}
            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>
            <div style={styles.blob3}></div>

            <div style={styles.glassCard}>
                <div style={styles.cardHeader}>
                    <div style={styles.logoContainer}>
                        <div style={styles.logoIcon}>⚡</div>
                    </div>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Sign in to access your dashboard</p>
                </div>

                {status && <div style={styles.statusMessage}>{status}</div>}

                <form onSubmit={submit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <div style={{...styles.inputWrapper, ...(isFocused === 'email' ? styles.inputWrapperFocused : {})}}>
                            <span style={styles.inputIcon}>✉️</span>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                onFocus={() => setIsFocused('email')}
                                onBlur={() => setIsFocused('')}
                                style={styles.input}
                                placeholder="admin@example.com"
                                autoFocus
                            />
                        </div>
                        {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.labelRow}>
                            <label style={styles.label}>Password</label>
                            {canResetPassword && (
                                <Link href={route('password.request')} style={styles.forgotLink}>
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div style={{...styles.inputWrapper, ...(isFocused === 'password' ? styles.inputWrapperFocused : {})}}>
                            <span style={styles.inputIcon}>🔒</span>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                onFocus={() => setIsFocused('password')}
                                onBlur={() => setIsFocused('')}
                                style={styles.input}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div style={styles.rememberGroup}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                style={styles.checkbox}
                            />
                            <span style={styles.checkboxText}>Remember me for 30 days</span>
                        </label>
                    </div>

                    <button type="submit" disabled={processing} style={{
                        ...styles.submitBtn,
                        ...(processing ? styles.submitBtnDisabled : {})
                    }}>
                        {processing ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    },
    blob1: {
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(15,23,42,0) 70%)',
        filter: 'blur(40px)',
    },
    blob2: {
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)',
        filter: 'blur(40px)',
    },
    blob3: {
        position: 'absolute',
        top: '20%',
        right: '20%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(15,23,42,0) 70%)',
        filter: 'blur(40px)',
    },
    glassCard: {
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 10
    },
    cardHeader: {
        textAlign: 'center',
        marginBottom: '36px'
    },
    logoContainer: {
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
    },
    logoIcon: {
        fontSize: '28px',
        color: '#ffffff'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#f8fafc',
        margin: '0 0 8px',
        letterSpacing: '-0.02em'
    },
    subtitle: {
        fontSize: '15px',
        color: '#94a3b8',
        margin: 0
    },
    statusMessage: {
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        color: '#34d399',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '24px',
        textAlign: 'center'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#cbd5e1'
    },
    forgotLink: {
        fontSize: '13px',
        color: '#38bdf8',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s'
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '0 16px',
        height: '52px',
        transition: 'all 0.2s ease',
    },
    inputWrapperFocused: {
        borderColor: '#38bdf8',
        boxShadow: '0 0 0 4px rgba(56, 189, 248, 0.1)',
        background: 'rgba(15, 23, 42, 0.8)',
    },
    inputIcon: {
        marginRight: '12px',
        fontSize: '16px',
        opacity: 0.5
    },
    input: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        color: '#f8fafc',
        fontSize: '15px',
        outline: 'none',
        width: '100%'
    },
    errorText: {
        color: '#f87171',
        fontSize: '13px',
        marginTop: '4px'
    },
    rememberGroup: {
        display: 'flex',
        alignItems: 'center'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        gap: '10px'
    },
    checkbox: {
        width: '18px',
        height: '18px',
        borderRadius: '6px',
        accentColor: '#38bdf8',
        cursor: 'pointer'
    },
    checkboxText: {
        fontSize: '14px',
        color: '#94a3b8'
    },
    submitBtn: {
        background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        height: '52px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
        transition: 'transform 0.1s, boxShadow 0.2s',
        boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)'
    },
    submitBtnDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed'
    }
};
