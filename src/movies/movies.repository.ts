import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { GetMoviesDto } from './dto/get-movies.dto';
import fs from 'fs';
import { CreateMovieDto } from './dto/create-movie.dto';

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

  async create(createMovieDto: CreateMovieDto) {
    const dbJson = await this.getDbFileAsJson();

    const nextId = this.getNextId(dbJson.movies);

    const newMovie = {
      id: nextId,
      title: createMovieDto.title,
      year: createMovieDto.year.toString(),
      runtime: createMovieDto.runtime.toString(),
      genres: createMovieDto.genres,
      director: createMovieDto.director,
      actors: createMovieDto.actors,
      plot: createMovieDto.plot,
      posterUrl: createMovieDto.posterUrl,
    };

    dbJson.movies.push(newMovie);

    await fs.promises.writeFile(
      join(process.cwd(), 'src', 'db', 'db.json'),
      JSON.stringify(dbJson, null, 2),
    );

    return newMovie;
  }

  private getNextId(movies) {
    // TODO Make generic
    return movies.reduce((acc: number, curr) => Math.max(acc, curr.id), 0) + 1;
  }

  private async getDbFileAsJson() {
    const dbFile = await fs.promises.readFile(
      join(process.cwd(), 'src', 'db', 'db.json'),
    );
    return JSON.parse(dbFile.toString());
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
