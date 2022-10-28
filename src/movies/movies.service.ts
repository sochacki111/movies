import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Movie } from './entities/movie.entity';
import { MoviesRepository } from './movies.repository';

// TODO Map movies
@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.moviesRepository.create(createMovieDto);
  }

  async find(filter: GetMoviesDto): Promise<Movie | Movie[]> {
    const movies = await this.moviesRepository.findAll(filter);

    if (!filter || !filter.genres) {
      const randomMovie = this.getRandomMovie(movies);

      return randomMovie;
    }

    return movies;
  }

  // TODO Move to repository?
  private getRandomMovie(movies: Movie[]): Movie {
    return movies[Math.floor(Math.random() * movies.length)];
  }
}
