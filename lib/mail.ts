"use server";
import nodemailer from "nodemailer";
import { emailVerificationTemplate, forgetPasswordTemplate } from "./mail-templates";

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
            subject : "Verify your email",
            html : emailVerificationTemplate(verificationUrl)
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
            subject : "Reset Your Password - Action Required",
            html : forgetPasswordTemplate(verificationUrl)
        });

    } catch (error) {
        console.error("NODEMAILER FORGET PASSWORD EMAIL ERROR", email);
    }
}