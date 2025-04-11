"use strict";
// npx tsc al guardar
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
