/* eslint-disable */

const productEndPoint = 'http://localhost:5900/api/v2/products';

const product = async data => {
    try {
        const { data: res } = await axios({
            method: 'POST',
            url: productEndPoint,
            data
        });

        if (res.status === 'success') {
            alert('Product successfully added.');
            window.setTimeout(() => {
                location.assign('/admin/products');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const updateProduct = async (data, productId) => {
    try {
        const { data: res } = await axios({
            method: 'PATCH',
            url: `${productEndPoint}/${productId}`,
            data
        });

        if (res.status === 'success') {
            alert('Product updated');
            window.setTimeout(() => {
                location.assign('/admin/products');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

// DOM Element
const addProductForm = document.querySelector('.form--add-product');
const updateProductForm = document.querySelector('.form--edit-product');

// Delegation
if (addProductForm)
    addProductForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('name', document.getElementById('name').value);
        form.append('description', document.getElementById('description').value);
        form.append('summary', document.getElementById('summary').value);
        form.append('category', document.getElementById('category').value);
        form.append('price', document.getElementById('price').value);
        form.append('priceDiscount', document.getElementById('priceDiscount').value);
        form.append('image', document.getElementById('image').files[0]);

        product(form);
    });

if (updateProductForm)
    updateProductForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('name', document.getElementById('name').value);
        form.append('description', document.getElementById('description').value);
        form.append('summary', document.getElementById('summary').value);
        form.append('category', document.getElementById('category').value);
        form.append('price', document.getElementById('price').value);
        form.append('priceDiscount', document.getElementById('priceDiscount').value);
        form.append('image', document.getElementById('image').files[0]);

        const productId = document.getElementById('productId').value

        updateProduct(form, productId);
    });