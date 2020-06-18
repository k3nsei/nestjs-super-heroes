import { Module } from '@nestjs/common';
import { LoggerModule } from '@super-heros/core';
import { HeroController } from './controllers';
import { HeroRepository } from './repositories';
import { HeroService } from './services';

@Module({
  imports: [LoggerModule.register('HeroesModule')],
  controllers: [HeroController],
  providers: [HeroRepository, HeroService],
})
export class HeroesModule {}
