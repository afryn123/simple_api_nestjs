import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { genSaltSync, hashSync, compareSync } from 'bcrypt'
import { Register, Login } from 'src/types/interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  private readonly logger = new Logger('AuthService')
  private readonly salt: string = genSaltSync(10)

  async register(body: Register) {
    try {
      const hashedPassword = hashSync(body.password, this.salt)
      await this.prismaService.user.create({
        data: { ...body, password: hashedPassword }
      })
      return {
        statusCode: 200,
        message: 'Registered successfully',
        data: []
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        this.logger.error(`${err.meta.target[0]} already in use`)
        throw new ConflictException('Email already in use')
      }
      throw err
    }
  }

  async login(body: Login) {
    const user = await this.prismaService.user.findUnique({ where: { email: body.email } })
    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }
    const isPasswordValid = compareSync(body.password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials')
    }
    const payload = { email: user.email, name: user.name }
    const token = this.jwtService.sign(payload)
    return {
      statusCode: 200,
      message: 'Sucess Login',
      data: { token }
    }
  }

  async profile(email: string) {
    try{
      const user = await this.prismaService.user.findUnique({ where: { email } })
      if (!user) {
        throw new BadRequestException('Invalid credentials')
      }
      return {
        statusCode: 200,
        message: 'Success',
        data: { user }
      }
    }catch (err) {
      throw  new BadRequestException('Bad Request')
    }
  }

  async chageProfile(payload: any) {
    try{
      const user = await this.prismaService.user.findUnique({ where: { email: payload.old_email } })
      if (!user) {
        throw new BadRequestException('Invalid credentials')
      }
      const hashedPassword = hashSync(payload.password, this.salt)

      const data = {
        email: payload.email, 
        name: payload.name, 
        password: hashedPassword
      }

      await this.prismaService.user.update({
        where: { email: payload.old_email },
        data: data 
      })

      return {
        statusCode: 201,
        message: 'Success Update Profile',
        data: [] 
      }
    }catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        this.logger.error(`${err.meta.target[0]} already in use`)
        throw new ConflictException('Email already in use')
      }
      throw err
    }
  }


}
