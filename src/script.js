"use strict";
// npx tsc al guardar
const lengthInput = document.getElementById('length');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const passwordOutput = document.getElementById('password');
const generateButton = document.getElementById('generate');
const copyButton = document.getElementById('copy');
const passwordStrength = document.getElementById('password-strength');
function generatePassword(length, useUpper, useLower, useNumbers, useSymbols) {
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let characters = '';
    if (useUpper)
        characters += uppers;
    if (useLower)
        characters += lowers;
    if (useNumbers)
        characters += numbers;
    if (useSymbols)
        characters += symbols;
    if (!characters)
        return '';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randIndex = Math.floor(Math.random() * characters.length);
        password += characters[randIndex];
    }
    return password;
}
function calculatePasswordStrength(password) {
    const upperCriteria = /[A-Z]/.test(password);
    const lowerCriteria = /[a-z]/.test(password);
    const numberCriteria = /\d/.test(password);
    const symbolCriteria = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    const shortCriteria = password.length < 12;
    const mediumCriteria = password.length >= 12 && password.length < 24;
    const largeCriteria = password.length >= 24;
    let score = 0;
    if (upperCriteria)
        score += 1;
    if (lowerCriteria)
        score += 1;
    if (numberCriteria)
        score += 1;
    if (symbolCriteria)
        score += 2;
    if (shortCriteria)
        score += 1;
    if (mediumCriteria)
        score += 2;
    if (largeCriteria)
        score += 3;
    if (score <= 3)
        return 'Weak';
    if (score > 3 && score <= 5)
        return 'Medium';
    if (score > 5 && score <= 7)
        return 'Strong';
    return 'Very Strong';
}
generateButton.addEventListener('click', () => {
    const lenght = parseInt(lengthInput.value);
    const useUpper = uppercaseCheckbox.checked;
    const useLower = lowercaseCheckbox.checked;
    const useNumbers = numbersCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;
    if (!useUpper && !useLower && !useNumbers && !useSymbols) {
        alert('Please select at least one character type!');
        return;
    }
    const password = generatePassword(lenght, useUpper, useLower, useNumbers, useSymbols);
    passwordOutput.value = password;
    const strength = calculatePasswordStrength(password);
    passwordStrength.innerText = `Password Strength: ${strength}`;
});
copyButton.addEventListener('click', () => {
    passwordOutput.select();
    document.execCommand('copy');
});
