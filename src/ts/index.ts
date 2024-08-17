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
    [key: string]: string | string[];
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
    if (settings === null) {
        setLocalStorageItem();
        return getLocalStorageItem();
    };

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
    const passwordLengthInput: HTMLInputElement = by.id('password-length-input')! as HTMLInputElement;
    const passwordLengthOutput: HTMLElement = by.id('password-length-output')!;

    passwordLengthInput.value = passwordLength.toString();
    passwordLengthOutput.textContent = `(${passwordLength.toString()})`;

    characters.selectedOptions.forEach((option: string) => {
        const checkbox: HTMLInputElement = by.id(option)! as HTMLInputElement;
        checkbox.checked = true;
    });
};

function passwordOptionsEventListeners(): void {
    const passwordLengthInput: HTMLInputElement = by.id('password-length-input')! as HTMLInputElement;
    const passwordOptions: HTMLInputElement[] = by.qAll('input[type="checkbox"]')! as HTMLInputElement[];

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

            if (characters.selectedOptions.length === 0) {
                notificatation('Must select at least one option!');
                characters.selectedOptions.push(target.id);
            }

            setLocalStorageItem();
            setPasswordOptions();
        });
    });
};

function generatePassword(): void {
    let password: string = '';
    let possibleCharacters: string = '';

    characters.selectedOptions.forEach((option: string) => {
        const selectedOption: string = characters[option] as string;
        possibleCharacters += selectedOption;
    })

    for (let i = 0; i < passwordLength; i++) {
        const randomCharacter: string = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
        password += randomCharacter;
    }

    const passwordOutput: HTMLElement = by.id('password-output')!;
    passwordOutput.textContent = password;

    const history: HTMLElement = by.id('history-list')!;
    if (history.children.length === 0) addHistoryItem();
};

function generatePasswordEventListener(): void {
    const generatePasswordButton: HTMLElement = by.id('generate-password-btn')!;
    generatePasswordButton.addEventListener('click', () => {
        generatePassword();
        addHistoryItem();
    });
};

function copyPasswordEventListeners(): void {
    const passwordOutput: HTMLElement = by.id('password-output')!;
    const copyPasswordButton: HTMLElement = by.id('copy-password-btn')!;
    const elements: HTMLElement[] = [passwordOutput, copyPasswordButton];

    elements.forEach((element: HTMLElement) => {
        element.addEventListener('click', () => copyPasswordToClipboard());
    });
};

function copyPasswordToClipboard(): void {
    const passwordOutput: HTMLElement = by.id('password-output')!;
    navigator.clipboard.writeText(passwordOutput.textContent!);
    notificatation('Password copied to clipboard!');
}

function addHistoryItem(): void {
    const history: HTMLElement = by.id('history-list')!;
    const historyIndex: HTMLElement[] = by.qAll('.history-item')! as HTMLElement[];
    const password: string = by.id('password-output')!.textContent!;
    const historyItem: HTMLLIElement = makeHistoryItem(password, historyIndex.length);
    const historyBreak: HTMLElement = document.createElement('br');

    history.appendChild(historyItem);
    history.appendChild(historyBreak);

    historyItem.addEventListener('click', () => {
        navigator.clipboard.writeText(password);
        notificatation('Password copied to clipboard!');
    });
};

function makeHistoryItem(password: string, index: number): HTMLLIElement {
    const historyItem: HTMLLIElement = document.createElement('li');
    const historyIndex: HTMLSpanElement = document.createElement('span');
    const historyPassword: HTMLSpanElement = document.createElement('span');
    const historyCopyIcon: HTMLElement = document.createElement('i');

    historyIndex.textContent = `${index + 1}.`;
    historyPassword.textContent = password;

    historyItem.classList.add('history-item');
    historyCopyIcon.classList.add('fa-regular', 'fa-copy');

    historyItem.appendChild(historyIndex);
    historyItem.appendChild(historyPassword);
    historyItem.appendChild(historyCopyIcon);
    historyItem.appendChild(historyCopyIcon);

    return historyItem;
};

function clearHistoryEventListener(): void {
    const clearHistoryButton: HTMLElement = by.id('clear-history-btn')!;
    clearHistoryButton.addEventListener('click', () => {
        const history: HTMLElement = by.id('history-list')!;
        history.innerHTML = '';
        generatePassword();
        notificatation('History cleared!');
    });
};

function notificatation(message: string): void {
    const notificationElement: HTMLElement = by.id('notification')!;
    const notificationMessage: HTMLElement = by.q('#notification p')!;

    notificationMessage.textContent = message;
    notificationElement.style.opacity = '1';

    setTimeout(() => {
        notificationElement.style.opacity = '0';
    }, 2000);
};

((): void => {
    getLocalStorageItem();
    passwordOptionsEventListeners();
    generatePassword();
    generatePasswordEventListener();
    copyPasswordEventListeners();
    clearHistoryEventListener();
})();