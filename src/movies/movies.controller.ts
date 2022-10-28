import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import fs from 'fs';
import JSONStream from 'JSONStream';
import { join } from 'path';
import { Transform } from 'stream';
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

  @Get()
  findAll(@Query() filter: GetMoviesDto, @Res() res: Response) {
    // TODO Hide in env
    const readStream = fs.createReadStream(
      join(process.cwd(), 'src', 'db', 'db.json'),
      'utf-8',
    );

    const durationTransformer = new Transform({
      objectMode: true,
      transform(jsonItem, encoding, callback): void {
        const runtime = Number(jsonItem.runtime);
        if (runtime >= filter.duration - 10 && runtime <= filter.duration) {
          callback(null, jsonItem);
        } else {
          callback(); // Dont push chunk
        }
      },
    });

    const filteredMovies = [];

    const genreTransformer = new Transform({
      objectMode: true,
      transform(jsonItem, encoding, callback): void {
        const intersection = filter.genres.filter((element) =>
          jsonItem.genres.includes(element),
        ).length;

        if (intersection) {
          filteredMovies.push({ ...jsonItem, intersection });
        }
        callback();
      },
    });

    readStream
      .pipe(JSONStream.parse('movies.*')) // TODO remove hardcoded movies
      .pipe(durationTransformer) // TODO Make one tranformer module
      .pipe(genreTransformer)
      .pipe(JSONStream.stringify()) // TODO Convert it back to JSON
      .on('end', () => {
        const sortedMovies = filteredMovies.sort(
          (a, b) => b.intersection - a.intersection,
        );
        res.send(sortedMovies); // TODO Implement mapper to remove intersection property
      });
  }
}
