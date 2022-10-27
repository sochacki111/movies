import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream } from 'fs';
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
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(@Query() filter: GetMoviesDto, @Res() res: Response) {
    // TODO Hide in env
    const readStream = createReadStream(
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
