"use server"
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_CREDENTIALS
    }
});


export const sendVerificationEmail = async( email : string, name : string, token : string ) => {
    try {
        
        const verificationUrl = `${process.env.ORIGIN}/verification?token=${token}`;
        await transporter.sendMail({
            from : process.env.EMAIL_USERNAME,
            to : email,
            subject : "Verify your account",
            html : `<p>Hello ${name}</p>
                    <p>Verify your account by clicking here</p>
                    <a href="${verificationUrl}">Link</a>
            `
        });

    } catch (error) {
        console.error("NODEMAILER VERIFICATION EMAIL ERROR", email);
    }
}

export const sendForgetPasswordEmail = async( email : string, name : string, token : string ) => {
    try {
        
        const verificationUrl = `${process.env.ORIGIN}/reset?token=${token}`;
        await transporter.sendMail({
            from : process.env.EMAIL_USERNAME,
            to : email,
            subject : "Forget your password",
            html : `<p>Hello ${name}</p>
                    <p>Reset your password by clicking here</p>
                    <a href="${verificationUrl}">Link</a>
            `
        });

    } catch (error) {
        console.error("NODEMAILER FORGET PASSWORD EMAIL ERROR", email);
    }
}