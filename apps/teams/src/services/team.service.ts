import { Injectable } from '@nestjs/common';
import { SearchPredicate } from '@super-heros/core';
import { CreateTeamDTO, Team, UpdateTeamDTO, UUID } from '@super-heros/data';
import { plainToClass } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { TeamRepository } from '../repositories';

@Injectable()
export class TeamService {
  private static fromDTO(id: UUID, dto: CreateTeamDTO | UpdateTeamDTO): Team {
    return plainToClass(Team, {
      ...dto,
      [Team.identifierKey]: id,
    });
  }

  readonly #teamRepository: TeamRepository;

  constructor(teamRepository: TeamRepository) {
    this.#teamRepository = teamRepository;
  }

  public async find(
    input: Partial<Team> | ReadonlyArray<SearchPredicate<Team>>,
  ): Promise<ReadonlyArray<Team>> {
    return this.#teamRepository.find(input);
  }

  public async findOne(id: UUID): Promise<Readonly<Team> | null> {
    return this.#teamRepository.findOne(id);
  }

  public async create(dto: CreateTeamDTO): Promise<boolean> {
    const hero: Team = TeamService.fromDTO(uuidv4(), dto);

    return this.#teamRepository.create(hero);
  }

  public async update(teamId: UUID, dto: UpdateTeamDTO): Promise<boolean> {
    const hero: Team = TeamService.fromDTO(teamId, dto);

    return this.#teamRepository.update(teamId, hero);
  }

  public async delete(teamId: UUID): Promise<boolean> {
    return this.#teamRepository.delete(teamId);
  }
}
