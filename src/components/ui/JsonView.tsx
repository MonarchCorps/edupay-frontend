import { clsx } from 'clsx';

type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation';

interface Token {
    text: string;
    type: TokenType;
}

const TOKEN_REGEX =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

function tokenize(json: string): Token[] {
    const tokens: Token[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    TOKEN_REGEX.lastIndex = 0;
    while ((match = TOKEN_REGEX.exec(json))) {
        if (match.index > lastIndex) {
            tokens.push({
                text: json.slice(lastIndex, match.index),
                type: 'punctuation',
            });
        }
        const text = match[0];
        let type: TokenType = 'number';
        if (text.startsWith('"')) {
            type = text.endsWith(':') ? 'key' : 'string';
        } else if (text === 'true' || text === 'false') {
            type = 'boolean';
        } else if (text === 'null') {
            type = 'null';
        }
        tokens.push({ text, type });
        lastIndex = TOKEN_REGEX.lastIndex;
    }
    if (lastIndex < json.length) {
        tokens.push({ text: json.slice(lastIndex), type: 'punctuation' });
    }
    return tokens;
}

// Small, purpose-built micro-palette for code readability on the dark
// surfaces this renders on — distinct from the app's teal/gold palette by
// design (syntax highlighting needs its own accents to stay legible).
const TOKEN_COLOR: Record<TokenType, string> = {
    key: 'text-accent-gold',
    string: 'text-[#8FD9B8]',
    number: 'text-[#8FC7DA]',
    boolean: 'text-[#E0A96D]',
    null: 'text-[#8A93A6]',
    punctuation: 'text-paper/50',
};

interface JsonViewProps {
    data: unknown;
    className?: string;
}

export function JsonView({ data, className }: JsonViewProps) {
    return <JsonCode text={JSON.stringify(data, null, 2)} className={className} />;
}

interface JsonCodeProps {
    text: string;
    className?: string;
}

// Lower-level variant for already-formatted strings that aren't necessarily
// strict JSON (e.g. docs snippets with "..." placeholders) — tokenizes the
// text directly instead of round-tripping through JSON.stringify.
export function JsonCode({ text, className }: JsonCodeProps) {
    const tokens = tokenize(text);

    return (
        <pre
            className={clsx(
                'mono-value text-[13px] leading-relaxed whitespace-pre-wrap break-all',
                className,
            )}
        >
            {tokens.map((t, i) => (
                <span key={i} className={TOKEN_COLOR[t.type]}>
                    {t.text}
                </span>
            ))}
        </pre>
    );
}
