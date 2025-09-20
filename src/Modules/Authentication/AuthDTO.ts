
export interface RegisterDTO 
{
    FName:string,
    Lname:string
    Email:string,
    Phone:string,
    Password:string
}

export interface VerfiyEmailDTO
{
Email:string,
OTP:string
}

export interface SendOTPDTO 
{
    Email:string
}

export interface ResetPasswordDTO
{
Email :string
OTP:string
NewPassword:string
RePassword:string
}

export interface LoginDTO {
  Email: string;
  Password: string;
}