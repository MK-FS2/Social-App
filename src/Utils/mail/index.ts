import nodemailer from "nodemailer"
import { AppError } from "../Error";



export async function SendMail({toEmail, content, expireTimeInMinutes = 5*60*1000}:{toEmail:string,content:any,expireTimeInMinutes?:number}):Promise<boolean>
{
    try 
    {
        const transport = nodemailer.createTransport(
        {
        service: "gmail",
        auth:
        {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        }
       })
       //expire time
       const ExpireTimeInMinutes = expireTimeInMinutes/(60 * 1000) 

     const mailOptions = 
     {
      from: `"Social App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px;">Your verification code is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #007bff;">${content}</p>
          <p style="font-size: 14px; color: #555;">This code will expire in ${ExpireTimeInMinutes} minute(s).</p>
        </div>
      `,
    };

    const SendResult = await transport.sendMail(mailOptions)
     if(SendResult.rejected.length > 0)
     {
     return false
     }
     else 
     {
     return true
     }
    }
    catch(err)
    {
    throw new AppError("server Error SN-OT",500)
    }
}