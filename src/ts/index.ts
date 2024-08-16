import by from 'select-by';

/* Global Variables */
let passwordLength: number = 12;

/* Interfaces */
interface ICharacters {
    uppercase: string;
    lowercase: string;
    numbers: string;
    special: string;
    selectedOptions: string[];
};

interface ILocalStorageItem {
    passwordLength: number;
    selectedOptions: string[];
};

/* Default Objects */
const characters: ICharacters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()_+',
    selectedOptions: ['lowercase', 'uppercase', 'numbers', 'special'],
};

const localStorageItem: ILocalStorageItem = {
    passwordLength,
    selectedOptions: characters.selectedOptions,
};

/* Methods */
function getLocalStorageItem(): void {
    let settings: string | null = localStorage.getItem('settings');
    if (settings === null) setLocalStorageItem();

    const parsedSettings: {
        passwordLength: number,
        selectedOptions: string[]
    } = JSON.parse(settings || localStorageItem.toString());

    passwordLength = parsedSettings.passwordLength;
    characters.selectedOptions = parsedSettings.selectedOptions;
    setPasswordOptions();
};

function setLocalStorageItem(): void {
    const localStorageItem: ILocalStorageItem = {
        passwordLength,
        selectedOptions: characters.selectedOptions,
    };

    localStorage.setItem('settings', JSON.stringify(localStorageItem));
};

function setPasswordOptions(): void {
    const passwordLengthInput: HTMLInputElement | null = by.id('password-length-input');
    const passwordLengthOutput: HTMLElement | null = by.id('password-length-output');

    if (passwordLengthInput !== null && passwordLengthOutput !== null) {
        passwordLengthInput.value = passwordLength.toString();
        passwordLengthOutput.textContent = `(${passwordLength.toString()})`;
    };

    characters.selectedOptions.forEach((option: string) => {
        const checkbox: HTMLInputElement | null = by.id(option) as HTMLInputElement;
        if (checkbox !== null) checkbox.checked = true;
    });
};

function passwordOptionsEventListeners(): void {
    const passwordLengthInput: HTMLInputElement | null = by.id('password-length-input') as HTMLInputElement;
    const passwordOptions: NodeListOf<HTMLInputElement> = by.qAll('input[type="checkbox"]');

    passwordLengthInput.addEventListener('input', (event: Event): void => {
        passwordLength = parseInt(passwordLengthInput.value);
        setLocalStorageItem();
        setPasswordOptions();
    });
    
    passwordOptions.forEach((option: HTMLInputElement) => {
        option.addEventListener('change', (event: Event): void => {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            if (target.checked && !characters.selectedOptions.includes(target.id))
                characters.selectedOptions.push(target.id);
            else if (!target.checked)
                characters.selectedOptions = characters.selectedOptions.filter((option: string) => option !== target.id);

            setLocalStorageItem();
            setPasswordOptions();
        });
    });
};

((): void => {
    getLocalStorageItem();
    passwordOptionsEventListeners();
})();