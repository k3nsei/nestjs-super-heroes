import { InMemoryRepository } from '@super-heros/core';
import { Team } from '@super-heros/data';

export class TeamRepository extends InMemoryRepository<Team> {
  constructor() {
    super(Team.identifierKey);
  }
}
