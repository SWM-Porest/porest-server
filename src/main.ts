import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.on) {
    process.on('SIGINT', () => {
      app.close();
      process.exit(0);
    });
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001, () => {
    if (process.send) {
      process.send('ready');
    }
  });
}
bootstrap();
