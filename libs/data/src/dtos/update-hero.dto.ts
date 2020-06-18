import { ApiProperty } from '@nestjs/swagger';
import { Alignment, UUID } from '@super-heros/data';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateHeroDTO {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    type: String,
    minLength: 2,
    maxLength: 255,
    required: false,
    example: '1d5c02d6-1a8a-449d-b922-5749dab0c798',
  })
  readonly heroId: UUID;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    minLength: 2,
    maxLength: 255,
    required: false,
    example: 'Superman',
  })
  readonly name: string;

  @IsOptional()
  @IsEnum(Alignment)
  @ApiProperty({ enum: Alignment, required: false, example: Alignment.GOOD })
  readonly alignment: Alignment;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    example: ['8c9383fe-5615-48ff-9ef5-9c86436fad69'],
  })
  readonly team: ReadonlyArray<UUID>;
}
