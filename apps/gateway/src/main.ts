import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';

async function bootstrap(): Promise<void> {
  const LISTEN_ON: string = process.env.GATEWAY_PORT ?? '4000';

  const app: INestApplication = await NestFactory.create(GatewayModule);

  const options = new DocumentBuilder()
    .setTitle('Super Heroes')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('', app, document);

  await app.listen(LISTEN_ON);

  Logger.log(`Application is listening on port ${LISTEN_ON}`, 'SuperHeroesApp');
}

void bootstrap();
