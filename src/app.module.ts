import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module';
import { NewsModule } from './News/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    NewsModule
  ]
})
export class AppModule {}
