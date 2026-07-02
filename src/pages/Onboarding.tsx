import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, Button } from '@tremor/react';
import { LogoMark } from '../components/ui/Logo';
import {
    registerMerchant,
    bootstrapApiKey,
    getMe,
    setStoredApiKey,
    setActiveMode,
    detectModeFromKey,
} from '../api/auth';
import type { ApiError } from '../types';

type Mode = 'register' | 'signin';

interface RegisterData {
    name: string;
    email: string;
}

interface SignInData {
    apiKey: string;
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

    const registerForm = useForm<RegisterData>();
    const signinForm = useForm<SignInData>();

    const handleRegister = registerForm.handleSubmit(
        async (data: RegisterData) => {
            setIsLoading(true);
            setApiError(null);
            try {
                const merchant = await registerMerchant(data.name, data.email);
                await bootstrapApiKey(merchant.id);
                navigate('/', { replace: true });
            } catch (err) {
                setApiError(
                    (err as ApiError)?.message ??
                        'Something went wrong. Please try again.',
                );
                setIsLoading(false);
            }
        },
    );

    const handleSignIn = signinForm.handleSubmit(async (data: SignInData) => {
        setIsLoading(true);
        setApiError(null);
        try {
            await getMe(data.apiKey);
            const keyMode = detectModeFromKey(data.apiKey);
            setStoredApiKey(keyMode, data.apiKey);
            setActiveMode(keyMode);
            navigate('/', { replace: true });
        } catch (err) {
            setApiError((err as ApiError)?.message ?? 'Invalid API key.');
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
                            : 'Sign in with your API key to continue.'}
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
                                label="API Key"
                                error={
                                    signinForm.formState.errors.apiKey?.message
                                }
                            >
                                <input
                                    {...signinForm.register('apiKey', {
                                        required: 'API key is required',
                                    })}
                                    type="password"
                                    placeholder="ep_sandbox_..."
                                    className={`${inputClass} mono-value`}
                                    disabled={isLoading}
                                    autoFocus
                                    autoComplete="off"
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
        </div>
    );
}
