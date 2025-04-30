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
const exportButton = document.getElementById('export') as HTMLButtonElement;
const toggleButton = document.getElementById('toggle-mode') as HTMLButtonElement;
const browserLang = navigator.language.toUpperCase();
const languageMapping: Record<string, string> = {
    'EN': 'en',
    'GB': 'en',
    'CA': 'en',
    'US': 'en',
    'ES': 'es',
    'MX': 'es',
    'AR': 'es',
    'CL': 'es',
}

const browserLangShort = browserLang.slice(0, 2);

const currentLang = languageMapping[browserLangShort] || 'EN';

const CHARS = {
    uppers: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowers: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very_strong';

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useNumbers: boolean, useSymbols: boolean): string {
    let availableChars = '';
    const mandatoryChars: string[] = [];

    if (useUpper) {
        availableChars += CHARS.uppers;
        mandatoryChars.push(randomChar(CHARS.uppers));
    }
    if (useLower) {
        availableChars += CHARS.lowers;
        mandatoryChars.push(randomChar(CHARS.lowers));
    }
    if (useNumbers) {
        availableChars += CHARS.numbers;
        mandatoryChars.push(randomChar(CHARS.numbers));
    }
    if (useSymbols) {
        availableChars += CHARS.symbols;
        mandatoryChars.push(randomChar(CHARS.symbols));
    }

    if (!availableChars) return '';

    const remainingLength = length - mandatoryChars.length;
    const passwordChars = [...mandatoryChars];

    for (let i = 0; i < remainingLength; i++) {
        passwordChars.push(randomChar(availableChars));
    }

    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    return passwordChars.join('');
}

function randomChar(charSet: string): string {
    return charSet[getRandomInt(charSet.length)];
}

function getRandomInt(max: number): number {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
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
    return 'very_strong';
}

function updateStrengthDisplay(strength: StrengthLevel): void {
    appContainer.className = 'password-card p-4';
    strengthDisplay.className = '';
    console.log("Valor strength en updateStrengthDisplay:", strength);
    console.log("langData.strength_levels:", langData.strength_levels);
    strengthDisplay.textContent = `${langData.password_strength}: ${langData.strength_levels[strength]}`;

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
        alert(langData.alerts.no_type);
        return;
    }

    if (length < 8 || length > 32) {
        alert(langData.alerts.invalid_length);
        return;
    }

    const password = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    passwordOutput.value = password;

    const strength = calculatePasswordStrength(password);
    updateStrengthDisplay(strength);

    addPasswordToHistory(password, strength);
});

copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordOutput.value)
    .then(() => {
        console.log('Password copied');
        copyButton.classList.add('copied');
        setTimeout(() => {
            copyButton.classList.remove('copied');
        }, 1000);
    })
    .catch(err => console.error('Copy failed', err));
});

passwordOutput.addEventListener('input', () => {
    const password = passwordOutput.value;
    const strength = calculatePasswordStrength(password);
    updateStrengthDisplay(strength);
});

interface HistoryItem {
    value: string;
    strength: StrengthLevel;
}

let passwordHistory: HistoryItem[] = [];

function addPasswordToHistory(password: string, strength: StrengthLevel) {
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
            case 'very_strong':
                strengthSpan.textContent = langData.strength_levels.very_strong;
                strengthSpan.classList.add('strength-very-strong-text');
                break;
            case 'strong':
                strengthSpan.textContent = langData.strength_levels.strong;
                strengthSpan.classList.add('strength-strong-text');
                break;
            case 'medium':
                strengthSpan.textContent = langData.strength_levels.medium;
                strengthSpan.classList.add('strength-medium-text');
                break;
            case 'weak':
                strengthSpan.textContent = langData.strength_levels.weak;
                strengthSpan.classList.add('strength-weak-text');
                break;
        }    

        li.appendChild(strengthSpan);

        li.addEventListener('click', () => {
            passwordOutput.value = item.value;
        });

        passwordHistoryList.appendChild(li);
    })
}

exportButton.addEventListener('click', () => {
    const password = passwordOutput.value;

    if(!password){
        alert(langData.alerts.no_password);
        return;
    }

    const strength = strengthDisplay.textContent?.split(': ')[1] ?? 'Unknown';
    const now = new Date();
    const formattedDate = now.toLocaleString();

    const fileContent = `Password: ${password}\nStrength: ${strength}\nDate: ${formattedDate}`;

    const blob = new Blob([fileContent], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "codi_password.txt";
    a.click();

    URL.revokeObjectURL(url);
});

let darkMode = true;
toggleButton.textContent = darkMode ? "☼" : "☾";

toggleButton.addEventListener('click', () => {
    darkMode = !darkMode;

    document.body.classList.toggle('light-mode', !darkMode);
});

function loadLanguage(lang: string): Promise<any> {
    return fetch(`languages/${lang}.json`).then(res => res.json());
}

function updateText(langData: any) {
    document.querySelector('h1')!.textContent = langData.password_generator;
    document.querySelector('label[for="length"]')!.textContent = langData.password_length;
    document.querySelector('#copy')!.textContent = langData.copy_button;
    document.querySelector('#generate')!.textContent = langData.generate_button;
    document.querySelector('#password-strength')!.textContent = langData.password_strength;
    document.querySelector('#export')!.textContent = langData.export_button;
    document.querySelector('h5')!.textContent = langData.password_history;
    const toggleButton = document.getElementById('toggle-mode') as HTMLButtonElement;
    toggleButton.title = langData.toggle_mode;
}

let langData: any;

function init() {
    loadLanguage(currentLang).then(data => {
        langData = data;
        updateText(langData);
    }).catch(err => console.error('Error loading language:', err));
}

init();