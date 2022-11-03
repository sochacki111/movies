import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDefined,
  IsEnum,
  IsInt,
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
  @ApiProperty({ enum: Genre, isArray: true, type: Set<Genre> })
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(Genre, { each: true })
  readonly genres: Set<Genre>;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @ApiProperty({ type: 'integer', minimum: 1 })
  @IsDefined()
  @IsInt()
  @IsPositive()
  readonly year: number;

  @ApiProperty({ minimum: 1 })
  @IsDefined()
  @IsNumber()
  @IsPositive()
  readonly runtime: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly director: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly actors?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly plot?: string;

  @ApiProperty({ required: false, example: 'https://test.jpg' })
  @IsOptional()
  @IsUrl()
  readonly posterUrl?: string;
}
