/* eslint-disable */

const categoryEndPoint = 'http://localhost:5900/api/v2/categories';

const category = async name => {
    try {
        const { data } = await axios({
            method: 'POST',
            url: categoryEndPoint,
            data: {
                name
            }
        });

        if (data.status === 'success') {
            alert('Category added successfully!');
            window.setTimeout(() => {
                location.assign('/admin/categories');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const editCategory = async (name, catId) => {
    try {
        const { data } = await axios({
            method: 'PATCH',
            url: `${categoryEndPoint}/${catId}`,
            data: {
                name
            }
        });

        if (data.status === 'success') {
            alert('Category Updated!');
            window.setTimeout(() => {
                location.assign('/admin/categories');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

// DOM Element
const categoryForm = document.querySelector('.form--add-category');
const editCategoryForm = document.querySelector('.form--edit-category');

// Delegation
if (categoryForm)
    categoryForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value;

        category(name);
    });

if (editCategoryForm)
    editCategoryForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const catId = document.getElementById('catId').value;
        // const { catId } = e.target.dataset;

        console.log({ name, catId });
        editCategory(name, catId);
    });