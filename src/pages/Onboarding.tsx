import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Button } from '@tremor/react';
import { LogoMark } from '../components/ui/Logo';
import { NewKeyModal } from '../components/ui/NewKeyModal';
import { registerMerchant, bootstrapApiKey, login, setSessionToken } from '../api/auth';
import type { ApiError } from '../types';

type Mode = 'register' | 'signin';

interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface SignInData {
    email: string;
    password: string;
}

interface FieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-brand-dark/80">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-error mt-1">{error}</p>}
        </div>
    );
}

const inputClass =
    'w-full bg-[#FFFDF8] border border-teal-mid/20 rounded-tremor-small px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-accent-gold transition-colors disabled:opacity-50';

export default function Onboarding() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>('register');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [newKey, setNewKey] = useState<string | null>(null);
    const [pendingLogin, setPendingLogin] = useState<SignInData | null>(null);

    const registerForm = useForm<RegisterData>();
    const signinForm = useForm<SignInData>();

    const completeLogin = async (email: string, password: string) => {
        const { token } = await login(email, password);
        setSessionToken(token);
        navigate('/', { replace: true });
    };

    const handleRegister = registerForm.handleSubmit(
        async (data: RegisterData) => {
            setIsLoading(true);
            setApiError(null);
            try {
                const merchant = await registerMerchant(
                    data.name,
                    data.email,
                    data.password,
                );
                const key = await bootstrapApiKey(merchant.id);
                // Show the merchant their first API key before continuing —
                // it's only ever shown once. Login happens after they
                // acknowledge it (see handleKeyModalClose).
                setPendingLogin({ email: data.email, password: data.password });
                setNewKey(key.key);
            } catch (err) {
                setApiError(
                    (err as ApiError)?.message ??
                        'Something went wrong. Please try again.',
                );
                setIsLoading(false);
            }
        },
    );

    const handleKeyModalClose = async () => {
        setNewKey(null);
        if (!pendingLogin) return;
        try {
            await completeLogin(pendingLogin.email, pendingLogin.password);
        } catch (err) {
            setApiError(
                (err as ApiError)?.message ??
                    'Account created, but sign-in failed — please sign in manually.',
            );
            setIsLoading(false);
            setMode('signin');
        }
    };

    const handleSignIn = signinForm.handleSubmit(async (data: SignInData) => {
        setIsLoading(true);
        setApiError(null);
        try {
            await completeLogin(data.email, data.password);
        } catch (err) {
            setApiError(
                (err as ApiError)?.message ?? 'Invalid email or password.',
            );
            setIsLoading(false);
        }
    });

    const switchMode = (next: Mode) => {
        setMode(next);
        setApiError(null);
    };

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-5 rounded-2xl shadow-tremor-card">
                        <LogoMark size={64} />
                    </div>
                    <h1 className="text-3xl font-bold text-brand-dark tracking-tight">
                        Welcome to EduPay
                    </h1>
                    <p className="text-sm text-teal-mid/60 mt-2">
                        {mode === 'register'
                            ? 'Create your merchant account to start issuing dedicated virtual accounts.'
                            : 'Sign in to continue.'}
                    </p>
                </div>

                <Card>
                    {apiError && (
                        <div className="mb-5 px-4 py-3 bg-error/10 border border-error/25 rounded-tremor-small text-sm text-error">
                            {apiError}
                        </div>
                    )}

                    {mode === 'register' ? (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <Field
                                label="Business Name"
                                error={
                                    registerForm.formState.errors.name?.message
                                }
                            >
                                <input
                                    {...registerForm.register('name', {
                                        required: 'Business name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Minimum 2 characters',
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: 'Maximum 255 characters',
                                        },
                                    })}
                                    placeholder="Acme Financial Services"
                                    className={inputClass}
                                    disabled={isLoading}
                                />
                            </Field>

                            <Field
                                label="Email Address"
                                error={
                                    registerForm.formState.errors.email?.message
                                }
                            >
                                <input
                                    {...registerForm.register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message:
                                                'Enter a valid email address',
                                        },
                                    })}
                                    type="email"
                                    placeholder="you@company.com"
                                    className={inputClass}
                                    disabled={isLoading}
                                />
                            </Field>

                            <Field
                                label="Password"
                                error={
                                    registerForm.formState.errors.password
                                        ?.message
                                }
                            >
                                <input
                                    {...registerForm.register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Minimum 8 characters',
                                        },
                                    })}
                                    type="password"
                                    placeholder="At least 8 characters"
                                    className={inputClass}
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                            </Field>

                            <Field
                                label="Confirm Password"
                                error={
                                    registerForm.formState.errors
                                        .confirmPassword?.message
                                }
                            >
                                <input
                                    {...registerForm.register(
                                        'confirmPassword',
                                        {
                                            required: 'Please confirm your password',
                                            validate: (value: string) =>
                                                value ===
                                                    registerForm.getValues(
                                                        'password',
                                                    ) || 'Passwords do not match',
                                        },
                                    )}
                                    type="password"
                                    placeholder="Re-enter your password"
                                    className={inputClass}
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                            </Field>

                            <Button
                                type="submit"
                                loading={isLoading}
                                disabled={isLoading}
                                className="w-full bg-accent-gold hover:bg-accent-gold/90 text-brand-dark border-accent-gold font-semibold mt-2"
                                size="lg"
                            >
                                Create Account & Get API Key
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignIn} className="space-y-5">
                            <Field
                                label="Email Address"
                                error={
                                    signinForm.formState.errors.email?.message
                                }
                            >
                                <input
                                    {...signinForm.register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message:
                                                'Enter a valid email address',
                                        },
                                    })}
                                    type="email"
                                    placeholder="you@company.com"
                                    className={inputClass}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </Field>

                            <Field
                                label="Password"
                                error={
                                    signinForm.formState.errors.password
                                        ?.message
                                }
                            >
                                <input
                                    {...signinForm.register('password', {
                                        required: 'Password is required',
                                    })}
                                    type="password"
                                    placeholder="Your password"
                                    className={inputClass}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                            </Field>

                            <Button
                                type="submit"
                                loading={isLoading}
                                disabled={isLoading}
                                className="w-full bg-accent-gold hover:bg-accent-gold/90 text-brand-dark border-accent-gold font-semibold mt-2"
                                size="lg"
                            >
                                Sign In
                            </Button>
                        </form>
                    )}

                    <div className="mt-5 pt-4 border-t border-teal-mid/10 text-center">
                        {mode === 'register' ? (
                            <p className="text-sm text-teal-mid/60">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchMode('signin')}
                                    className="text-teal-mid hover:text-brand-dark font-medium"
                                >
                                    Sign in
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm text-teal-mid/60">
                                New to EduPay?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchMode('register')}
                                    className="text-teal-mid hover:text-brand-dark font-medium"
                                >
                                    Create an account
                                </button>
                            </p>
                        )}
                    </div>
                </Card>

                <p className="text-center text-xs text-teal-mid/40 mt-6">
                    Sandbox mode — no real money is processed.
                </p>
            </div>

            <NewKeyModal
                apiKey={newKey}
                onClose={handleKeyModalClose}
                title="Your First API Key"
            />
        </div>
    );
}
