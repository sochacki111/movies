import { Genre } from '../enums/genres.enum';

export class Movie {
  id: number;

  genres: Genre[];

  title: string;

  year: string;

  runtime: string;

  director: string;

  actors: string;

  plot: string;

  posterUrl: string;
}
