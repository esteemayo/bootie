const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

class ReceiveEmail {
    constructor(name, email, phone, subject, message) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.subject = subject;
        this.message = message;
        this.from = `${name} <${email}>`;
        this.to = process.env.EMAIL_TO;
    }

    smtpTransporter() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }
        // Mailtrap
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Send the actual email
    async send(template) {
        // Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            name: this.name,
            email: this.email,
            phone: this.phone,
            subject: this.subject,
            message: this.message
        });

        // Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            message: this.message,
            phone: this.phone,
            html,
            text: htmlToText.fromString(html)
        };

        // Create a transport and send email
        await this.smtpTransporter().sendMail(mailOptions);
    }

    async contactUs() {
        await this.send('contactUs');
    }
};

module.exports = ReceiveEmail;