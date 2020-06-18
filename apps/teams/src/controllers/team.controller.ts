import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoggerService, SearchUtils } from '@super-heros/core';
import {
  Alignment,
  CreateTeamDTO,
  Team,
  UpdateTeamDTO,
  UUID,
} from '@super-heros/data';
import { TeamService } from '../services';

@Controller()
export class TeamController {
  readonly #logger: LoggerService;

  readonly #teamService: TeamService;

  constructor(logger: LoggerService, teamService: TeamService) {
    this.#logger = logger;
    this.#teamService = teamService;
  }

  @MessagePattern({ query: 'find-teams' })
  public async find(
    @Payload()
    payload: {
      name: string;
      meanAlignment: Alignment;
      memberId: UUID;
    },
  ): Promise<ReadonlyArray<Team>> {
    return await this.#teamService.find([
      SearchUtils.contains<Team>('name', payload.name),
      SearchUtils.equal<Team>('meanAlignment', payload.meanAlignment),
      SearchUtils.includes<Team>('members', payload.memberId),
    ]);
  }

  @MessagePattern({ query: 'find-team' })
  public async findOne(
    @Payload() payload: { teamId: UUID },
  ): Promise<Readonly<Team> | null> {
    const team: Team | null = await this.#teamService.findOne(payload.teamId);

    if (!team) {
      throw new RpcException(
        `There is no team with this teamId = ${payload.teamId}`,
      );
    }

    return team;
  }

  @MessagePattern({ cmd: 'create-team' })
  public async create(
    @Payload() payload: { dto: CreateTeamDTO },
  ): Promise<void> {
    await this.#teamService.create(payload.dto);
  }

  @MessagePattern({ cmd: 'update-team' })
  public async update(
    @Payload() payload: { teamId: UUID; dto: UpdateTeamDTO },
  ): Promise<void> {
    await this.#teamService.update(payload.teamId, payload.dto);
  }

  @MessagePattern({ cmd: 'delete-team' })
  public async delete(@Payload() payload: { teamId: UUID }): Promise<void> {
    await this.#teamService.delete(payload.teamId);
  }
}
