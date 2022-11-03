import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Genre } from '../enums/genres.enum';

export class GetMoviesDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  readonly duration?: number;

  @ApiProperty({
    enum: Genre,
    isArray: true,
    type: Set<Genre>,
    required: false,
    name: 'genres[]',
  })
  @IsOptional()
  @ArrayUnique()
  @IsEnum(Genre, { each: true })
  readonly genres?: Set<Genre>;
}
