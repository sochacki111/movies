import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiResponse({
    status: 201,
    type: Movie,
  })
  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.moviesService.create(createMovieDto);
  }

  @Get()
  async find(@Query() searchParams?: GetMoviesDto): Promise<Movie | Movie[]> {
    return await this.moviesService.find(searchParams);
  }
}
