import { ApiProperty } from '@nestjs/swagger';
import { Alignment, UUID } from '@super-heros/data';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateHeroDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    minLength: 2,
    maxLength: 255,
    example: 'Superman',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(Alignment)
  @ApiProperty({ enum: Alignment, example: Alignment.GOOD })
  readonly alignment: Alignment;

  @IsNotEmpty()
  @IsArray()
  @IsUUID(4, { each: true })
  @ApiProperty({
    type: String,
    isArray: true,
    example: ['8c9383fe-5615-48ff-9ef5-9c86436fad69'],
  })
  readonly team: ReadonlyArray<UUID>;
}
