import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { MoviesRepository } from './movies.repository';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async create(createMovieDto: CreateMovieDto) {
    return await this.moviesRepository.create(createMovieDto);
  }

  async find(filter: GetMoviesDto) {
    const movies = await this.moviesRepository.findAll(filter);

    if (!filter || !filter.genres) {
      const randomMovie = this.getRandomMovie(movies);

      return randomMovie;
    }

    return movies;
  }

  private getRandomMovie(movies: any[]) {
    return movies[Math.floor(Math.random() * movies.length)];
  }
}
