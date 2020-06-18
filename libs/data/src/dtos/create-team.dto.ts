import { ApiProperty } from '@nestjs/swagger';
import { UUID } from '@super-heros/data';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTeamDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    minLength: 2,
    maxLength: 255,
    example: 'Justice League',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID(4, { each: true })
  @ApiProperty({
    type: String,
    isArray: true,
    example: ['1d5c02d6-1a8a-449d-b922-5749dab0c798'],
  })
  readonly members: ReadonlyArray<UUID>;
}
