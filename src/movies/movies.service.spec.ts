import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getConfigServiceMock, TestAppConfig } from '../../test/helper';
import { AppConfigService } from '../common/config/app-config.service';
import { DbJsonService } from '../common/db/db-json.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Movie } from './entities/movie.entity';
import { Genre } from './enums/genres.enum';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let moviesRepository: MoviesRepository;

  const config: TestAppConfig = {
    durationRange: 10,
    dbJsonPath: 'path/mock',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        MoviesRepository,
        DbJsonService,
        AppConfigService,
        {
          provide: ConfigService,
          useFactory: getConfigServiceMock(config),
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
  });

  it('should be defined', () => {
    expect(moviesService).toBeDefined();
  });

  describe('create', () => {
    it('should add new movie with optional fields', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'test',
        year: 2000,
        runtime: 130,
        genres: new Set([Genre.Biography, Genre.Comedy, Genre.Drama]),
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
        .spyOn(moviesRepository, 'create')
        .mockImplementation(async () => insertedMovie);

      const result = await moviesService.create(createMovieDto);

      expect(result).toStrictEqual(insertedMovie);
    });

    it('should add new movie without optional fields', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'test',
        year: 2000,
        runtime: 130,
        genres: new Set([Genre.Biography, Genre.Comedy, Genre.Drama]),
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
        .spyOn(moviesRepository, 'create')
        .mockImplementation(async () => insertedMovie);

      const result = await moviesService.create(createMovieDto);

      expect(result).toStrictEqual(insertedMovie);
    });
  });

  describe('find', () => {
    it('should return random movie filtered by duration', async () => {
      const moviesFilteredByDuration = [
        {
          id: 1,
          title: 'Beetlejuice',
          year: '1988',
          runtime: '92',
          genres: new Set([Genre.Comedy, Genre.Fantasy]),
          director: 'Tim Burton',
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
        },
        {
          id: 38,
          genres: new Set([Genre.Comedy, Genre.Fantasy, Genre.Romance]),
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

      const filter: GetMoviesDto = { duration: 100 };

      jest
        .spyOn(moviesRepository, 'findAll')
        .mockImplementation(async () => moviesFilteredByDuration);

      const result = await moviesService.find(filter);
      expect(result).toStrictEqual({
        id: expect.any(Number),
        title: expect.any(String),
        year: expect.any(String),
        runtime: expect.any(String),
        genres: expect.any(Set<Genre>),
        director: expect.any(String),
        actors: expect.any(String),
        plot: expect.any(String),
        posterUrl: expect.any(String),
      });

      // expect(Number((result as Movie).runtime)).toBeGreaterThanOrEqual() // TODO check if duration between 10
    });

    it('should return an array of movies filtered by genres', async () => {
      const moviesFilteredByGenre = [
        {
          id: 1,
          genres: new Set([Genre.Comedy, Genre.Fantasy]),
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
          genres: new Set([Genre.Comedy, Genre.Fantasy, Genre.Romance]),
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

      const filter: GetMoviesDto = { genres: new Set([Genre.Comedy]) };

      jest
        .spyOn(moviesRepository, 'findAll')
        .mockImplementation(async () => moviesFilteredByGenre);

      const result = await moviesService.find(filter);

      expect(result).toStrictEqual(moviesFilteredByGenre);
    });

    it('should return an array of movies filtered by duration and genres', async () => {
      const moviesFilteredByDurationAndGenre = [
        {
          id: 1,
          genres: new Set([Genre.Comedy, Genre.Fantasy]),
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
          genres: new Set([Genre.Comedy, Genre.Fantasy, Genre.Romance]),
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
      const filter: GetMoviesDto = {
        duration: 100,
        genres: new Set([Genre.Comedy]),
      };

      jest
        .spyOn(moviesRepository, 'findAll')
        .mockImplementation(async () => moviesFilteredByDurationAndGenre);

      const result = await moviesService.find(filter);
      expect(result).toStrictEqual(moviesFilteredByDurationAndGenre);
    });

    it('should return random movie', async () => {
      const allMovies = [
        {
          id: 1,
          genres: new Set([Genre.Comedy, Genre.Fantasy]),
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
          genres: new Set([Genre.Comedy, Genre.Fantasy, Genre.Romance]),
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

      jest
        .spyOn(moviesRepository, 'findAll')
        .mockImplementation(async () => allMovies);

      const result = await moviesService.find();

      expect(result).toStrictEqual({
        id: expect.any(Number),
        title: expect.any(String),
        year: expect.any(String),
        runtime: expect.any(String),
        genres: expect.any(Set<Genre>),
        director: expect.any(String),
        actors: expect.any(String),
        plot: expect.any(String),
        posterUrl: expect.any(String),
      });
    });

    it('should throw NotFound on not existing random movie', async () => {
      const emptyMovies: Movie[] = [];

      jest
        .spyOn(moviesRepository, 'findAll')
        .mockImplementation(async () => emptyMovies);

      await expect(moviesService.find()).rejects.toEqual(
        new NotFoundException(),
      );
    });
  });
});
