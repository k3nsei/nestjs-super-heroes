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
  CreateHeroDTO,
  Hero,
  Team,
  UpdateHeroDTO,
  UUID,
} from '@super-heros/data';
import { Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

type HeroWithTeams = Omit<Hero, 'team'> & { team: Team[] };

@ApiTags('hero')
@Controller('hero')
export class HeroController implements OnApplicationBootstrap, OnModuleDestroy {
  readonly #heroesService: ClientProxy;

  readonly #teamsService: ClientProxy;

  constructor() {
    this.#heroesService = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.HEROES_SERVICE_HOST ?? '127.0.0.1',
        port: Number(process.env.HEROES_SERVICE_PORT ?? '4001'),
      },
    });

    this.#teamsService = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.TEAMS_SERVICE_HOST ?? '127.0.0.1',
        port: Number(process.env.TEAMS_SERVICE_PORT ?? '4002'),
      },
    });
  }

  public async onApplicationBootstrap(): Promise<void> {
    await this.#heroesService.connect();
    await this.#teamsService.connect();
  }

  public onModuleDestroy(): void {
    this.#heroesService.close();
    this.#teamsService.close();
  }

  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'alignment', enum: Alignment, required: false })
  @ApiQuery({ name: 'teamId', type: String, required: false })
  @Get()
  public find(
    @Optional() @Query('name') name: string,
    @Optional() @Query('alignment') alignment: Alignment,
    @Optional() @Query('teamId') teamId: UUID,
  ): Observable<HeroWithTeams[]> {
    return this.#heroesService
      .send<Hero[]>({ query: 'find-heroes' }, { name, alignment, teamId })
      .pipe(
        withLatestFrom(
          this.#teamsService.send<Team[]>({ query: 'find-teams' }, {}),
        ),
        map(([heroes, teams]: [Array<Hero>, Array<Team>]): HeroWithTeams[] => {
          return heroes.map(
            (hero: Hero): HeroWithTeams => {
              const team: Team[] = hero.team
                .map(
                  (teamId: UUID): Team =>
                    teams.find(
                      (t: Team): boolean => t[Team.identifierKey] === teamId,
                    ),
                )
                .filter(Boolean);

              return {
                ...hero,
                team,
              };
            },
          );
        }),
      );
  }

  @Get(':heroId')
  public findOne(
    @Param('heroId', ParseUUIDPipe) heroId: UUID,
  ): Observable<HeroWithTeams | null> {
    return this.#heroesService
      .send<Readonly<Hero> | null>({ query: 'find-hero' }, { heroId })
      .pipe(
        switchMap(
          (hero: Hero | null): Observable<HeroWithTeams | null> => {
            if (!hero) {
              return of(null);
            }

            return of(hero).pipe(
              withLatestFrom(
                this.#teamsService.send<Team[]>({ query: 'find-teams' }, {}),
              ),
              map(
                ([hero, teams]: [Hero, Array<Team>]): HeroWithTeams => {
                  const team: Team[] = hero.team
                    .map(
                      (teamId: UUID): Team =>
                        teams.find(
                          (t: Team): boolean =>
                            t[Team.identifierKey] === teamId,
                        ),
                    )
                    .filter(Boolean);

                  return {
                    ...hero,
                    team,
                  };
                },
              ),
            );
          },
        ),
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
  public create(@Body() dto: CreateHeroDTO): Observable<void> {
    return this.#heroesService.send<void>({ cmd: 'create-hero' }, { dto });
  }

  @Patch(':heroId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
    }),
  )
  public update(
    @Param('heroId', ParseUUIDPipe) heroId: UUID,
    @Body() dto: UpdateHeroDTO,
  ): Observable<void> {
    return this.#heroesService.send<void>(
      { cmd: 'update-hero' },
      { heroId, dto },
    );
  }

  @Delete(':heroId')
  public delete(
    @Param('heroId', ParseUUIDPipe) heroId: UUID,
  ): Observable<void> {
    return this.#heroesService.send<void>({ cmd: 'delete-hero' }, { heroId });
  }
}
