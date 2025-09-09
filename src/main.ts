import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SnakeCaseInterceptor } from 'snake-case.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new SnakeCaseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
