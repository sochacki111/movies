import { Test, TestingModule } from '@nestjs/testing';
import { DbJsonService } from './db-json.service';
import fs from 'fs';
import { DbJson } from './interfaces/db-json.interface';
import { Genre } from '../movies/enums/genres.enum';

describe('DbJsonService', () => {
  let dbJsonService: DbJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbJsonService],
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
  });

  describe('save', () => {
    it('should save json file', async () => {
      const dbJson: DbJson = {
        genres: [
          Genre.Comedy,
          Genre.Fantasy,
          Genre.Crime,
          Genre.Drama,
          Genre.Music,
          Genre.Adventure,
          Genre.History,
          Genre.Thriller,
          Genre.Animation,
          Genre.Family,
          Genre.Mystery,
          Genre.Biography,
          Genre.Action,
          Genre.Film_Noir,
          Genre.Romance,
          Genre.Sci_Fi,
          Genre.War,
          Genre.Western,
          Genre.Horror,
          Genre.Musical,
          Genre.Sport,
        ],
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

      jest
        .spyOn(fs.promises, 'writeFile')
        .mockImplementation(async () => Promise.resolve());

      await dbJsonService.save(dbJson);

      expect(fs.promises.writeFile).toHaveBeenCalled();
    });
  });
});
