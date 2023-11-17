import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class NewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllNews(): Promise<any> {
    try {
      const news = await this.prismaService.post.findMany()
      return {
        statusCode: 200,
        message: 'Success',
        data: news
      }
    } catch (err) {
      throw new BadRequestException('Bad Request')
    }
  }

  async createNews(body: any): Promise<any> {
    try {
      await this.prismaService.post.create({
        data: { ...body }
      })
      return {
        statusCode: 201,
        message: 'Success Create News',
        data: []
      }
    } catch (err) {
      throw new BadRequestException('Bad Request')
    }
  }
}
