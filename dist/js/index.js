(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    var SelectBy = /** @class */ (function () {
        function SelectBy() {
            Object.freeze(this);
        }
        SelectBy.prototype.q = function (query) {
            return document.querySelector(query);
        };
        SelectBy.prototype.qAll = function (query) {
            return Array.from(document.querySelectorAll(query));
        };
        SelectBy.prototype.id = function (query) {
            return document.getElementById(query);
        };
        SelectBy.prototype.class = function (query) {
            return Array.from(document.getElementsByClassName(query));
        };
        SelectBy.prototype.tag = function (query) {
            return Array.from(document.getElementsByTagName(query));
        };
        SelectBy.prototype.name = function (query) {
            return Array.from(document.getElementsByName(query));
        };
        SelectBy.prototype.att = function (attribute, query) {
            return this.qAll(query ? "".concat(query, "[").concat(attribute, "]") : "[".concat(attribute, "]"));
        };
        SelectBy.prototype.all = function () {
            var elements = this.qAll('body *');
            return elements.filter(function (element) { return element.nodeName !== 'SCRIPT'; });
        };
        SelectBy.prototype.empty = function () {
            var elements = this.all();
            return elements.filter(function (element) { return element.children.length === 0 && element.textContent === ''; });
        };
        SelectBy.prototype.first = function (query) {
            return this.q(query);
        };
        SelectBy.prototype.last = function (query) {
            var elements = this.qAll(query);
            return elements.length > 0 ? elements[elements.length - 1] : null;
        };
        SelectBy.prototype.parent = function (query) {
            var element = this.q(query);
            return element ? element.parentElement : null;
        };
        SelectBy.prototype.firstChild = function (query) {
            var element = this.q(query);
            return element ? element.firstElementChild : null;
        };
        SelectBy.prototype.lastChild = function (query) {
            var element = this.q(query);
            return element ? element.lastElementChild : null;
        };
        SelectBy.prototype.children = function (query) {
            var element = this.q(query);
            return element ? Array.from(element.children) : [];
        };
        SelectBy.prototype.next = function (query) {
            var element = this.q(query);
            return element ? element.nextElementSibling : null;
        };
        SelectBy.prototype.prev = function (query) {
            var element = this.q(query);
            return element ? element.previousElementSibling : null;
        };
        SelectBy.prototype.index = function (query, index) {
            var element = this.q(query);
            if (!element || typeof index !== 'number' || (index + 1) > element.children.length)
                return null;
            return element.children[index];
        };
        SelectBy.prototype.range = function (query, start, end) {
            var elements = this.qAll(query);
            if (typeof start !== 'number' || start < 0 || start >= elements.length)
                return [];
            return typeof end === 'number' ? elements.slice(start, end) : elements.slice(start);
        };
        SelectBy.prototype.text = function (text, query) {
            var elements = this.qAll(query ? query : '*');
            return elements.filter(function (element) { return element.textContent === String(text); });
        };
        return SelectBy;
    }());
    var by = new SelectBy();

    /* Global Variables */
    var passwordLength = 12;
    /* Default Objects */
    var characters = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()_+',
        selectedOptions: ['lowercase', 'uppercase', 'numbers', 'special'],
    };
    var localStorageItem = {
        passwordLength: passwordLength,
        selectedOptions: characters.selectedOptions,
    };
    /* Methods */
    function getLocalStorageItem() {
        var settings = localStorage.getItem('settings');
        if (settings === null)
            setLocalStorageItem();
        var parsedSettings = JSON.parse(settings || localStorageItem.toString());
        passwordLength = parsedSettings.passwordLength;
        characters.selectedOptions = parsedSettings.selectedOptions;
        setPasswordOptions();
    }
    function setLocalStorageItem() {
        var localStorageItem = {
            passwordLength: passwordLength,
            selectedOptions: characters.selectedOptions,
        };
        localStorage.setItem('settings', JSON.stringify(localStorageItem));
    }
    function setPasswordOptions() {
        var passwordLengthInput = by.id('password-length-input');
        var passwordLengthOutput = by.id('password-length-output');
        if (passwordLengthInput !== null && passwordLengthOutput !== null) {
            passwordLengthInput.value = passwordLength.toString();
            passwordLengthOutput.textContent = "(".concat(passwordLength.toString(), ")");
        }
        characters.selectedOptions.forEach(function (option) {
            var checkbox = by.id(option);
            if (checkbox !== null)
                checkbox.checked = true;
        });
    }
    function passwordOptionsEventListeners() {
        var passwordLengthInput = by.id('password-length-input');
        var passwordOptions = by.qAll('input[type="checkbox"]');
        passwordLengthInput.addEventListener('input', function (event) {
            passwordLength = parseInt(passwordLengthInput.value);
            setLocalStorageItem();
            setPasswordOptions();
        });
        passwordOptions.forEach(function (option) {
            option.addEventListener('change', function (event) {
                var target = event.target;
                if (target.checked && !characters.selectedOptions.includes(target.id))
                    characters.selectedOptions.push(target.id);
                else if (!target.checked)
                    characters.selectedOptions = characters.selectedOptions.filter(function (option) { return option !== target.id; });
                setLocalStorageItem();
                setPasswordOptions();
            });
        });
    }
    (function () {
        getLocalStorageItem();
        passwordOptionsEventListeners();
    })();

}));
