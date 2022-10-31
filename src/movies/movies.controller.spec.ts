import { Test, TestingModule } from '@nestjs/testing';
import { DbJsonService } from '../db/db-json.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Movie } from './entities/movie.entity';
import { Genre } from './enums/genres.enum';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService, MoviesRepository, DbJsonService],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(moviesController).toBeDefined();
  });

  describe('create', () => {
    it('should add new movie with optional fields', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'test',
        year: 2000,
        runtime: 130,
        genres: [Genre.Biography, Genre.Comedy, Genre.Drama],
        director: 'test test',
        actors:
          'test test, Ryan Gosling, Rudy Eisenzopf, Casey Groves, Charlie Talbert',
        plot: 'test plot.',
        posterUrl: 'https://test.jpg',
      };

      const insertedMovie: Movie = {
        id: expect.any(Number),
        title: createMovieDto.title,
        year: createMovieDto.year.toString(),
        runtime: createMovieDto.runtime.toString(),
        genres: createMovieDto.genres,
        director: createMovieDto.director,
        actors: createMovieDto.actors!,
        plot: createMovieDto.plot!,
        posterUrl: createMovieDto.posterUrl!,
      };

      jest
        .spyOn(moviesService, 'create')
        .mockImplementation(async () => insertedMovie);

      const result = await moviesController.create(createMovieDto);

      expect(result).toStrictEqual(insertedMovie);
    });

    it('should add new movie without optional fields', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'test',
        year: 2000,
        runtime: 130,
        genres: [Genre.Biography, Genre.Comedy, Genre.Drama],
        director: 'test test',
      };

      const insertedMovie: Movie = {
        id: expect.any(Number),
        title: createMovieDto.title,
        year: createMovieDto.year.toString(),
        runtime: createMovieDto.runtime.toString(),
        genres: createMovieDto.genres,
        director: createMovieDto.director,
        actors: '',
        plot: '',
        posterUrl: '',
      };

      jest
        .spyOn(moviesService, 'create')
        .mockImplementation(async () => insertedMovie);

      const result = await moviesController.create(createMovieDto);

      expect(result).toStrictEqual(insertedMovie);
    });
  });

  describe('find', () => {
    it('should return random movie filtered by duration', async () => {
      const randomMovieFilteredByDuration = {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
        runtime: '92',
        genres: [Genre.Comedy, Genre.Fantasy],
        director: 'Tim Burton',
        actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
        plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
      };

      const filter: GetMoviesDto = { duration: 100 };

      jest
        .spyOn(moviesService, 'find')
        .mockImplementation(async () => randomMovieFilteredByDuration);

      const result = await moviesController.find(filter);

      expect(result).toStrictEqual(randomMovieFilteredByDuration);
    });

    it('should return an array of movies filtered by genre', async () => {
      const moviesFilteredByGenre = [
        {
          id: 1,
          genres: [Genre.Comedy, Genre.Fantasy],
          title: 'Beetlejuice',
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          director: 'Tim Burton',
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
          runtime: '92',
          year: '1988',
        },
        {
          id: 38,
          genres: [Genre.Comedy, Genre.Fantasy, Genre.Romance],
          title: 'Midnight in Paris',
          actors: 'Owen Wilson, Rachel McAdams, Kurt Fuller, Mimi Kennedy',
          director: 'Woody Allen',
          plot: "While on a trip to Paris with his fiancée's family, a nostalgic screenwriter finds himself mysteriously going back to the 1920s everyday at midnight.",
          posterUrl:
            'http://ia.media-imdb.com/images/M/MV5BMTM4NjY1MDQwMl5BMl5BanBnXkFtZTcwNTI3Njg3NA@@._V1_SX300.jpg',
          runtime: '94',
          year: '2011',
        },
      ];

      const filter: GetMoviesDto = { genres: [Genre.Comedy] };

      jest
        .spyOn(moviesService, 'find')
        .mockImplementation(async () => moviesFilteredByGenre);

      const result = await moviesController.find(filter);

      expect(result).toStrictEqual(moviesFilteredByGenre);
    });

    it('should return an array of movies filtered by duration and genre', async () => {
      const moviesFilteredByDurationAndGenre = [
        {
          id: 1,
          genres: [Genre.Comedy, Genre.Fantasy],
          title: 'Beetlejuice',
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          director: 'Tim Burton',
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
          runtime: '92',
          year: '1988',
        },
        {
          id: 38,
          genres: [Genre.Comedy, Genre.Fantasy, Genre.Romance],
          title: 'Midnight in Paris',
          actors: 'Owen Wilson, Rachel McAdams, Kurt Fuller, Mimi Kennedy',
          director: 'Woody Allen',
          plot: "While on a trip to Paris with his fiancée's family, a nostalgic screenwriter finds himself mysteriously going back to the 1920s everyday at midnight.",
          posterUrl:
            'http://ia.media-imdb.com/images/M/MV5BMTM4NjY1MDQwMl5BMl5BanBnXkFtZTcwNTI3Njg3NA@@._V1_SX300.jpg',
          runtime: '94',
          year: '2011',
        },
      ];
      const filter: GetMoviesDto = { duration: 100, genres: [Genre.Comedy] };

      jest
        .spyOn(moviesService, 'find')
        .mockImplementation(async () => moviesFilteredByDurationAndGenre);

      const result = await moviesController.find(filter);
      expect(result).toStrictEqual(moviesFilteredByDurationAndGenre);
    });

    it('should return random movie', async () => {
      const randomMovie = {
        id: 1,
        genres: [Genre.Comedy, Genre.Fantasy],
        title: 'Beetlejuice',
        actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
        director: 'Tim Burton',
        plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
        runtime: '92',
        year: '1988',
      };

      jest
        .spyOn(moviesService, 'find')
        .mockImplementation(async () => randomMovie);

      const result = await moviesController.find();

      expect(result).toStrictEqual(randomMovie);
    });
  });
});
