/* eslint-disable */

// // const stripe = Stripe('pk_test_51HHfZsL3BqD5QWBfd5MpUn2ioLZfK8wqq7V7h23ogrn0MTns2uEExI2guBeBe8Akroav42QtSeidOMajaNNMnRAg00vtGj4L01');
// Stripe('pk_test_51HHfZsL3BqD5QWBfd5MpUn2ioLZfK8wqq7V7h23ogrn0MTns2uEExI2guBeBe8Akroav42QtSeidOMajaNNMnRAg00vtGj4L01');

// var $form = $('#checkout--form');

// $form.submit(function (e) {
//     $('#charge-error').removeClass('hidden');
//     $form.find('button').prop('disabled', true);
//     Stripe.card.createToken({
//         number: $('#cardNumber').val(),
//         cvc: $('#cardCvc').val(),
//         exp_month: $('#cardExpiryMonth').val(),
//         exp_year: $('#cardExpiryYear').val(),
//         name: $('#cardName').val(),
//     }, stripeResponseHandler);
//     return false;
// });

// function stripeResponseHandler(status, response) {
//     if (response.error) {   //Problem!

//         // Show the errors on the form
//         $('#charge-error').text(response.error.message);
//         $('#charge-error').removeClass('hidden');
//         $form.find('button').prop('disabled', false);   // Re-enable submission

//     } else {
//         // Get the token ID!
//         var token = response.id;

//         // Insert the token into the form so it gets submitted to the server:
//         $form.append($('<input type="hidden" name="stripeToken" />').val(token));

//         // Submit the form
//         $form.get(0).submit();
//     }
// };

// const checkoutForm = document.getElementById('checkout--form');

// if (checkoutForm)
//     checkoutForm.addEventListener('submit', e => {
//         e.preventDefault();

//         const number = document.getElementById('cardNumber').value;
//         const cvc = document.getElementById('cardCvc').value;
//         const exp_month = document.getElementById('cardExpiryMonth').value;
//         const exp_year = document.getElementById('cardExpiryYear').value;
//         const name = document.getElementById('cardName').value;

//         stripe.card.createToken({
//             number,
//             cvc,
//             exp_month,
//             exp_year,
//             name
//         }, stripeResponseHandler);
//     });

//     function stripeResponseHandler (status, response) {
//         if (response.error) {
//             // Get the token ID:
//             var token = response.id;

//             // Insert the token into the form so it gets submitted to the server:

//         }
//     }

// const stripe = Stripe('pk_test_51HHfZsL3BqD5QWBfd5MpUn2ioLZfK8wqq7V7h23ogrn0MTns2uEExI2guBeBe8Akroav42QtSeidOMajaNNMnRAg00vtGj4L01');

// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = Stripe('pk_test_51HHfZsL3BqD5QWBfd5MpUn2ioLZfK8wqq7V7h23ogrn0MTns2uEExI2guBeBe8Akroav42QtSeidOMajaNNMnRAg00vtGj4L01');
const elements = stripe.elements();


// Create a token or display an error when the form is submitted.
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // const number = document.getElementById('cardNumber').value;
    // const cvc = document.getElementById('cardCvc').value;
    // const exp_month = document.getElementById('cardExpiryMonth').value;
    // const exp_year = document.getElementById('cardExpiryYear').value;
    // const name = document.getElementById('cardName').value;

    // const card = { number, cvc, exp_month, exp_year, name };

    const { token, error } = await stripe.createToken(card);

    if (error) {
        // Inform the customer that there was an error.
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
    } else {
        // Send the token to your server.
        stripeTokenHandler(token);
    }
});

const stripeTokenHandler = (token) => {
    // Insert the token ID into the form so it gets submitted to the server
    const form = document.getElementById('payment-form');
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
}

// Custom styling can be passed to options when creating an Element.
const style = {
    base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        color: '#32325d',
    },
};

// Create an instance of the card Element.
const card = elements.create('card', { style });

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');