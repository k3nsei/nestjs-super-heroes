import { InMemoryRepository } from '@super-heros/core';
import { Hero } from '@super-heros/data';

export class HeroRepository extends InMemoryRepository<Hero> {
  constructor() {
    super(Hero.identifierKey);
  }
}
