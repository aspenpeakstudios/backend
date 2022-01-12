import { createTransport, getTestMessageUrl } from 'nodemailer';
// import 'dotenv/config';

const transport = createTransport({
    // @ts-ignore or any
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

function makeANiceEmail(text: string) {
    return `
        <div style="border:1px solid black; padding: 20px; font-family: sans-serif; line-height:2; font-size: 20px;">
        <h2>Hello There!</h2>
        <p>${text}</p>
        <p>:)</p>
        </div>
    `;
}

// interface MailResponse {
//   message: string;
// }

export async function sendPasswordResetEmail(
    resetToken: string,
    to: string
): Promise<void> {
    // Email the user a token
    const info = await transport.sendMail({
        to,
        from: 'dude@example.com',
        subject: 'Your password reset token',
        html: makeANiceEmail(`Your Password Reset Token is here!
            <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>        
        `),
    });
    if (process.env.MAIL_USER.includes('ethereal.email')) {
        console.log('Mail Message Sent.  Review it at: ', getTestMessageUrl(info));
    }
}
