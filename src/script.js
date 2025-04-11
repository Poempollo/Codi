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
generateButton.addEventListener('click', () => {
    const lenght = parseInt(lengthInput.value);
    const useUpper = uppercaseCheckbox.checked;
    const useLower = lowercaseCheckbox.checked;
    const useNumbers = numbersCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;
    const password = generatePassword(lenght, useUpper, useLower, useNumbers, useSymbols);
    passwordOutput.value = password;
});
copyButton.addEventListener('click', () => {
    passwordOutput.select();
    document.execCommand('copy');
});
