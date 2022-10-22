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
  findAll(@Res() res: Response, @Query() filter: GetMoviesDto) {
    console.log('filter', filter);

    // TODO Hide in env
    const input = createReadStream(
      join(process.cwd(), 'src', 'db', 'db.json'),
      'utf-8',
    );

    const transformer = new Transform({
      objectMode: true,
      transform(jsonItem, encoding, callback) {
        if (jsonItem.runtime === '130') {
          callback(null, jsonItem);
        } else {
          callback();
        }
      },
    });

    input
      .pipe(JSONStream.parse('movies.*'))
      .pipe(transformer)
      .pipe(JSONStream.stringify()) // Convert it back to JSON
      .pipe(res);
  }
}
