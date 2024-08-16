let passwordlength = 12;

const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    nums: '0123456789',
    special: '!#$%&*+,-.:;=?@^_|~',
    selected: ['lower', 'upper', 'nums', 'special'],
};

const getSettings = () => {
    const settings = localStorage.getItem('settings');
    if (!settings) setSettings();

    const { selected, length } = JSON.parse(localStorage.getItem('settings'));

    chars.selected = selected;
    passwordlength = length;

    by.id('length').value = length;
    by.id('length-value').textContent = length;
    selected.forEach(option => by.id(option).checked = true);
};

const setSettings = () => {
    localStorage.setItem('settings', JSON.stringify({ selected: chars.selected, length: passwordlength }));
};

const lengthChange = () => {
    const length = by.id('length');
    length.addEventListener('input', () => {
        const lengthValue = by.id('length-value');
        lengthValue.textContent = length.value;
        passwordlength = length.value;
        setSettings();
    });
};

const optionsChange = () => {
    const options = by.qAll('input[type="checkbox"]');;
    options.forEach(option => option.addEventListener('change', event => {
        if (event.target.checked && !chars.selected.includes(event.target.id)) {
            chars.selected.push(event.target.id);
        }
        else if (event.target.checked === false) {
            chars.selected = chars.selected.filter(option => option !== event.target.id);
        }
        setSettings();
    }));
};

const generatePassword = () => {
    let password = '';
    for (let i = 0; i < passwordlength; i++) {
        let possibleChars = '';
        chars.selected.forEach(char => {
            possibleChars += chars[char];
        });

        const random = Math.floor(Math.random() * possibleChars.length);
        password = password.concat(possibleChars[random]);

    };

    by.id('password').textContent = password;
    if (by.id('history').children.length === 0)  
        addHistoryitem();
    };

const generatePasswordButton = () => {
    const generate = by.id('generate-password-button');
    generate.addEventListener('click', () => {
        generatePassword();
        addHistoryitem();
    });
};

const addHistoryitem = () => {
    const history = by.id('history');
    const password = by.id('password').textContent;
    const historyItem = makeHistoryItem(password, history.children.length);
    history.appendChild(historyItem);

    historyItem.addEventListener('click', () => {
        navigator.clipboard.writeText(password);
        notification('Password Copied to Clipboard!');
    });
};

const makeHistoryItem = (password, children) => {
    const li = document.createElement('li');
    const num = document.createElement('span');
    const span = document.createElement('span');
    const i = document.createElement('i');

    num.classList.add('history-item-number');
    span.classList.add('history-item');
    i.classList.add('fa-regular', 'fa-copy');
    
    num.textContent = `${children + 1}. `;
    span.textContent = password;
    li.appendChild(num);
    li.appendChild(num);
    li.appendChild(span);
    li.appendChild(i);

    return li;
};

const notification = (text) => {
    const notification = by.id('notification');
    const notificationText = by.q('#notification p');
    notificationText.textContent = text;;
    notification.style.opacity = 1;
    setTimeout(() => {
        notification.style.opacity = 0;
    }, 2000);
};

const copyPassword = () => {
    const password = by.id('password');
    password.addEventListener('click', () => {
        navigator.clipboard.writeText(password.textContent);
        notification('Password Copied to Clipboard!');
    });
};

const copyButtonListener = () => {
    const copyButton = by.q('#copy-password-button');
    copyButton.addEventListener('click', () => {
        const password = by.id('password').textContent;
        navigator.clipboard.writeText(password);
        notification('Password Copied to Clipboard!');
    });
};

const clearHistory = () => {
    const history = by.id('history');
    const clearHistoryButton = by.id('clear-history-button');
    clearHistoryButton.addEventListener('click', () => {
        history.innerHTML = '';
        generatePassword();
        notification('History Cleared!');
    });
};

const main = () => {
    getSettings();
    lengthChange();
    optionsChange();
    copyPassword();
    copyButtonListener();
    generatePasswordButton();
    generatePassword();
    clearHistory();
};
main();

