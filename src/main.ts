import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import path from 'path';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-documents', app, document);
  await app.listen(3000);
}
bootstrap();
