import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import admin from 'firebase-admin';

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { SentryFilter } from './filtters/exception.filter';

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

  if (process.env.NODE_ENV === 'prod') {
    Sentry.init({
      dsn: 'https://975505567072cb58966e66874522e577@o4506160981737472.ingest.sentry.io/4506160990519296',
      integrations: [new ProfilingIntegration()],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    });
  }

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerOptions);

  const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });

  await app.listen(process.env.PORT, () => {
    if (process.send) {
      process.send('ready');
    }
  });
}

bootstrap();
