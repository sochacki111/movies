import { Genre } from '../enums/genres.enum';

export class Movie {
  genres: Genre[];

  title: string;

  year: number;

  runtime: number;

  director: string;

  actors: string;

  plot: string;

  posterUrl: string;
}
