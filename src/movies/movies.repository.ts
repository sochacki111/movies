import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { join } from 'path';
import { DbJson } from '../db/interfaces/db-json.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Movie } from './entities/movie.entity';
import { Genre } from './enums/genres.enum';

@Injectable()
export class MoviesRepository {
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const dbJson = await this.getDbFileAsJson();

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

    await this.saveDbFile(dbJson);

    return newMovie;
  }

  async findAll(filter?: GetMoviesDto): Promise<Movie[]> {
    const allMovies = (await this.getDbFileAsJson()).movies;
    let foundMovies = allMovies;

    if (filter?.duration) {
      foundMovies = this.filterDuration(allMovies, filter.duration);
    }

    if (filter?.genres) {
      foundMovies = this.sortByGenres(foundMovies, filter.genres);
    }

    return foundMovies;
  }

  private getNextId(movies: Movie[]): number {
    // TODO Make generic
    return movies.reduce((acc: number, curr) => Math.max(acc, curr.id), 0) + 1;
  }

  // TODO Move generic
  private async saveDbFile(dbJson: DbJson): Promise<void> {
    await fs.promises.writeFile(
      // TODO Hide in env
      join(process.cwd(), 'src', 'db', 'db.json'),
      JSON.stringify(dbJson, null, 2),
    );
  }

  // TODO Move generic
  private async getDbFileAsJson(): Promise<DbJson> {
    // TODO Hide in env
    const dbFile = await fs.promises.readFile(
      join(process.cwd(), 'src', 'db', 'db.json'),
    );
    return JSON.parse(dbFile.toString());
  }

  private filterDuration(movies: Movie[], duration: number): Movie[] {
    return movies.filter(
      (movie) =>
        +movie.runtime >= duration - 10 && +movie.runtime <= duration + 10, // TODO Set 10 in env
    );
  }

  private sortByGenres(movies: Movie[], genres: Genre[]): Movie[] {
    return movies.sort((a, b) => {
      const aIntersection = genres.filter((genre) => {
        a.genres.includes(genre);
      }).length;

      const bIntersection = genres.filter((genre) => {
        b.genres.includes(genre);
      }).length;

      return bIntersection - aIntersection;
    });
  }
}
