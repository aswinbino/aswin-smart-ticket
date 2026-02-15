const sendEmail = async (options) => {
    // In a real app, you would use Nodemailer or an API like SendGrid here.
    // For now, we will just log the email to the console.

    console.log(`
    ========================================
    EMAIL SENT
    To: ${options.email}
    Subject: ${options.subject}
    Message: ${options.message}
    ========================================
    `);
};

module.exports = sendEmail;
