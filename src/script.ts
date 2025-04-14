// npx tsc al guardar

const lengthInput = document.getElementById('length') as HTMLInputElement;
const uppercaseCheckbox = document.getElementById('uppercase') as HTMLInputElement;
const lowercaseCheckbox = document.getElementById('lowercase') as HTMLInputElement;
const numbersCheckbox = document.getElementById('numbers') as HTMLInputElement;
const symbolsCheckbox = document.getElementById('symbols') as HTMLInputElement;
const passwordOutput = document.getElementById('password') as HTMLInputElement;
const generateButton = document.getElementById('generate') as HTMLButtonElement;
const copyButton = document.getElementById('copy') as HTMLButtonElement;
const passwordStrength = document.getElementById('password-strength') as HTMLDivElement;
const appContainer = document.getElementById('app-container') as HTMLElement;
const strengthDisplay = document.getElementById('password-strength') as HTMLDivElement;


function generatePassword(length: number, useUpper: boolean, useLower: boolean, 
    useNumbers: boolean, useSymbols: boolean): string {
        const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowers = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let characters = '';
        if (useUpper) characters += uppers;
        if (useLower) characters += lowers;
        if (useNumbers) characters += numbers;
        if (useSymbols) characters += symbols;

        if(!characters) return '';

        let password = '';
        for (let i = 0; i < length; i++) {
            const randIndex = Math.floor(Math.random() * characters.length);
            password += characters[randIndex];
        }

        return password;
}

function calculatePasswordStrength(password: string): string {
    const upperCriteria = /[A-Z]/.test(password);
    const lowerCriteria = /[a-z]/.test(password);
    const numberCriteria = /\d/.test(password);
    const symbolCriteria = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    const shortCriteria = password.length < 12;
    const mediumCriteria = password.length >= 12 && password.length < 24;
    const largeCriteria = password.length >= 24;

    let score = 0;
    if (upperCriteria) score += 1;
    if (lowerCriteria) score += 1;
    if (numberCriteria) score += 1;
    if (symbolCriteria) score += 2;

    if (shortCriteria) score += 1;
    if (mediumCriteria) score += 3;
    if (largeCriteria) score += 5;

    if (score <= 3) return 'Weak';
    if (score > 3 && score <= 5) return 'Medium';
    if (score > 5 && score <= 7) return 'Strong';
    return 'Very Strong';
}

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';

function updateStrengthDisplay(strength: StrengthLevel): void {
    appContainer.classList.remove('strength-weak-container', 'strength-medium-container', 'strength-strong-container', 'strength-very-strong-container');
    strengthDisplay.classList.remove('strength-weak-text', 'strength-medium-text', 'strength-strong-text', 'strength-very-strong-text');

    switch (strength) {
        case 'weak':
            strengthDisplay.textContent = 'Password Strength: Weak';
            appContainer.classList.add('strength-weak-container');
            strengthDisplay.classList.add('strength-weak-text');
            break;
        case 'medium':
            strengthDisplay.textContent = 'Password Strength: Medium';
            appContainer.classList.add('strength-medium-container');
            strengthDisplay.classList.add('strength-medium-text');
            break;
        case 'strong':
            strengthDisplay.textContent = 'Password Strength: Strong';
            appContainer.classList.add('strength-strong-container');
            strengthDisplay.classList.add('strength-strong-text');
            break;
        case 'very-strong':
            strengthDisplay.textContent = 'Password Strength: Very Strong';
            appContainer.classList.add('strength-very-strong-container');
            strengthDisplay.classList.add('strength-very-strong-text');
            break;
    }
}


generateButton.addEventListener('click', () =>{
    const length = parseInt(lengthInput.value);
    const useUpper = uppercaseCheckbox.checked;
    const useLower = lowercaseCheckbox.checked;
    const useNumbers = numbersCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;

    if(!useUpper && !useLower && !useNumbers && !useSymbols){
        alert('Please select at least one character type!');
        return;
    }

    if(length < 8 || length > 32){
        alert('Please select a valid length for the password. Must be between 8 and 32')
        return;
    }

    const password = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    passwordOutput.value = password;

    const strength = calculatePasswordStrength(password);
    switch (strength) {
        case 'Weak':
            updateStrengthDisplay('weak');
            break;
        case 'Medium':
            updateStrengthDisplay('medium');
            break;
        case 'Strong':
            updateStrengthDisplay('strong');
            break;
        case 'Very Strong':
            updateStrengthDisplay('very-strong');
            break;
    }

    passwordStrength.innerText = `Password Strength: ${strength}`;

});

copyButton.addEventListener('click', () =>{
    passwordOutput.select();
    document.execCommand('copy');
});