import { Controller, HttpCode, Get, Req, Post, Patch, Body, UseGuards, Logger } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto } from './dtos'
import { ResponseUser } from 'src/types/types'
import { Request } from 'express'
import { JwtGuard } from './guards'
import { User } from './decorators'

@Controller()
export class AuthController {
  private readonly logger = new Logger('AuthController')

  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterDto): Promise<ResponseUser> {
    this.logger.verbose(`Registering user ${body.email}`)
    return await this.AuthService.register(body)
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto): Promise<ResponseUser> {
    return await this.AuthService.login(body)
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  @HttpCode(200)
  async profile(@User('email') user: { email: string }): Promise<ResponseUser> {
    return await this.AuthService.profile(user.email)
  }

  @UseGuards(JwtGuard)
  @Patch('change-profile')
  @HttpCode(200)
  async changeProfile(@Body() body: any ,@User('email') user: { email: string }): Promise<ResponseUser> {
    return await this.AuthService.chageProfile({...body, old_email: user.email})
  }
}
