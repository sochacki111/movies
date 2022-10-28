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
    // await this.moviesService.create(createMovieDto);
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

  @Get()
  async find(@Query() filter: GetMoviesDto) {
    return this.moviesService.find(filter);
  }
}
