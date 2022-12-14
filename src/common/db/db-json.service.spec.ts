import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import fs from 'fs';
import { getConfigServiceMock, TestAppConfig } from '../../../test/helper';
import { Genre } from '../../movies/enums/genres.enum';
import { AppConfigService } from '../config/app-config.service';
import { DbJsonService } from './db-json.service';
import { DbJson } from './interfaces/db-json.interface';

describe('DbJsonService', () => {
  let dbJsonService: DbJsonService;

  const config: TestAppConfig = {
    durationRange: 10,
    dbJsonPath: 'path/mock',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbJsonService,
        AppConfigService,
        {
          provide: ConfigService,
          useFactory: getConfigServiceMock(config),
        },
      ],
    }).compile();

    dbJsonService = module.get<DbJsonService>(DbJsonService);
  });

  it('should be defined', () => {
    expect(dbJsonService).toBeDefined();
  });

  describe('read', () => {
    it('should read from json file', async () => {
      const jsonFileContent =
        '{"genres":["Comedy","Fantasy","Crime","Drama","Music","Adventure","History","Thriller","Animation","Family","Mystery","Biography","Action","Film-Noir","Romance","Sci-Fi","War","Western","Horror","Musical","Sport"],"movies":[{"id":1,"title":"Beetlejuice","year":"1988","runtime":"92","genres":["Comedy","Fantasy"],"director":"Tim Burton","actors":"Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page","plot":"A couple of recently deceased ghosts contract the services of a \\"bio-exorcist\\" in order to remove the obnoxious new owners of their house.","posterUrl":"https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg"},{"id":2,"title":"The Cotton Club","year":"1984","runtime":"127","genres":["Crime","Drama","Music"],"director":"Francis Ford Coppola","actors":"Richard Gere, Gregory Hines, Diane Lane, Lonette McKee","plot":"The Cotton Club was a famous night club in Harlem. The story follows the people that visited the club, those that ran it, and is peppered with the Jazz music that made it so famous.","posterUrl":"https://images-na.ssl-images-amazon.com/images/M/MV5BMTU5ODAyNzA4OV5BMl5BanBnXkFtZTcwNzYwNTIzNA@@._V1_SX300.jpg"}]}';
      JSON.parse(jsonFileContent);

      jest
        .spyOn(fs.promises, 'readFile')
        .mockImplementation(async () => jsonFileContent);

      const result = await dbJsonService.read();

      expect(fs.promises.readFile).toHaveBeenCalled();
      expect(result).toStrictEqual(JSON.parse(jsonFileContent));
    });

    it('should throw InternalServerErrorException on data not in json format', async () => {
      const fileContentNotInJson = 'fileContentNotInJson';

      jest
        .spyOn(fs.promises, 'readFile')
        .mockImplementation(async () => fileContentNotInJson);

      await expect(dbJsonService.read()).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });

  describe('save', () => {
    it('should save json file', async () => {
      const dbJson: DbJson = {
        genres: new Set(Object.values(Genre)),
        movies: [
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
            id: 2,
            title: 'The Cotton Club',
            year: '1984',
            runtime: '127',
            genres: new Set([Genre.Crime, Genre.Drama, Genre.Music]),
            director: 'Francis Ford Coppola',
            actors: 'Richard Gere, Gregory Hines, Diane Lane, Lonette McKee',
            plot: 'The Cotton Club was a famous night club in Harlem. The story follows the people that visited the club, those that ran it, and is peppered with the Jazz music that made it so famous.',
            posterUrl:
              'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU5ODAyNzA4OV5BMl5BanBnXkFtZTcwNzYwNTIzNA@@._V1_SX300.jpg',
          },
        ],
      };

      jest
        .spyOn(fs.promises, 'writeFile')
        .mockImplementation(async () => Promise.resolve());

      await dbJsonService.save(dbJson);

      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on failed database save', async () => {
      jest.spyOn(fs.promises, 'writeFile').mockImplementation(async () => {
        throw new Error();
      });

      await expect(dbJsonService.read()).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });
});
