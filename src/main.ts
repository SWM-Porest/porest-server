import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  process.on('SIGINT', () => {
    app.close();
    process.exit(0);
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000, () => {
    process.send('ready');
  });
}
bootstrap();
