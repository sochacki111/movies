import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import fs from 'fs';
import { AppConfigService } from '../config/app-config.service';
import { AppConfig } from '../config/config';
import { DbJson } from './interfaces/db-json.interface';

@Injectable()
export class DbJsonService {
  private readonly logger = new Logger(DbJsonService.name);

  private readonly dbJsonPath: AppConfig['dbJsonPath'];

  constructor(private readonly configService: AppConfigService) {
    this.dbJsonPath = this.configService.get('dbJsonPath');
  }

  async read(): Promise<DbJson> {
    try {
      const dbFile = await fs.promises.readFile(this.dbJsonPath, {
        encoding: 'utf-8',
      });
      return JSON.parse(dbFile);
    } catch (err: unknown) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async save(dbJson: DbJson): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.dbJsonPath,
        JSON.stringify(dbJson, null, 2),
      );
    } catch (err: unknown) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
