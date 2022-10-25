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
  findAll(@Query() filter: GetMoviesDto) {
    console.log('filter', filter);

    // TODO Hide in env
    const input = createReadStream(
      join(process.cwd(), 'src', 'db', 'db.json'),
      'utf-8',
    );
    const data = [];
    const durationTransformer = new Transform({
      objectMode: true,
      transform(jsonItem, encoding, callback) {
        const runtime = Number(jsonItem.runtime);
        if (runtime >= filter.duration - 10 && runtime <= filter.duration) {
          // if (jsonItem.genres)
          // data.push(jsonItem);
          // console.log('array: ' + data);

          callback(null, jsonItem);
        } else {
          // callback(null, Buffer.alloc(0));
          callback(); // Dont push chunk
        }
      },
    });

    const genreTransformer = new Transform({
      objectMode: true,
      transform(jsonItem, encoding, callback) {
        const givenGenreSize = new Set(filter.genres).size;
        const movieGenres = jsonItem.genres;
        const movieGenreSize = movieGenres.length;
        // console.log('givenGenreSize', givenGenreSize);
        // console.log('movieGenres', movieGenres);
        // console.log('movieGenreSize', movieGenreSize);

        const genreSize = new Set([...jsonItem.genres, ...filter.genres]).size;

        if (genreSize < givenGenreSize + movieGenreSize) {
          // if (jsonItem.genres)
          data.push({ ...jsonItem, size: genreSize });
          // console.log('array: ' + data);

          // callback(null, jsonItem); // is it necessary?
          callback();
        } else {
          callback();
        }
      },
    });

    input
      .pipe(JSONStream.parse('movies.*')) // TODO remove hardcoded movies
      .pipe(durationTransformer)
      .pipe(genreTransformer)
      .pipe(JSONStream.stringify()) // Convert it back to JSON
      // .pipe(res)
      .on('end', () => {
        const newData = data.sort((a, b) => a.size - b.size);
        console.log('data: ', newData);
        // return 'hello';
      });
    // return;
  }
}
