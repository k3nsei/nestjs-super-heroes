import {
  Body,
  Controller,
  Delete,
  Get,
  OnApplicationBootstrap,
  OnModuleDestroy,
  Optional,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Alignment,
  CreateTeamDTO,
  Team,
  UpdateTeamDTO,
  UUID,
} from '@super-heros/data';
import { Observable } from 'rxjs';

@ApiTags('team')
@Controller('team')
export class TeamController implements OnApplicationBootstrap, OnModuleDestroy {
  readonly #teamsService: ClientProxy;

  readonly #heroesService: ClientProxy;

  constructor() {
    this.#teamsService = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.TEAMS_SERVICE_HOST ?? '127.0.0.1',
        port: Number(process.env.TEAMS_SERVICE_PORT ?? '4002'),
      },
    });

    this.#heroesService = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.HEROES_SERVICE_HOST ?? '127.0.0.1',
        port: Number(process.env.HEROES_SERVICE_PORT ?? '4001'),
      },
    });
  }

  public async onApplicationBootstrap(): Promise<void> {
    await this.#teamsService.connect();
    await this.#heroesService.connect();
  }

  public onModuleDestroy(): void {
    this.#teamsService.close();
    this.#heroesService.close();
  }

  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'meanAlignment', enum: Alignment, required: false })
  @ApiQuery({ name: 'memberId', type: String, required: false })
  @Get()
  public find(
    @Optional() @Query('name') name: string,
    @Optional() @Query('meanAlignment') meanAlignment: Alignment,
    @Optional() @Query('memberId') memberId: UUID,
  ): Observable<ReadonlyArray<Team>> {
    return this.#teamsService.send<ReadonlyArray<Team>>(
      { query: 'find-teams' },
      { name, meanAlignment, memberId },
    );
  }

  @Get(':teamId')
  public findOne(
    @Param('teamId', ParseUUIDPipe) teamId: UUID,
  ): Observable<Readonly<Team> | null> {
    return this.#teamsService.send<Readonly<Team> | null>(
      { query: 'find-team' },
      { teamId },
    );
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: false,
    }),
  )
  public create(@Body() dto: CreateTeamDTO): Observable<void> {
    return this.#teamsService.send<void>({ cmd: 'create-team' }, { dto });
  }

  @Patch(':teamId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
    }),
  )
  public update(
    @Param('teamId', ParseUUIDPipe) teamId: UUID,
    @Body() dto: UpdateTeamDTO,
  ): Observable<void> {
    return this.#teamsService.send<void>(
      { cmd: 'update-team' },
      { teamId, dto },
    );
  }

  @Delete(':teamId')
  public delete(
    @Param('teamId', ParseUUIDPipe) teamId: UUID,
  ): Observable<void> {
    return this.#teamsService.send<void>({ cmd: 'delete-team' }, { teamId });
  }
}
