import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsOptional()
  name: string

}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
