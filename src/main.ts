import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import path from 'path';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
