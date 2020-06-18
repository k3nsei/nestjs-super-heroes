import { Module } from '@nestjs/common';
import { LoggerModule } from '@super-heros/core';
import { HeroController, TeamController } from './controllers';

@Module({
  imports: [LoggerModule.register('GatewayModule')],
  controllers: [HeroController, TeamController],
})
export class GatewayModule {}
