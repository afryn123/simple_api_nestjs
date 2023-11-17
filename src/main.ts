import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import * as bodyParser from 'body-parser'
import * as multer from 'multer'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('bootstrap')
  const port = 3000
  // app.use(multer({dest:'./uploads'}).single('file'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.useGlobalPipes(
    new ValidationPipe(),
  );
  await app.listen(port)
  logger.log(`Application listening on port ${port}`)
}
bootstrap()
