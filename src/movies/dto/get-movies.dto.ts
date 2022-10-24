import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Genre } from '../enums/genres.enum';

export class GetMoviesDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Genre, { each: true })
  readonly genres?: Genre[];
}
