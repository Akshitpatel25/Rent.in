import nodemailer from 'nodemailer';
import User from "@/models/user.model";
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        // create a hased token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "EMAIL_VERIFICATION") {
            await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if (emailType === "PASSWORD_RESET"){
            const u = await User.findByIdAndUpdate(userId,{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
            console.log("nodemailer:",u);
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        // var transport = nodemailer.createTransport({
        //     host: "sandbox.smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //     user: "cd55a729e7eab2",
        //     pass: "bb5572d23bf1f0"
        //     }
        // });

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });


        const mailOptions = {
            from: 'Support@rent.in',
            to: email,
            subject: emailType === "EMAIL_VERIFICATION" ? "Verify your email" : "Reset your password",
            html: emailType === "EMAIL_VERIFICATION" ? `<p>Click <a href="${process.env.NEXT_PUBLIC_DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link given below in your browser. <br> ${process.env.NEXT_PUBLIC_DOMAIN}/verifyemail?token=${hashedToken}
            </p>` :
            `<p>Click <a href="${process.env.NEXT_PUBLIC_DOMAIN}/forgetpass-email-verification/token?=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link given below in your browser. <br> ${process.env.NEXT_PUBLIC_DOMAIN}/forgetpass-email-verification/token?=${hashedToken}
            </p>`
        }

        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}