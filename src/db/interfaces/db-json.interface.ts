import { Movie } from '../../movies/entities/movie.entity';
import { Genre } from '../../movies/enums/genres.enum';

export interface DbJson {
  genres: Genre[];

  movies: Movie[];
}
