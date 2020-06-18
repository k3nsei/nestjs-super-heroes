import { Injectable } from '@nestjs/common';
import { SearchPredicate } from '@super-heros/core';
import { CreateHeroDTO, Hero, UpdateHeroDTO, UUID } from '@super-heros/data';
import { plainToClass } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { HeroRepository } from '../repositories';

@Injectable()
export class HeroService {
  private static fromDTO(id: UUID, dto: CreateHeroDTO | UpdateHeroDTO): Hero {
    return plainToClass(Hero, {
      ...dto,
      [Hero.identifierKey]: id,
    });
  }

  readonly #heroRepository: HeroRepository;

  constructor(heroRepository: HeroRepository) {
    this.#heroRepository = heroRepository;
  }

  public async find(
    pattern: Partial<Hero> | ReadonlyArray<SearchPredicate<Hero>>,
  ): Promise<ReadonlyArray<Hero>> {
    return this.#heroRepository.find(pattern);
  }

  public async findOne(id: UUID): Promise<Readonly<Hero> | null> {
    return this.#heroRepository.findOne(id);
  }

  public async create(dto: CreateHeroDTO): Promise<boolean> {
    const hero: Hero = HeroService.fromDTO(uuidv4(), dto);

    return this.#heroRepository.create(hero);
  }

  public async update(heroId: UUID, dto: UpdateHeroDTO): Promise<boolean> {
    const hero: Hero = HeroService.fromDTO(heroId, dto);

    return this.#heroRepository.update(heroId, hero);
  }

  public async delete(heroId: UUID): Promise<boolean> {
    return this.#heroRepository.delete(heroId);
  }
}
