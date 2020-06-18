import { Alignment, UUID } from '../definitions';

const TEAM_IDENTIFIER_KEY = 'teamId';

export class Team {
  public static get identifierKey(): string {
    return TEAM_IDENTIFIER_KEY;
  }

  public readonly [TEAM_IDENTIFIER_KEY]: UUID;

  public readonly name: string;

  public readonly meanAlignment: Alignment;

  public readonly members: ReadonlyArray<UUID>;
}
