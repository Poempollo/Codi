const lengthInput = document.getElementById('length') as HTMLInputElement;
const uppercaseCheckbox = document.getElementById('uppercase') as HTMLInputElement;
const lowercaseCheckbox = document.getElementById('lowercase') as HTMLInputElement;
const numbersCheckbox = document.getElementById('numbers') as HTMLInputElement;
const symbolsCheckbox = document.getElementById('symbols') as HTMLInputElement;
const passwordOutput = document.getElementById('password') as HTMLInputElement;
const generateButton = document.getElementById('generate') as HTMLButtonElement;
const copyButton = document.getElementById('copy') as HTMLButtonElement;
const strengthDisplay = document.getElementById('password-strength') as HTMLDivElement;
const appContainer = document.getElementById('app-container') as HTMLElement;

const CHARS = {
    uppers: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowers: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useNumbers: boolean, useSymbols: boolean): string {
    let characters = '';
    if (useUpper) characters += CHARS.uppers;
    if (useLower) characters += CHARS.lowers;
    if (useNumbers) characters += CHARS.numbers;
    if (useSymbols) characters += CHARS.symbols;

    if (!characters) return '';

    let password = '';
    for (let i = 0; i < length; i++) {
        const randIndex = Math.floor(Math.random() * characters.length);
        password += characters[randIndex];
    }

    return password;
}

function calculatePasswordStrength(password: string): StrengthLevel {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    const length = password.length;
    let score = 0;

    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 2;

    if (length < 12) score += 1;
    else if (length < 24) score += 3;
    else score += 5;

    if (score <= 3) return 'weak';
    if (score <= 5) return 'medium';
    if (score <= 7) return 'strong';
    return 'very-strong';
}

function updateStrengthDisplay(strength: StrengthLevel): void {
    appContainer.className = 'password-card p-4';
    strengthDisplay.className = '';
    strengthDisplay.textContent = `Password Strength: ${strength.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;

    appContainer.classList.add(`strength-${strength}-container`);
    strengthDisplay.classList.add(`strength-${strength}-text`);
}

generateButton.addEventListener('click', () => {
    const length = parseInt(lengthInput.value);
    const useUpper = uppercaseCheckbox.checked;
    const useLower = lowercaseCheckbox.checked;
    const useNumbers = numbersCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;

    if (!(useUpper || useLower || useNumbers || useSymbols)) {
        alert('Please select at least one character type!');
        return;
    }

    if (length < 8 || length > 32) {
        alert('Please select a valid length between 8 and 32.');
        return;
    }

    const password = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    passwordOutput.value = password;

    const strength = calculatePasswordStrength(password);
    updateStrengthDisplay(strength);
});

copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordOutput.value)
        .then(() => console.log('Password copied'))
        .catch(err => console.error('Copy failed', err));
});
