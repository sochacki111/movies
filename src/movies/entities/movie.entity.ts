import { ApiProperty } from '@nestjs/swagger';
import { Genre } from '../enums/genres.enum';

export class Movie {
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: Genre,
    isArray: true,
    type: Set<Genre>,
  })
  genres: Set<Genre>;

  @ApiProperty()
  title: string;

  @ApiProperty()
  year: string;

  @ApiProperty()
  runtime: string;

  @ApiProperty()
  director: string;

  @ApiProperty()
  actors: string;

  @ApiProperty()
  plot: string;

  @ApiProperty()
  posterUrl: string;
}
