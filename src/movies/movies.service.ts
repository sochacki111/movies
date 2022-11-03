import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Movie } from './entities/movie.entity';
import { MoviesRepository } from './movies.repository';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.moviesRepository.create(createMovieDto);
  }

  async find(searchParams?: GetMoviesDto): Promise<Movie | Movie[]> {
    const movies = await this.moviesRepository.findAll(searchParams);

    if (!searchParams || !searchParams.genres) {
      const randomMovie = this.getRandomMovie(movies);

      return randomMovie;
    }

    return movies;
  }

  private getRandomMovie(movies: Movie[]): Movie {
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    if (randomMovie) {
      return randomMovie;
    }

    throw new NotFoundException();
  }
}
