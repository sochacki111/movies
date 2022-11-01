import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Genre } from '../enums/genres.enum';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Genre, { each: true })
  genres: Genre[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsDefined()
  @IsNumber()
  year: number;

  @IsDefined()
  @IsNumber()
  @Min(0)
  runtime: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  director: string;

  @IsOptional()
  @IsString()
  actors?: string;

  @IsOptional()
  @IsString()
  plot?: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;
}
