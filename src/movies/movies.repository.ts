import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../common/config/app-config.service';
import { AppConfig } from '../common/config/config';
import { DbJsonService } from '../common/db/db-json.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Movie } from './entities/movie.entity';
import { Genre } from './enums/genres.enum';

@Injectable()
export class MoviesRepository {
  private readonly durationRange: AppConfig['durationRange'];

  constructor(
    private readonly dbJsonService: DbJsonService,
    private readonly configService: AppConfigService,
  ) {
    this.durationRange = this.configService.get('durationRange');
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const dbJson = await this.dbJsonService.read();

    const nextId = this.getNextId(dbJson.movies);

    const newMovie: Movie = {
      id: nextId,
      title: createMovieDto.title,
      year: createMovieDto.year.toString(),
      runtime: createMovieDto.runtime.toString(),
      genres: createMovieDto.genres,
      director: createMovieDto.director,
      actors: createMovieDto.actors || '',
      plot: createMovieDto.plot || '',
      posterUrl: createMovieDto.posterUrl || '',
    };

    dbJson.movies.push(newMovie);

    await this.dbJsonService.save(dbJson);

    return newMovie;
  }

  async findAll(filter?: GetMoviesDto): Promise<Movie[]> {
    const allMovies = (await this.dbJsonService.read()).movies;
    let foundMovies = allMovies;

    if (filter?.duration) {
      foundMovies = this.filterDuration(allMovies, filter.duration);
    }

    if (filter?.genres) {
      foundMovies = this.filterByGenres(foundMovies, filter.genres);
    }

    return foundMovies;
  }

  private getNextId(movies: Movie[]): number {
    // TODO Make generic
    return movies.reduce((acc: number, curr) => Math.max(acc, curr.id), 0) + 1;
  }

  private filterDuration(movies: Movie[], duration: number): Movie[] {
    return movies.filter(
      (movie) =>
        +movie.runtime >= duration - this.durationRange &&
        +movie.runtime <= duration + this.durationRange,
    );
  }

  private filterByGenres(movies: Movie[], genres: Genre[]): Movie[] {
    const moviesWithMatchScore = movies.map((movie) => {
      const matchScore = genres.filter((genre) =>
        movie.genres.includes(genre),
      ).length;
      return { ...movie, matchScore };
    });

    return moviesWithMatchScore
      .filter((movie) => movie.matchScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .map((movie) => {
        return {
          id: movie.id,
          genres: movie.genres,
          title: movie.title,
          actors: movie.actors,
          director: movie.director,
          plot: movie.plot,
          posterUrl: movie.posterUrl,
          runtime: movie.runtime,
          year: movie.year,
        };
      });
  }
}
