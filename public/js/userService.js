/* eslint-disable */
// const apiEndPoint = 'http://localhost:5900/api/v2/users';

const register = async data => {
    try {
        const { data: res } = await axios({
            method: 'POST',
            url: `${apiEndPoint}/register`,
            data
        });

        if (res.status === 'success') {
            alert('Account created successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

// Dom element
const registerForm = document.querySelector('.form--register');

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
        form.append('gender', document.getElementById('gender').value);
        form.append('city', document.getElementById('city').value);
        form.append('state', document.getElementById('state').value);
        form.append('zipCode', document.getElementById('zipCode').value);
        form.append('bio', document.getElementById('bio').value);
        form.append('password', document.getElementById('password').value);
        form.append('passwordConfirm', document.getElementById('passwordConfirm').value);
        form.append('photo', document.getElementById('photo').files[0]);

        register(form);
    });