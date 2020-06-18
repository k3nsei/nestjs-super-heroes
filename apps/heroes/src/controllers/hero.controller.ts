import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoggerService, SearchUtils } from '@super-heros/core';
import {
  Alignment,
  CreateHeroDTO,
  Hero,
  UpdateHeroDTO,
  UUID,
} from '@super-heros/data';
import { HeroService } from '../services';

@Controller()
export class HeroController {
  readonly #logger: LoggerService;

  readonly #heroService: HeroService;

  constructor(logger: LoggerService, heroService: HeroService) {
    this.#logger = logger;
    this.#heroService = heroService;
  }

  @MessagePattern({ query: 'find-heroes' })
  public async find(
    @Payload() payload: { name?: string; alignment?: Alignment; teamId?: UUID },
  ): Promise<ReadonlyArray<Hero>> {
    return await this.#heroService.find([
      SearchUtils.contains<Hero>('name', payload.name),
      SearchUtils.equal<Hero>('alignment', payload.alignment),
      SearchUtils.includes<Hero>('team', payload.teamId),
    ]);
  }

  @MessagePattern({ query: 'find-hero' })
  public async findOne(
    @Payload() payload: { heroId: UUID },
  ): Promise<Readonly<Hero> | null> {
    const hero: Hero | null = await this.#heroService.findOne(payload.heroId);

    if (!hero) {
      throw new RpcException(
        `There is no hero with this heroId = ${payload.heroId}`,
      );
    }

    return hero;
  }

  @MessagePattern({ cmd: 'create-hero' })
  public async create(
    @Payload() payload: { dto: CreateHeroDTO },
  ): Promise<void> {
    await this.#heroService.create(payload.dto);
  }

  @MessagePattern({ cmd: 'update-hero' })
  public async update(
    @Payload() payload: { heroId: UUID; dto: UpdateHeroDTO },
  ): Promise<void> {
    await this.#heroService.update(payload.heroId, payload.dto);
  }

  @MessagePattern({ cmd: 'delete-hero' })
  public async delete(@Payload() payload: { heroId: UUID }): Promise<void> {
    await this.#heroService.delete(payload.heroId);
  }
}
