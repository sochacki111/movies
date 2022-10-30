import { Test, TestingModule } from '@nestjs/testing';
import { DbJsonService } from '../db/db-json.service';
import { GetMoviesDto } from './dto/get-movies.dto';
import { Genre } from './enums/genres.enum';
import { MoviesRepository } from './movies.repository';

describe('MoviesRepository', () => {
  let moviesRepository: MoviesRepository;
  let dbJsonService: DbJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesRepository, DbJsonService],
    }).compile();

    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
    dbJsonService = module.get<DbJsonService>(DbJsonService);
  });

  it('should be defined', () => {
    expect(moviesRepository).toBeDefined();
  });

  describe('findAll', () => {
    const dbJson = {
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
