import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import fs from 'fs';
import { join } from 'path';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    const dbFile = await fs.promises.readFile(
      join(process.cwd(), 'src', 'db', 'db.json'),
    );
    const dbJson = JSON.parse(dbFile.toString());

    const nextId =
      dbJson.movies.reduce((acc, curr) => Math.max(acc, curr.id), 0) + 1;

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

  private getRandomMovie(movies: any[]) {
    return movies[Math.floor(Math.random() * movies.length)];
  }

  @Get()
  async findAll(@Query() filter: GetMoviesDto) {
    console.log('filter: ', filter);

    const dbFile = await fs.promises.readFile(
      join(process.cwd(), 'src', 'db', 'db.json'),
    );
    const dbJson = JSON.parse(dbFile.toString());
    const allMovies = dbJson.movies;
    let movies = allMovies;

    if (filter.duration) {
      movies = allMovies.filter(
        (movie) =>
          movie.runtime >= filter.duration - 10 &&
          movie.runtime <= filter.duration + 10,
      );
    }

    if (filter.genres) {
      // Mutate movies
      movies.forEach((movie) => {
        const intersection = filter.genres.filter((genre) =>
          movie.genres.includes(genre),
        ).length;
        movie.intersection = intersection;
      });
      movies.sort((a, b) => b.intersection - a.intersection);
    }

    if (!filter || !filter.genres) {
      const randomMovie = this.getRandomMovie(movies);

      return randomMovie;
    }

    return movies;
  }
}
