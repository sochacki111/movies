import { Test, TestingModule } from '@nestjs/testing';
import { DbJsonService } from '../db/db-json.service';
import { DbJson } from '../db/interfaces/db-json.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Genre } from './enums/genres.enum';
import { MoviesRepository } from './movies.repository';

describe('MoviesRepository', () => {
  let moviesRepository: MoviesRepository;
  let dbJsonService: DbJsonService;
  let dbJson: DbJson;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesRepository, DbJsonService],
    }).compile();

    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
    dbJsonService = module.get<DbJsonService>(DbJsonService);

    dbJson = {
      genres: [Genre.Comedy, Genre.Fantasy, Genre.Sport],
      movies: [
        {
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
        },
        {
          id: 2,
          title: 'The Cotton Club',
          year: '1984',
          runtime: '127',
          genres: [Genre.Crime, Genre.Drama, Genre.Music],
          director: 'Francis Ford Coppola',
          actors: 'Richard Gere, Gregory Hines, Diane Lane, Lonette McKee',
          plot: 'The Cotton Club was a famous night club in Harlem. The story follows the people that visited the club, those that ran it, and is peppered with the Jazz music that made it so famous.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU5ODAyNzA4OV5BMl5BanBnXkFtZTcwNzYwNTIzNA@@._V1_SX300.jpg',
        },
      ],
    };
  });

  it('should be defined', () => {
    expect(moviesRepository).toBeDefined();
  });

  describe('create', () => {
    it('should add new movie with optional fields', async () => {
      jest.spyOn(dbJsonService, 'read').mockImplementation(async () => dbJson);
      jest
        .spyOn(dbJsonService, 'save')
        .mockImplementation(async () => Promise.resolve());

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

      const result = await moviesRepository.create(createMovieDto);

      expect(result).toStrictEqual({
        id: expect.any(Number),
        title: createMovieDto.title,
        year: createMovieDto.year.toString(),
        runtime: createMovieDto.runtime.toString(),
        genres: createMovieDto.genres,
        director: createMovieDto.director,
        actors: createMovieDto.actors,
        plot: createMovieDto.plot,
        posterUrl: createMovieDto.posterUrl,
      });
    });

    it('should add new movie without optional fields', async () => {
      jest.spyOn(dbJsonService, 'read').mockImplementation(async () => dbJson);
      jest
        .spyOn(dbJsonService, 'save')
        .mockImplementation(async () => Promise.resolve());

      const createMovieDto: CreateMovieDto = {
        title: 'test',
        year: 2000,
        runtime: 130,
        genres: [Genre.Biography, Genre.Comedy, Genre.Drama],
        director: 'test test',
      };

      const result = await moviesRepository.create(createMovieDto);

      expect(result).toStrictEqual({
        id: expect.any(Number),
        title: createMovieDto.title,
        year: createMovieDto.year.toString(),
        runtime: createMovieDto.runtime.toString(),
        genres: createMovieDto.genres,
        director: createMovieDto.director,
        actors: '',
        plot: '',
        posterUrl: '',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of movies filtered by duration', async () => {
      const filter: GetMoviesDto = { duration: 100 };

      jest.spyOn(dbJsonService, 'read').mockImplementation(async () => dbJson);

      const result = await moviesRepository.findAll(filter);
      expect(result).toStrictEqual([dbJson.movies[0]]);
    });

    it('should return an array of movies filtered by genres', async () => {
      const filter: GetMoviesDto = { genres: [Genre.Comedy] };

      jest.spyOn(dbJsonService, 'read').mockImplementation(async () => dbJson);

      const result = await moviesRepository.findAll(filter);
      expect(result).toStrictEqual([dbJson.movies[0]]);
    });

    it('should return an array of movies filtered by duration and genres', async () => {
      const filter: GetMoviesDto = { duration: 100, genres: [Genre.Comedy] };

      jest.spyOn(dbJsonService, 'read').mockImplementation(async () => dbJson);

      const result = await moviesRepository.findAll(filter);
      expect(result).toStrictEqual([dbJson.movies[0]]);
    });

    it('should return all movies', async () => {
      jest.spyOn(dbJsonService, 'read').mockImplementation(async () => dbJson);

      const result = await moviesRepository.findAll();
      expect(result).toStrictEqual(dbJson.movies);
    });
  });
});
