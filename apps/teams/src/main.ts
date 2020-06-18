import { INestMicroservice, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { TcpOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { TeamsModule } from './teams.module';

async function bootstrap(): Promise<void> {
  const LISTEN_ON: string = process.env.TEAMS_SERVICE_HOST ?? '4002';

  const app: INestMicroservice = await NestFactory.createMicroservice<
    TcpOptions
  >(TeamsModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(LISTEN_ON),
    },
  });

  await app.listenAsync();

  Logger.log(`Microservice is listening on port ${LISTEN_ON}`, 'TeamsService');
}

void bootstrap();
