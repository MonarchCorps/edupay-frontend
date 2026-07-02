// Locked brand tokens for the logo mark — do not source from the Tailwind
// theme, which still carries the old teal/gold palette elsewhere in the app.
const LOGO_BG = '#00092C';
const LOGO_ACCENT = '#FFEDCE';

interface LogoMarkProps {
    size?: number;
    className?: string;
}

// Icon-only mark: a refined bolt on a rounded navy square. Suitable on its
// own (favicon-style contexts) or paired with the wordmark via <Logo />.
export function LogoMark({ size = 32, className }: LogoMarkProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="EduPay"
        >
            <rect width="32" height="32" rx="9" fill={LOGO_BG} />
            <path
                d="M17 5 L7.5 17.5 H14.5 L13.5 27 L24.5 13.5 H17.5 L17 5 Z"
                fill={LOGO_ACCENT}
                stroke={LOGO_ACCENT}
                strokeWidth="0.75"
                strokeLinejoin="round"
            />
        </svg>
    );
}

interface LogoProps {
    /** Icon height in px — the wordmark scales proportionally. */
    size?: number;
    /** Hide the "EduPay" wordmark and render just the icon mark. */
    iconOnly?: boolean;
    className?: string;
}

// Full lockup: icon mark + "EduPay" wordmark. Use `size` to scale for
// context — small (~28px) in the header/sidebar, larger (~56px) on
// onboarding. Text color is inherited from the surrounding container so it
// reads correctly on both light and dark backgrounds.
export function Logo({ size = 28, iconOnly = false, className }: LogoProps) {
    return (
        <div className={`inline-flex items-center gap-2 ${className ?? ''}`}>
            <LogoMark size={size} />
            {!iconOnly && (
                <span
                    className="font-bold tracking-tight"
                    style={{ fontSize: size * 0.64 }}
                >
                    EduPay
                </span>
            )}
        </div>
    );
}
