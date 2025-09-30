import { Authservices } from './Auth.service';
import { Router } from "express";
import FileUpload from "../../Middleware/FileUplode";
import { FileTypes } from "../../Middleware/FileUplode/filetypes";
import { ErrorCatcher } from "../../Middleware/ErrorCacher";
import { SchemaValidator } from '../../Middleware/SchemaValidator';
import { RegisterSchema, ResetPasswordSchema, SendOTPSchema, VerifyEmailSchema } from './Auth.validation';
import { Authenticate } from '../../Middleware/Authentecation';

const AuthRout:Router = Router()
const authservices = new Authservices()
AuthRout.post("/Signup",FileUpload(1*1024*1024,FileTypes.Image).single("ProfilePicture"),SchemaValidator(RegisterSchema), ErrorCatcher(authservices.CreateUserAccount.bind(authservices)))
AuthRout.post("/VeirfyEmail",SchemaValidator(VerifyEmailSchema),ErrorCatcher(authservices.VerfiyEmail.bind(authservices)))
AuthRout.post("/SendOTP",SchemaValidator(SendOTPSchema),ErrorCatcher(authservices.SendOTP.bind(authservices)))
AuthRout.post("/ResetOTP",SchemaValidator(SendOTPSchema),ErrorCatcher(authservices.SendOTPResetPassword.bind(authservices)))
AuthRout.post("/Resetpassword",SchemaValidator(ResetPasswordSchema),ErrorCatcher(authservices.ResetNewPassword.bind(authservices)))
AuthRout.post("/Login",ErrorCatcher(authservices.Login.bind(authservices)))
AuthRout.post("/Logout",Authenticate,ErrorCatcher(authservices.Logout.bind(authservices)))
AuthRout.post("/RefreshToken",Authenticate,ErrorCatcher(authservices.Refresh.bind(authservices)))
export default AuthRout