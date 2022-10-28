import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { GetMoviesDto } from './dto/get-movies.dto';
import fs from 'fs';

@Injectable()
export class MoviesRepository {
  async findAll(filter?: GetMoviesDto) {
    const dbFile = await fs.promises.readFile(
      join(process.cwd(), 'src', 'db', 'db.json'),
    );

    const allMovies = JSON.parse(dbFile.toString()).movies;
    let movies = allMovies;

    if (filter.duration) {
      movies = this.filterDuration(allMovies, filter.duration);
    }

    if (filter.genres) {
      movies = this.sortByGenres(movies, filter.genres);
    }

    return movies; // TODO Remove intersection
  }

  private filterDuration(movies, duration) {
    return movies.filter(
      (movie) =>
        movie.runtime >= duration - 10 && movie.runtime <= duration + 10, // TODO Set 10 in env
    );
  }

  private sortByGenres(movies, genres) {
    movies.map((movie) => {
      const intersection = genres.filter((genre) =>
        movie.genres.includes(genre),
      ).length;
      return { ...movie, intersection };
    });
    return movies.sort((a, b) => b.intersection - a.intersection);
  }
}
