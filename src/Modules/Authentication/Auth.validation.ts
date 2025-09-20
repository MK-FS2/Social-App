import { z ,ZodType } from "zod";
import { phoneRegex, passwordRegex, onlyLettersRegex } from "../../DB/Models/User/UserRejex";
import { RegisterDTO, ResetPasswordDTO, SendOTPDTO, VerfiyEmailDTO } from "./AuthDTO";

export const RegisterSchema:ZodType<RegisterDTO> = z.object({
  FName: z.string().min(2, "First name must be at least 2 characters long").max(10,"First name cant exede 10 chracters long").regex(onlyLettersRegex,"Only characters are allowed"),
  Lname: z.string().min(2, "Last name must be at least 2 characters long").max(10,"Last  name cant exede 10 chracters long").regex(onlyLettersRegex,"Only characters are allowed"),
  Email: z.email("Invalid email format"),
  Phone: z.string().regex(phoneRegex, "Invalid phone number"),
  Password: z.string().regex(passwordRegex, "Password is too weak"),
});

export const VerifyEmailSchema:ZodType<VerfiyEmailDTO> = z.object({
Email:z.email("Invalid email format"),
OTP:z.string().min(5,"invalid OTP").max(5,"Invalid OTP")
})

export const SendOTPSchema:ZodType<SendOTPDTO>=z.object({
  Email:z.email("Invalid email")
})



export const ResetPasswordSchema: ZodType<ResetPasswordDTO> = z.object({
  Email: z.email("Invalid email"),
  OTP: z.string().min(5, "OTP is required").max(5, "Invalid OTP format"),
  NewPassword: z.string().regex(passwordRegex, "Password is too weak"),
  RePassword: z.string().regex(passwordRegex, "Password is too weak"),
});