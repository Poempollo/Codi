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
const passwordHistoryList = document.getElementById('password-history') as HTMLUListElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

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

    const typesCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    const length = password.length;

    let score = 0;

    score += typesCount * 2;

    if (length >= 8 && length < 12) score += 1;
    else if (length >= 12 && length < 16) score += 2;
    else if (length >= 16 && length < 20) score += 3;
    else if (length >= 20 && length < 26) score += 4;
    else if (length >= 26) score += 5;

    if (score <= 5) return 'weak';
    if (score <= 9) return 'medium';
    if (score <= 11) return 'strong';
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

    addPasswordToHistory(password, strengthDisplay.textContent?.split(': ')[1] ?? '');
});

copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordOutput.value)
        .then(() => console.log('Password copied'))
        .catch(err => console.error('Copy failed', err));
});

passwordOutput.addEventListener('input', () => {
    const password = passwordOutput.value;
    const strength = calculatePasswordStrength(password);
    updateStrengthDisplay(strength);
});

interface HistoryItem {
    value: string;
    strength: string;
}

let passwordHistory: HistoryItem[] = [];

function addPasswordToHistory(password: string, strength: string) {
    passwordHistory.unshift({value: password, strength});
    if (passwordHistory.length > 10) {
        passwordHistory.pop();
    }

    renderPasswordHistory();
}

function renderPasswordHistory() {
    passwordHistoryList.innerHTML = '';
    passwordHistory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.value;

        const strengthSpan = document.createElement('span');
        strengthSpan.classList.add('password-strength-label');

        switch(item.strength) {
            case 'Very Strong':
                strengthSpan.textContent = 'Very strong'
                strengthSpan.classList.add('strength-very-strong-text');
                break;
            case 'Strong':
                strengthSpan.textContent = 'Strong'
                strengthSpan.classList.add('strength-strong-text');
                break;
            case 'Medium':
                strengthSpan.textContent = 'Medium'
                strengthSpan.classList.add('strength-medium-text');
                break;
            case 'Weak':
                strengthSpan.textContent = 'Weak'
                strengthSpan.classList.add('strength-weak-text');
                break;
        }

        li.appendChild(strengthSpan);

        li.addEventListener('click', () => {
            passwordInput.value = item.value;
        });

        passwordHistoryList.appendChild(li);
    })
}
