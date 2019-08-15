'use strict'

const props = {
    mask: '+7(985)III-**-**', // Маска
    inputClass: 'form__input', // Класс поля input
    errorClass: 'form__error', // Класс поля для вывода сообщения об ошибке
    inputErrorClass: 'form__input-wrong-number', // Класс для выделения input при ошибке
    container: 'form__field-wrapper', // Класс контейнера в котором лежит элемент
    serverCheck: serverSideCheck, // Метод симулирующий обращение к серверу для проверки номера
    serverOk: serverConfirm // Метод, который вызывается если номер совпал
}

class PhoneCheck {
    constructor({ mask, inputClass, errorClass, container, inputErrorClass, serverCheck, serverOk }) {
        this._mask = mask;
        this._inputClass = inputClass;
        this._errorElement = document.querySelector(`.${errorClass}`);
        this._container = container;
        this._inputErrorClass = inputErrorClass;
        this._serverHandler = serverCheck;
        this._serverOk = serverOk;
        this._inputsToEdit = [];
        this.render();
    }

    render() {
        const container = document.querySelector(`.${this._container}`);
        container.appendChild(this.createInput());
        container.addEventListener('keyup', () => this.handlerOfTyping(event));
        container.addEventListener('focusin', () => this.handlerOfFocus(event));
        this._inputsToEdit[0].focus();
    }
    // Собираем элемент
    createInput() {
        const fragment = document.createDocumentFragment();
        this._mask.split('').forEach(sign => {
            let inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.minLength = '1';
            inputElement.maxLength = '1';
            inputElement.size = '1';
            inputElement.classList.add(this._inputClass);
            if (sign === '*') {
                inputElement.value = '•';
                inputElement.setAttribute('disabled', true);
            }
            else if (!isNaN(Number(sign))) {
                inputElement.value = `${sign}`;
                inputElement.setAttribute('disabled', true);
            }
            else if (sign === 'I') {
                inputElement.value = ``;
                inputElement.placeholder = '_';
                inputElement.pattern = '\\d';
                this._inputsToEdit.push(inputElement);
            }
            else {
                inputElement = null;
                inputElement = document.createElement('span');
                inputElement.textContent = sign;
            }
            fragment.appendChild(inputElement);

        });
        return fragment;
    }

    handlerOfTyping(event) {
        let index = this._inputsToEdit.indexOf(event.target);
        this.removeErrors();
        
        if (event.code==='Backspace') {
            this._inputsToEdit[index].value ='';
            if (index!==0) index--;
            this._inputsToEdit[index].focus();
            this._inputsToEdit[index].select();
            return;
        }

        if (isNaN(Number(event.key))) {
            event.target.value = '';
            return;
        }
        
        const data = this._inputsToEdit.map(item => item.value);

        if (this.fieldsIsNotEmpty()) {
            if (!this._serverHandler(data)) {
                this.setErrors();
            }
            else {
                this._serverOk(data);
            }
        }
        else {
            
            if (index < (this._inputsToEdit.length - 1)) {this._inputsToEdit[index + 1].focus();}
        }
    }
    
    handlerOfFocus(event) {
        this._inputsToEdit.forEach(input => {
            if (input === event.target) {
                this.removeErrors();
            }
        })
    }
    // Проверяем заполены ли все пустые input
    fieldsIsNotEmpty() {
        let isValueEmpty = true;
        this._inputsToEdit.forEach(input => {
            if (input.value === '') isValueEmpty = false;
        });
        return isValueEmpty;
    }
    // Убираем информацию об ошибке
    removeErrors() {
        this._inputsToEdit.forEach(input => { input.classList.remove(this._inputErrorClass); });
        this._errorElement.textContent = '';
    }
    // Выводим информацию об ошибке
    setErrors() {
        this._inputsToEdit.forEach(input => { input.classList.add(this._inputErrorClass); input.blur(); });
        this._errorElement.textContent = 'Неверный номер, попробуйте еще раз';
    }
}

// Эмуляция ответа сервера, метод передается в объект класса
// Если первая вводимая цифра 5 и более, то вернет ошибку, если меньше 5 -- то вернет ok.
function serverSideCheck(data) {
    return data[0] >= 5 ? false : true;
}
// Обработчик который получает массив введенных цифр номера, передается в объект класса
function serverConfirm(data) {
    console.log(`--- Номер введен верно ${data.join('-')}`);
}

// Создание объекта класса
const phone = new PhoneCheck(props);