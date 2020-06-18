import { ApiProperty } from '@nestjs/swagger';
import { UUID } from '@super-heros/data';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTeamDTO {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    type: String,
    required: false,
    example: '8c9383fe-5615-48ff-9ef5-9c86436fad69',
  })
  readonly teamId: UUID;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    minLength: 2,
    maxLength: 255,
    required: false,
    example: 'Justice League',
  })
  readonly name: string;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    example: ['1d5c02d6-1a8a-449d-b922-5749dab0c798'],
  })
  readonly members: ReadonlyArray<UUID>;
}
