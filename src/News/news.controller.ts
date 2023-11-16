import { Controller, HttpCode, Get, Req, Post, Body, UseGuards } from '@nestjs/common'
import { User } from 'src/auth/decorators'
import { NewsService } from './news.service'
import { JwtGuard } from '../auth/guards'
import { NewsDto } from './dtos'

@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(JwtGuard)
  @Get('news')
  @HttpCode(200)
  async news() {
    return await this.newsService.getAllNews()
  }

  @UseGuards(JwtGuard)
  @Post('news')
  @HttpCode(201)
  async createNews(@Body() body: NewsDto, @User('id') userId: { id: string }) {
    return await this.newsService.createNews({ ...body, authorId: userId.id })
  }
}
