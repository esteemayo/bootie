/* eslint-disable */

const apiEndPoint = 'http://localhost:5900/api/v2/users';

const login = async (email, password) => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: `${apiEndPoint}/login`,
            data: {
                email,
                password
            }
        });

        if (data.status === 'success') {
            alert('Successfully logged in');
            // showAlert('success', 'Successfully logged in');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
        // showAlert('error', err.response.data.message);
    }
};

const logout = async () => {
    try {
        const { data } = await axios({
            method: 'GET',
            url: `${apiEndPoint}/logout`
        });

        if (data.status === 'success') {
            alert('Logged you out!');
            // showAlert('success', 'Logged you out!');
            window, setTimeout(() => {
                location.assign('/auth/login');
            }, 1000);
        }
    } catch (err) {
        alert('Error logging out! Try again');
        // showAlert('error', 'Error logging out! Try again');
    }
};

const forgot = async email => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: `${apiEndPoint}/forgotPassword`,
            data: {
                email
            }
        });

        if (data.status === 'success') {
            alert('Token sent to email');
            // showAlert('success', 'Token sent to email');
            window.setTimeout(() => {
                // location.reload(true);
                location.assign('/auth/forgot');
            }, 1000)
        }
    } catch (err) {
        alert(err.response.data.message);
        // showAlert('error', err.response.data.message);
    }
};

// DOM Element
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.logout--btn');
const forgotPasswordForm = document.querySelector('.form--forgot-password');

// Delegation
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

const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg, time = 7) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
};