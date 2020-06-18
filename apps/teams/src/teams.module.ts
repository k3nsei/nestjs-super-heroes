import { Module } from '@nestjs/common';
import { LoggerModule } from '@super-heros/core';
import { TeamController } from './controllers';
import { TeamRepository } from './repositories';
import { TeamService } from './services';

@Module({
  imports: [LoggerModule.register('TeamsModule')],
  controllers: [TeamController],
  providers: [TeamRepository, TeamService],
})
export class TeamsModule {}
