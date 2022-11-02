import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Genre } from '../enums/genres.enum';

export class CreateMovieDto {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(Genre, { each: true })
  readonly genres: Set<Genre>;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  readonly year: number;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  readonly runtime: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly director: string;

  @IsOptional()
  @IsString()
  readonly actors?: string;

  @IsOptional()
  @IsString()
  readonly plot?: string;

  @IsOptional()
  @IsUrl()
  readonly posterUrl?: string;
}
