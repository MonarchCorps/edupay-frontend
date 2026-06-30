type ValidationRule = {
    required?: string | boolean;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    validate?: (v: unknown) => boolean | string;
};

export const required = (label = 'This field'): ValidationRule => ({
    required: `${label} is required`,
});

export const minLength = (
    min: number,
    label = 'This field',
): ValidationRule => ({
    minLength: {
        value: min,
        message: `${label} must be at least ${min} characters`,
    },
});

export const maxLength = (
    max: number,
    label = 'This field',
): ValidationRule => ({
    maxLength: {
        value: max,
        message: `${label} must not exceed ${max} characters`,
    },
});

export const positiveNumber: ValidationRule = {
    validate: (v: unknown) => {
        if (!v) return true;
        return Number(v) > 0 || 'Amount must be positive';
    },
};

export const customerNameRules: ValidationRule = {
    ...required('Customer name'),
    ...minLength(2, 'Customer name'),
    ...maxLength(100, 'Customer name'),
};

export const customerIdRules: ValidationRule = {
    ...required('Customer ID'),
    ...minLength(3, 'Customer ID'),
};
