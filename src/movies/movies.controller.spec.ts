import { Test, TestingModule } from '@nestjs/testing';
import { DbJsonService } from '../db/db-json.service';
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

  describe('find', () => {
    it('should return an array of movies', async () => {
      const expectedResult: any = ['test'];
      jest
        .spyOn(moviesService, 'find')
        .mockImplementation(() => expectedResult);

      const result = await moviesController.find();
      console.log('result', result);

      expect(result).toBe(expectedResult);
    });
  });
});
