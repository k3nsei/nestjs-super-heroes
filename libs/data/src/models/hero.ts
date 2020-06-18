import { Alignment, UUID } from '@super-heros/data/definitions';

const HERO_IDENTIFIER_KEY = 'heroId';

export class Hero {
  public static get identifierKey(): string {
    return HERO_IDENTIFIER_KEY;
  }

  public readonly [HERO_IDENTIFIER_KEY]: UUID;

  public readonly name: string;

  public readonly alignment: Alignment;

  public readonly team: ReadonlyArray<UUID>;
}
