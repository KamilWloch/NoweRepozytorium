import _throttle from 'lodash.throttle';
import * as storage from './storage';

const form = document.querySelector('.feedback-form');
const submitButton = form.querySelector('#submit');
const LOCALSTORAGE_KEY = 'feedback-form-state';
const parsedInput = storage.default.load(LOCALSTORAGE_KEY);
const INPUT_EMPTY_VALUE = '';

function saveMessage() {
    const feedback = getFormValues();
    disableSubmitWhenEmptyValue(feedback);
    storage.default.save(LOCALSTORAGE_KEY, feedback);
}

function getFormValues() {
    const {
        elements: { email, message },
    } = form;
    return {
        email: email.value,
        message: message.value,
    };
}

function disableSubmitWhenEmptyValue(feedback) {
    const isAnyValueEmpty = Object.values(feedback).some((value) => value === INPUT_EMPTY_VALUE);
    if (isAnyValueEmpty) {
        submitButton.setAttribute('disabled', 'true');
    } else {
        submitButton.removeAttribute('disabled');
    }
}

function checkStorage() {
  const {
    elements: { email, message },
  } = form;
  if (parsedInput) {
    email.value = parsedInput.email;
    message.value = parsedInput.message;
  } else {
    email.value = INPUT_EMPTY_VALUE;
    message.value = INPUT_EMPTY_VALUE;
  }
  disableSubmitWhenEmptyValue(getFormValues());
}

function afterSubmit(event) {
  event.preventDefault();
  const {
    elements: { email, message },
  } = event.currentTarget;
  if (email.value === '' || message.value === '') {
    return alert('Please fill in all the fields!');
  }
  console.log(`Email: ${email.value}, Message: ${message.value}`);
  form.reset();
  storage.default.remove(LOCALSTORAGE_KEY);
}

form.addEventListener('input', _throttle(saveMessage, 500));
form.addEventListener('submit', afterSubmit);

window.addEventListener('load', () => checkStorage());