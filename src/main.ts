import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  if (process.on) {
    process.on('SIGINT', () => {
      app.close();
      process.exit(0);
    });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://pocketrestaurant.net', 'https://pocketrestaurant.net'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('PocketRestaurant API')
    .setDescription('PocketRestaurant API description')
    .setVersion('1.0')
    .addTag('pocekrestaurant')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT, () => {
    if (process.send) {
      process.send('ready');
    }
  });
}
bootstrap();
