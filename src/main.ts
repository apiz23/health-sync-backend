import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  };

  app.enableCors(corsOptions);
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
