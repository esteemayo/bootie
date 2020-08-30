
import { login, logout, forgot } from './authService.js';
import { register } from './userService.js';



// DOM Element
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.logout--btn');
const registerForm = document.querySelector('.form--register');
const forgotPasswordForm = document.querySelector('.form--forgot-password');

// Delegation
if (registerForm)
    registerForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('firstName', document.getElementById('firstName').value);
        form.append('lastName', document.getElementById('lastName').value);
        form.append('email', document.getElementById('email').value);
        form.append('username', document.getElementById('username').value);
        form.append('phone', document.getElementById('phone').value);
        form.append('dateOfBirth', document.getElementById('dateOfBirth').value);
        form.append('streetAddress', document.getElementById('streetAddress').value);
        form.append('city', document.getElementById('city').value);
        form.append('state', document.getElementById('state').value);
        form.append('zipCode', document.getElementById('zipCode').value);
        form.append('bio', document.getElementById('bio').value);
        form.append('password', document.getElementById('password').value);
        form.append('passwordConfirm', document.getElementById('passwordConfirm').value);
        form.append('photo', document.getElementById('photo').files[0]);

        register(form);
    });

if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    });

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (forgotPasswordForm)
    forgotPasswordForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;

        forgot(email);
    });