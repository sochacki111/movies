import { Transform } from 'class-transformer';
import { ArrayUnique, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Genre } from '../enums/genres.enum';

export class GetMoviesDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  readonly duration?: number;

  @IsOptional()
  @ArrayUnique()
  @IsEnum(Genre, { each: true })
  readonly genres?: Set<Genre>;
}
