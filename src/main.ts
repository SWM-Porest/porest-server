import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { setGCMAPIKey, setVapidDetails } from 'web-push';

async function bootstrap() {
  if (process.on) {
    process.on('SIGINT', () => {
      app.close();
      process.exit(0);
    });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://pocketrestaurant.net',
      'https://pocketrestaurant.net',
      'http://192.168.110.215:3000',
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('PocketRestaurant API')
    .setDescription('PocketRestaurant API description')
    .setVersion('1.0')
    .addTag('pocekrestaurant')
    .addApiKey({ type: 'http', scheme: 'bearer', name: 'authorization', in: 'header' }, 'access-token')
    .build();

  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerOptions);

  setGCMAPIKey(process.env.GCM_API_KEY);
  setVapidDetails('https://api.pocketrestaurant.net', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

  await app.listen(process.env.PORT, () => {
    if (process.send) {
      process.send('ready');
    }
  });
}
bootstrap();
