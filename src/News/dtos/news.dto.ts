import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class NewsDto {
  @IsNotEmpty()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  content: string
}


