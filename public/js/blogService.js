/* eslint-disable */

const blogEndPoint = 'http://localhost:5900/api/v2/blogs';

const blog = async data => {
    try {
        const { data: res } = await axios({
            method: 'POST',
            url: blogEndPoint,
            data
        });

        if (res.status === 'success') {
            alert('Blog successfully posted!');
            window.setTimeout(() => {
                // location.assign('/admin/blogs');
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

const updateBlog = async (data, blogId) => {
    try {
        const { data: res } = await axios({
            method: 'PATCH',
            url: `${blogEndPoint}/${blogId}`,
            data
        });

        if (res.status === 'success') {
            alert('Blog Updated');
            window.setTimeout(() => {
                location.assign('/admin/blogs');
            }, 1000);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

// DOM Element
const addBlogForm = document.querySelector('.form--add-blog');
const updateBlogForm = document.querySelector('.form--update-blog');

// Delegation
if (addBlogForm)
    addBlogForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('title', document.getElementById('title').value);
        form.append('description', document.getElementById('description').value);
        form.append('summary', document.getElementById('summary').value);
        form.append('category', document.getElementById('category').value);
        form.append('price', document.getElementById('price').value);
        form.append('images', document.getElementById('images').files[0]);
        form.append('images', document.getElementById('images').files[1]);

        blog(form);
    });

if (updateBlogForm)
    updateBlogForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('title', document.getElementById('title').value);
        form.append('description', document.getElementById('description').value);
        form.append('summary', document.getElementById('summary').value);
        form.append('category', document.getElementById('category').value);
        form.append('price', document.getElementById('price').value);
        form.append('images', document.getElementById('images').files[0]);
        form.append('images', document.getElementById('images').files[1]);

        const blogId = document.getElementById('blogId').value;

        updateBlog(form, blogId);
    });