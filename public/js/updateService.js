/* eslint-disable */

const userApiEndPoint = 'http://localhost:5900/api/v2/users';

const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' ?
            `${userApiEndPoint}/updateMyPassword` :
            `${userApiEndPoint}/updateMe`;

        const { data: res } = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.status === 'success') {
            alert(`${type.toUpperCase()} updated successfully!`);
            window.setTimeout(() => {
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const deactivateUserAccount = async () => {
    try {
        await axios({
            method: 'DELETE',
            url: `${userApiEndPoint}/deleteMe`
        });

        alert('Account successfully deactivated.');
        location.reload(true);
    } catch (err) {
        alert(err.response.data.message);
    }
};

// DOM Element
const updateUserData = document.querySelector('.form-user-data');
const updateUserPassword = document.querySelector('.form-user-password');
const deleteUserAccount = document.querySelector('.delete-user');

// Delegation
if (updateUserData)
    updateUserData.addEventListener('submit', e => {
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
        form.append('photo', document.getElementById('photo').files[0]);

        updateSettings(form, 'data');
    });

if (updateUserPassword)
    updateUserPassword.addEventListener('submit', async e => {
        e.preventDefault();

        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        const passwordCurrent = document.getElementById('passwordCurrent').value;

        document.getElementById('password').value = '';
        document.getElementById('passwordConfirm').value = '';
        document.getElementById('passwordCurrent').value = '';

        document.querySelector('.btn--save-password').textContent = 'Save Settings';

        console.log({ passwordCurrent, password, passwordConfirm });
        await updateSettings({ password, passwordConfirm, passwordCurrent }, 'password');
    });

if (deleteUserAccount) deleteUserAccount.addEventListener('click', deactivateUserAccount);