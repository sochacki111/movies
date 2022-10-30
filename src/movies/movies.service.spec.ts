import { Test, TestingModule } from '@nestjs/testing';
import { DbJsonService } from '../db/db-json.service';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService, MoviesRepository, DbJsonService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
